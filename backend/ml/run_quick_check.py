import os
import sys

# Ensure repo root is on path so package imports work when running from this folder
ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), '..'))
if ROOT not in sys.path:
	sys.path.insert(0, ROOT)

from ml.predict_price import load_dataset, compute_trend_stats, empty_weather_snapshot, estimate_price_from_csv

csv_path = os.path.join(os.path.dirname(__file__), '..', 'csv', 'agridata_csv_202110311352.csv')
csv_path = os.path.normpath(csv_path)
print('Using dataset:', csv_path)
df = load_dataset(csv_path)
trend = compute_trend_stats(df, 'rice', None)
ws = empty_weather_snapshot()
est = estimate_price_from_csv('rice', 10, 'Bengaluru, India', ws, trend)
print('Estimate:', est)
