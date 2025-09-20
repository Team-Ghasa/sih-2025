import os
from datetime import datetime

import pandas as pd
import importlib.util

# Load predict_price.py as a module from the same directory so tests work when
# running pytest from the `backend` folder (avoids package import headaches).
this_dir = os.path.dirname(__file__)
predict_path = os.path.join(this_dir, "predict_price.py")
spec = importlib.util.spec_from_file_location("predict_price", predict_path)
predict_mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(predict_mod)

load_dataset = predict_mod.load_dataset
compute_trend_stats = predict_mod.compute_trend_stats
build_weather_snapshot = predict_mod.build_weather_snapshot
empty_weather_snapshot = predict_mod.empty_weather_snapshot
estimate_price_from_csv = predict_mod.estimate_price_from_csv


def test_load_dataset_exists():
    csv_path = os.path.join(os.path.dirname(__file__), '..', 'csv', 'agridata_csv_202110311352.csv')
    csv_path = os.path.normpath(csv_path)
    assert os.path.exists(csv_path), f"Dataset not found at {csv_path}"
    df = load_dataset(csv_path)
    assert not df.empty


def test_estimate_for_known_crop():
    csv_path = os.path.join(os.path.dirname(__file__), '..', 'csv', 'agridata_csv_202110311352.csv')
    csv_path = os.path.normpath(csv_path)
    df = load_dataset(csv_path)
    trend = compute_trend_stats(df, 'rice', None)
    # dataset-only snapshot
    ws = empty_weather_snapshot()
    est = estimate_price_from_csv('rice', 10, 'Bengaluru, India', ws, trend)
    assert 'price_per_kg' in est
    assert est['price_per_kg'] > 0


def test_estimate_for_missing_crop():
    csv_path = os.path.join(os.path.dirname(__file__), '..', 'csv', 'agridata_csv_202110311352.csv')
    csv_path = os.path.normpath(csv_path)
    df = load_dataset(csv_path)
    trend = compute_trend_stats(df, 'thisdoesnotexist', None)
    ws = empty_weather_snapshot()
    est = estimate_price_from_csv('thisdoesnotexist', 5, 'Nowhere, India', ws, trend)
    # For missing crop we expect default behavior (price 0 or small)
    assert 'price_per_kg' in est
    assert isinstance(est['price_per_kg'], (int, float))
