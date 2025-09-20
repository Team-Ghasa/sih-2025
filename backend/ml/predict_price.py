import os
import sys
import json
from dataclasses import dataclass
from typing import Dict, Any, Optional, Tuple

import requests
import pandas as pd

"""
predict_price.py

This module provides a deterministic, local CSV-based estimator for agricultural
commodity prices and simple weather/geocoding helpers. IMPORTANT: this file does
NOT call any generative-AI or LLM services (Gemini, OpenAI, Anthropic, etc.).
All estimates are derived from the local CSV dataset and public weather/
geocoding APIs (Open-Meteo and Nominatim).
"""
# Use CSV/historical lookup estimator name
ESTIMATOR_NAME: str = "local-csv-estimator"

OPEN_METEO_GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search"
OPEN_METEO_WEATHER_URL = "https://api.open-meteo.com/v1/forecast"
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

DATASET_CSV_PATH = r"C:\Users\mkaka\OneDrive\Desktop\sih-2025\backend\csv\agridata_csv_202110311352.csv"

COMMODITY_UPLIFT: Dict[str, float] = {
	"cashew": 6.0,
	"cashewnut": 5.0,
	"cashewnuts": 5.0,
}


@dataclass
class WeatherSnapshot:
	latitude: float
	longitude: float
	name: str
	country: Optional[str]
	temperature_c: Optional[float]
	windspeed_kph: Optional[float]
	winddirection_deg: Optional[float]
	precipitation_mm: Optional[float]
	description: str


def try_open_meteo_geocode(location: str) -> Optional[Tuple[float, float, str, Optional[str]]]:
	params = {"name": location, "count": 1, "language": "en", "format": "json"}
	resp = requests.get(OPEN_METEO_GEOCODE_URL, params=params, timeout=15)
	resp.raise_for_status()
	data = resp.json()
	results = data.get("results") or []
	if not results:
		return None
	best = results[0]
	return (
		float(best["latitude"]),
		float(best["longitude"]),
		str(best.get("name", location)),
		best.get("country"),
	)


def try_nominatim_geocode(location: str) -> Optional[Tuple[float, float, str, Optional[str], Optional[str]]]:
	params = {"q": location, "format": "json", "limit": 1, "addressdetails": 1}
	headers = {"User-Agent": "price-predictor/1.0 (contact: local)"}
	resp = requests.get(NOMINATIM_URL, params=params, headers=headers, timeout=15)
	resp.raise_for_status()
	arr = resp.json() or []
	if not arr:
		return None
	item = arr[0]
	lat = float(item["lat"])  # type: ignore[index]
	lon = float(item["lon"])  # type: ignore[index]
	display = str(item.get("display_name") or location)
	addr = item.get("address") or {}
	state = addr.get("state") or addr.get("region")
	country = addr.get("country")
	return (lat, lon, display, country, state)


def geocode_location_and_state(location: str) -> Tuple[float, float, str, Optional[str], Optional[str]]:
	found = try_open_meteo_geocode(location)
	if found:
		lat, lon, label, country = found
		nom = try_nominatim_geocode(location)
		state = nom[4] if nom else None
		return lat, lon, label, country, state
	if "," in location:
		simple = location.split(",", 1)[0].strip()
		if simple:
			found = try_open_meteo_geocode(simple)
			if found:
				lat, lon, label, country = found
				nom = try_nominatim_geocode(location)
				state = nom[4] if nom else None
				return lat, lon, label, country, state
	nom = try_nominatim_geocode(location)
	if nom:
		lat, lon, label, country, state = nom
		return lat, lon, label, country, state
	raise ValueError(f"Could not geocode location: {location}")


def fetch_current_weather(lat: float, lon: float) -> Dict[str, Any]:
	params = {
		"latitude": lat,
		"longitude": lon,
		"current": [
			"temperature_2m",
			"precipitation",
			"wind_speed_10m",
			"wind_direction_10m",
		],
		"timezone": "auto",
	}
	resp = requests.get(OPEN_METEO_WEATHER_URL, params=params, timeout=15)
	resp.raise_for_status()
	return resp.json()


