# SmartShip ML Prediction API

A Python Flask API that provides machine learning predictions for shipping delays using a trained scikit-learn model.

## Features

- Shipping delay prediction based on multiple factors
- RESTful API with JSON responses
- CORS enabled for frontend integration
- Health check endpoint

## Endpoints

- `GET /` - API information and status
- `GET /health` - Health check
- `POST /predict` - Predict shipping delays

## Prediction Input

The `/predict` endpoint expects a JSON payload with these fields:

```json
{
  "cargo_type_encoded": 1,
  "cargo_weight_tons": 500,
  "shipping_month": 3,
  "origin_port_encoded": 2,
  "destination_port_encoded": 5,
  "origin_efficiency_score": 8.5,
  "destination_efficiency_score": 7.2,
  "avg_dwell_time_origin": 2.5,
  "customs_clearance_score": 9.0,
  "congestion_index": 3.2,
  "weather_risk_score": 2.1,
  "handling_complexity_score": 6.8
}
```

## Response

```json
{
  "prediction": "On Time",
  "probability": 0.85,
  "suggestion": "On Time - No action needed"
}
```

## Local Development

```bash
pip install -r requirements.txt
python app.py
```

## Deployment

Configured for deployment on Render.com using the included configuration files.
