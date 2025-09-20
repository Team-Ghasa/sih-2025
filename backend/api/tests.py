import json
from django.test import Client


def test_predict_offline():
	c = Client()
	payload = {
		"crop": "rice",
		"kilograms": 5,
		"location": "Bengaluru, IN",
		"offline": True
	}
	resp = c.post('/api/predict/', json.dumps(payload), content_type='application/json')
	assert resp.status_code == 200
	data = resp.json()
	assert 'price_per_kg' in data
	assert isinstance(data['price_per_kg'], (int, float))
	assert data['price_per_kg'] >= 0