def build_weather_snapshot(location_label: str, country: Optional[str], lat: float, lon: float, weather_json: Dict[str, Any]) -> WeatherSnapshot:
	current = (weather_json or {}).get("current") or {}
	temp = current.get("temperature_2m")
	windspeed = current.get("wind_speed_10m")
	winddir = current.get("wind_direction_10m")
	precip = current.get("precipitation")
	description_parts = []
	if temp is not None:
		description_parts.append(f"Temperature: {temp} °C")
	if precip is not None:
		description_parts.append(f"Precipitation: {precip} mm")
	if windspeed is not None:
		description_parts.append(f"Wind: {windspeed} km/h")
	if winddir is not None:
		description_parts.append(f"Direction: {winddir}°")
	description = ", ".join(description_parts) if description_parts else ""
	return WeatherSnapshot(
		latitude=lat,
		longitude=lon,
		name=location_label,
		country=country,
		temperature_c=temp,
		windspeed_kph=windspeed,
		winddirection_deg=winddir,
		precipitation_mm=precip,
		description=description,
	)


def empty_weather_snapshot() -> WeatherSnapshot:
	"""Return an empty/placeholder WeatherSnapshot used in tests and dataset-only
	estimations. This is intentionally simple and deterministic (no external AI).
	"""
	return WeatherSnapshot(
		latitude=0.0,
		longitude=0.0,
		name="",
		country=None,
		temperature_c=None,
		windspeed_kph=None,
		winddirection_deg=None,
		precipitation_mm=None,
		description="",
	)


def load_dataset(csv_path: str = DATASET_CSV_PATH) -> pd.DataFrame:
	# Avoid DtypeWarning by disabling low_memory and reading strings safely
	dtype_map = {"commodity_name": "string", "state": "string", "district": "string", "market": "string", "date": "string"}
	df = pd.read_csv(csv_path, low_memory=False, dtype=dtype_map)
	# Coerce numeric columns
	for col in ["min_price", "max_price", "modal_price"]:
		df[col] = pd.to_numeric(df.get(col, pd.Series(dtype=float)), errors="coerce")
	df = df.dropna(subset=["modal_price"]).copy()
	df["date"] = pd.to_datetime(df["date"], errors="coerce")
	return df


def infer_unit_scale(df_crop: pd.DataFrame) -> float:
	if df_crop.empty:
		return 1.0
	m = float(df_crop["modal_price"].median())
	return 1.0 if m < 300 else 0.01


def compute_trend_stats(df: pd.DataFrame, crop_name: str, state_name: Optional[str]) -> Dict[str, Any]:
	df1 = df[df["commodity_name"].astype(str).str.contains(crop_name, case=False, na=False)]
	if state_name:
		df1 = df1[df1["state"].astype(str).str.contains(state_name, case=False, na=False)]
	if df1.empty:
		return {"rows": 0}
	df1 = df1.dropna(subset=["date"]).copy()
	scale = infer_unit_scale(df1)
	df1["perkg"] = pd.to_numeric(df1["modal_price"], errors="coerce") * scale
	date_min = df1["date"].min(); date_max = df1["date"].max()
	p25 = float(df1["perkg"].quantile(0.25)); p50 = float(df1["perkg"].median()); p75 = float(df1["perkg"].quantile(0.75))
	cut = date_max - pd.DateOffset(months=12)
	df_recent = df1[df1["date"] >= cut]
	p50_recent = float(df_recent["perkg"].median()) if not df_recent.empty else None
	# Unrealistic price scan
	warn_unrealistic = bool(((df1["perkg"] < 1) | (df1["perkg"] > 1000)).any())
	return {
		"rows": int(len(df1)),
		"date_min": date_min.strftime("%Y-%m-%d") if pd.notna(date_min) else None,
		"date_max": date_max.strftime("%Y-%m-%d") if pd.notna(date_max) else None,
		"perkg_median_all": p50,
		"perkg_median_12m": p50_recent,
		"perkg_p25_all": p25,
		"perkg_p75_all": p75,
		"unit_scale": scale,
		"warn_unrealistic": warn_unrealistic,
	}


