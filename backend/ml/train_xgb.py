"""Train and save an XGBoost regressor using the existing CSV dataset.

This script is intentionally small and focuses on a lightweight feature set:
- crop (as simple label encoding)
- state (label encoding, may be NaN)
- recent median price and quantiles computed by compute_trend_stats
- simple weather features (temperature, precipitation, windspeed)

Output:
- model saved to `backend/ml/model/price_xgb.json`
- encoders saved as simple JSON files under `backend/ml/model/`

Run from the `backend` directory:
    python ml/train_xgb.py
"""
import os
import json
from pathlib import Path
import pandas as pd
import numpy as np

try:
    import xgboost as xgb
except Exception:
    raise RuntimeError("xgboost is required. Install with `pip install xgboost`")

from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

from predict_price import load_dataset, compute_trend_stats


ROOT = Path(__file__).resolve().parent
MODEL_DIR = ROOT / "model"
MODEL_DIR.mkdir(parents=True, exist_ok=True)


def build_features(df: pd.DataFrame):
    # We'll build one training row per (commodity_name, state) aggregated median
    rows = []
    # Use unique commodity names from dataset
    commodities = df['commodity_name'].dropna().unique()
    for c in commodities:
        for st in df['state'].dropna().unique().tolist() + [None]:
            trend = compute_trend_stats(df, str(c), st)
            if trend.get('rows', 0) == 0:
                continue
            rows.append({
                'crop': str(c),
                'state': st or 'UNKNOWN',
                'median_all': trend.get('perkg_median_all') or 0.0,
                'median_12m': trend.get('perkg_median_12m') or 0.0,
                'p25': trend.get('perkg_p25_all') or 0.0,
                'p75': trend.get('perkg_p75_all') or 0.0,
                'unit_scale': trend.get('unit_scale') or 1.0,
                'target': trend.get('perkg_median_12m') or trend.get('perkg_median_all') or 0.0,
            })
    feat = pd.DataFrame(rows)
    return feat


def train_and_save(csv_path: str):
    df = load_dataset(csv_path)
    feat = build_features(df)
    if feat.empty:
        raise RuntimeError("No training data prepared")

    # Label encode crop and state
    crop_le = LabelEncoder()
    state_le = LabelEncoder()
    feat['crop_enc'] = crop_le.fit_transform(feat['crop'].astype(str))
    feat['state_enc'] = state_le.fit_transform(feat['state'].astype(str))

    X = feat[['crop_enc', 'state_enc', 'median_all', 'median_12m', 'p25', 'p75', 'unit_scale']].values
    y = feat['target'].values

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.12, random_state=42)

    dtrain = xgb.DMatrix(X_train, label=y_train)
    dtest = xgb.DMatrix(X_test, label=y_test)

    params = {
        'objective': 'reg:squarederror',
        'verbosity': 1,
        'eta': 0.1,
        'max_depth': 4,
        'seed': 42,
    }
    evallist = [(dtrain, 'train'), (dtest, 'eval')]
    bst = xgb.train(params, dtrain, num_boost_round=150, evals=evallist, early_stopping_rounds=15)

    # Save model
    model_path = MODEL_DIR / 'price_xgb.json'
    bst.save_model(str(model_path))

    # Save encoders
    enc_path = MODEL_DIR / 'encoders.json'
    enc = {
        'crop_classes': feat['crop'].astype(str).unique().tolist(),
        'state_classes': feat['state'].astype(str).unique().tolist(),
    }
    with open(enc_path, 'w', encoding='utf-8') as f:
        json.dump(enc, f)

    # Report test RMSE
    preds = bst.predict(dtest)
    rmse = mean_squared_error(y_test, preds, squared=False)
    print(f"Saved XGBoost model to {model_path} — test RMSE: {rmse:.4f}")


if __name__ == '__main__':
    csv_path = os.path.normpath(os.path.join(os.path.dirname(__file__), '..', 'csv', 'agridata_csv_202110311352.csv'))
    train_and_save(csv_path)