def get_uplift_for_crop(crop_name: str) -> float:
	c = crop_name.lower()
	for key, val in COMMODITY_UPLIFT.items():
		if key in c:
			return float(val)
	return 1.0


def get_pricing_recommendations(crop_name: str, market_price: float) -> Dict[str, Any]:
	"""Provide pricing recommendations based on crop type and market conditions"""
	recommendations = {
		"optimal_profit_margin": 15.0,
		"optimal_distributor_markup": 30.0,
		"notes": []
	}
	
	crop_lower = crop_name.lower()
	
	# Adjust recommendations based on crop type
	if any(term in crop_lower for term in ["rice", "wheat", "maize", "corn"]):
		recommendations["optimal_profit_margin"] = 12.0
		recommendations["optimal_distributor_markup"] = 25.0
		recommendations["notes"].append("Staple crops typically have lower margins")
	elif any(term in crop_lower for term in ["cashew", "almond", "walnut", "pistachio"]):
		recommendations["optimal_profit_margin"] = 20.0
		recommendations["optimal_distributor_markup"] = 35.0
		recommendations["notes"].append("Premium nuts command higher margins")
	elif any(term in crop_lower for term in ["spice", "turmeric", "cardamom", "pepper"]):
		recommendations["optimal_profit_margin"] = 18.0
		recommendations["optimal_distributor_markup"] = 32.0
		recommendations["notes"].append("Spices have good profit potential")
	elif any(term in crop_lower for term in ["vegetable", "tomato", "onion", "potato"]):
		recommendations["optimal_profit_margin"] = 10.0
		recommendations["optimal_distributor_markup"] = 20.0
		recommendations["notes"].append("Perishable vegetables require quick turnover")
	
	# Adjust based on market price
	if market_price < 20:
		recommendations["notes"].append("Low-value crop - consider volume discounts")
	elif market_price > 100:
		recommendations["notes"].append("High-value crop - premium pricing possible")
	
	return recommendations


def estimate_price_from_csv(crop_name: str, kilograms: float, location_label: str, weather: WeatherSnapshot, trend: Dict[str, Any]) -> Dict[str, Any]:
	"""Estimate price using CSV historical trends and simple rules.

	Deterministic calculation that uses medians/quantiles from the dataset
	and crop uplift rules.
	"""
	uplift = get_uplift_for_crop(crop_name)
	median = float(trend.get("perkg_median_12m") or trend.get("perkg_median_all") or 0.0)
	p25 = float(trend.get("perkg_p25_all") or median)
	p75 = float(trend.get("perkg_p75_all") or median)
	median_u = median * uplift
	p25_u = p25 * uplift
	p75_u = p75 * uplift

	lower_hint = round(max(0.1, p25_u * 0.9, median_u * 0.7), 2)
	upper_hint = round(max(median_u * 1.5, p75_u * 1.3, lower_hint + 10), 2)

	# Simple weather adjustment: if heavy precipitation recently, nudge price down slightly
	weather_adj = 0.0
	if weather.precipitation_mm and weather.precipitation_mm > 50:
		weather_adj = -0.05
	elif weather.precipitation_mm and weather.precipitation_mm > 10:
		weather_adj = -0.02

	# Choose price anchor: prefer 12-month median if available
	anchor = median_u if (trend.get("perkg_median_12m") is not None) else median_u

	# Apply a modest random-less heuristic: if recent median exists and is > overall median, bias up
	if trend.get("perkg_median_12m") and trend.get("perkg_median_12m") > trend.get("perkg_median_all", 0):
		anchor *= 1.03

	# Apply weather adjustment and clamp to hints
	price_per_kg = round(max(lower_hint, min(anchor * (1 + weather_adj), upper_hint)), 2)
	total_price = round(price_per_kg * float(kilograms), 2)

	assumptions = (
		f"Derived from dataset medians (median={median:.2f}, uplift={uplift}). "
		f"Clamped to hints [{lower_hint}, {upper_hint}]."
	)

	return {
		"crop_name": crop_name,
		"quantity_kg": float(kilograms),
		"price_per_kg": price_per_kg,
		"currency": "INR",
		"total_price": total_price,
		"weather_summary": weather.description if weather.description else None,
		"location": location_label,
		"model": ESTIMATOR_NAME,
		"assumptions": assumptions,
	}


def get_validated_input() -> Tuple[str, float, str]:
	while True:
		crop = input("Enter crop name: ").strip()
		if not crop:
			print("Please enter a crop name.")
			continue
		kg_str = input("Enter kilograms (e.g., 1.5): ").strip()
		try:
			kg = float(kg_str)
			if kg <= 0:
				print("Kilograms must be a positive number.")
				continue
		except Exception:
			print("Please enter a valid number for kilograms.")
			continue
		location = input("Enter location (e.g., Chennai, IN): ").strip()
		if not location:
			print("Please enter a location.")
			continue
		return crop, kg, location

# Set default margins/markups
# Typical farmer to distributor margin: 5%–10%
DEFAULT_PROFIT_MARGIN = 10.0  # Set to 10% (can adjust to 5% if needed)
DEFAULT_DISTRIBUTOR_MARKUP = 30.0
DEFAULT_RETAILER_MARKUP = 20.0

def print_human_readable(estimate: Dict[str, Any], trend: Dict[str, Any], profit_margin: float = DEFAULT_PROFIT_MARGIN, distributor_markup: float = DEFAULT_DISTRIBUTOR_MARKUP, retailer_markup: float = DEFAULT_RETAILER_MARKUP) -> None:
    print("\n================= PRICE BREAKDOWN =================\n")
    print(f"Crop: {estimate.get('crop_name')}")
    print(f"Quantity: {estimate.get('quantity_kg')} kg")
    print(f"Location: {estimate.get('location')}")
    ws = estimate.get("weather_summary")
    if ws:
        print(f"Weather: {ws}")
    print("")
    # Get base market price
    ppk = estimate.get("price_per_kg")
    tot = estimate.get("total_price")
    your_cost_per_kg = ppk
    farmer_to_dist = your_cost_per_kg * (1 + profit_margin / 100)
    dist_to_retailer = farmer_to_dist * (1 + distributor_markup / 100)
    retailer_to_customer = dist_to_retailer * (1 + retailer_markup / 100)
    qty = estimate.get('quantity_kg', 1)
    farmer_total_revenue = farmer_to_dist * qty
    farmer_profit = (farmer_to_dist - your_cost_per_kg) * qty
    distributor_total_revenue = dist_to_retailer * qty
    distributor_profit = (dist_to_retailer - farmer_to_dist) * qty
    retailer_total_revenue = retailer_to_customer * qty
    retailer_profit = (retailer_to_customer - dist_to_retailer) * qty

    print("PRICE TIERS (per kg):")
    print(f"  - Market Price (model):                ₹ {ppk:,.2f}")
    print(f"  - Farmer to Distributor Selling Price:  ₹ {farmer_to_dist:,.2f}")
    print(f"  - Distributor to Retailer Selling Price:₹ {dist_to_retailer:,.2f}")
    print(f"  - Retailer to Customer Selling Price:   ₹ {retailer_to_customer:,.2f}")
    print("")
    print("TOTALS:")
    print(f"  - Market Total:                        ₹ {tot:,.2f}")
    print(f"  - Farmer to Distributor Total:          ₹ {farmer_total_revenue:,.2f}")
    print(f"  - Distributor to Retailer Total:        ₹ {distributor_total_revenue:,.2f}")
    print(f"  - Retailer to Customer Total:           ₹ {retailer_total_revenue:,.2f}")
    print(f"  - Farmer's Profit:                      ₹ {farmer_profit:,.2f}")
    print(f"  - Distributor's Profit:                 ₹ {distributor_profit:,.2f}")
    print(f"  - Retailer's Profit:                    ₹ {retailer_profit:,.2f}")
    print("")
    print("MARGINS & MARKUPS (defaults):")
    print(f"  - Farmer's Profit Margin:    {profit_margin:.1f}%")
    print(f"  - Distributor Markup:        {distributor_markup:.1f}%")
    print(f"  - Retailer Markup:           {retailer_markup:.1f}%")
    print("")
    print("What do these profits mean?")
    print("- Farmer's Profit: The profit earned by the farmer (producer) per transaction.\n"
          "- Distributor's Profit: The profit earned by the distributor (middleman) per transaction.\n"
          "- Retailer's Profit: The profit earned by the retailer (shopkeeper) per transaction.\n"
          "- Totals: Corresponding total prices for the full quantity.\n")
    print("--------------------------------------------------\n")
    # Additional insights
    print("📈 PRICING INSIGHTS:")
    print("-" * 30)
    profit_percentage = (farmer_profit / farmer_total_revenue) * 100 if farmer_total_revenue > 0 else 0
    print(f"Farmer's profit as % of revenue: {profit_percentage:.1f}%")
    market_total = ppk * qty
    revenue_vs_market = ((farmer_total_revenue - market_total) / market_total) * 100 if market_total > 0 else 0
    print(f"Farmer's revenue vs market: +{revenue_vs_market:.1f}%")
    recommendations = get_pricing_recommendations(estimate.get('crop_name', ''), ppk)
    print(f"\n💡 RECOMMENDED PRICING:")
    print("-" * 30)
    print(f"Optimal profit margin: {recommendations['optimal_profit_margin']:.1f}%")
    print(f"Optimal distributor markup: {recommendations['optimal_distributor_markup']:.1f}%")
    if recommendations['notes']:
        print("\n📝 NOTES:")
        for note in recommendations['notes']:
            print(f"  • {note}")
    if trend.get("warn_unrealistic"):
        print("")
        print("⚠️  Warning: Dataset contains values below ₹1/kg or above ₹1000/kg. Interpret with care.")
    reason = estimate.get("assumptions")
    if reason:
        print("")
        print(f"Market Assumptions: {reason}")


def main() -> None:
	print("🌾 AGRICULTURAL DISTRIBUTOR & RETAILER PRICING TOOL")
	print("=" * 50)
	print("Calculate optimal selling prices to distributors and retailers for agricultural commodities")
	print("")
	# Fully interactive inputs
	crop, kg, location = get_validated_input()
	profit_margin = DEFAULT_PROFIT_MARGIN
	distributor_markup = DEFAULT_DISTRIBUTOR_MARKUP
	retailer_markup = DEFAULT_RETAILER_MARKUP
	print(f"\n🔍 Analyzing pricing for {crop} in {location}...")
	print("Fetching weather data and market trends...")
	lat, lon, loc_name, country, state = geocode_location_and_state(location)
	weather_json = fetch_current_weather(lat, lon)
	snapshot = build_weather_snapshot(loc_name, country, lat, lon, weather_json)
	df = load_dataset(DATASET_CSV_PATH)
	trend = compute_trend_stats(df, crop, state if country == "India" else None)
	if not trend or trend.get("rows", 0) == 0:
		trend = compute_trend_stats(df, crop, None)
	estimate = estimate_price_from_csv(crop, kg, f"{loc_name}, {country}" if country else loc_name, snapshot, trend)
	print_human_readable(estimate, trend, profit_margin, distributor_markup, retailer_markup)


if __name__ == "__main__":
	main()
