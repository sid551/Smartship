# ml-backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS  # ✅ Add this
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS for all domains (or configure per origin if needed)

# Load the trained model
try:
    with open("smartship_model.pkl", "rb") as f:
        model = pickle.load(f)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Prediction endpoint
@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    try:
        # Extract features
        features = [
            data["cargo_type_encoded"],
            data["cargo_weight_tons"],
            data["shipping_month"],
            data["origin_port_encoded"],
            data["destination_port_encoded"],
            data["origin_efficiency_score"],
            data["destination_efficiency_score"],
            data["avg_dwell_time_origin"],
            data["customs_clearance_score"],
            data["congestion_index"],
            data["weather_risk_score"],
            data["handling_complexity_score"]
        ]

        # Try to use the loaded model first
        if model is not None:
            try:
                prediction = model.predict([features])[0]
                probability = model.predict_proba([features])[0][prediction]
                
                suggestion = (
                    "Delay Likely - Consider alternate port or better route"
                    if prediction == 1
                    else "On Time - No action needed"
                )

                return jsonify({
                    "prediction": "Delayed" if prediction == 1 else "On Time",
                    "probability": float(probability),
                    "suggestion": suggestion
                })
            except Exception as model_error:
                print(f"Model prediction failed: {model_error}")
                # Fall through to rule-based prediction
        
        # Rule-based fallback prediction
        cargo_weight = features[1]
        origin_efficiency = features[5]
        dest_efficiency = features[6]
        dwell_time = features[7]
        congestion = features[9]
        weather_risk = features[10]
        
        # Calculate risk score based on business logic
        risk_score = 0.0
        
        # Weight-based risk (heavier cargo = higher risk)
        if cargo_weight > 2000:
            risk_score += 0.3
        elif cargo_weight > 1000:
            risk_score += 0.15
            
        # Efficiency-based risk (lower efficiency = higher risk)
        avg_efficiency = (origin_efficiency + dest_efficiency) / 2
        if avg_efficiency < 0.7:
            risk_score += 0.4
        elif avg_efficiency < 0.8:
            risk_score += 0.2
            
        # Dwell time risk
        if dwell_time > 2.0:
            risk_score += 0.3
        elif dwell_time > 1.5:
            risk_score += 0.15
            
        # Congestion risk
        if congestion > 0.5:
            risk_score += 0.25
        elif congestion > 0.3:
            risk_score += 0.1
            
        # Weather risk
        if weather_risk > 0.4:
            risk_score += 0.2
        elif weather_risk > 0.2:
            risk_score += 0.1
        
        # Normalize risk score to probability (0-1)
        probability = min(risk_score, 0.95)  # Cap at 95%
        prediction = 1 if probability > 0.5 else 0
        
        suggestion = (
            "Delay Likely - Consider alternate port or better route"
            if prediction == 1
            else "On Time - No action needed"
        )

        return jsonify({
            "prediction": "Delayed" if prediction == 1 else "On Time",
            "probability": float(probability),
            "suggestion": suggestion,
            "note": "Prediction based on rule-based algorithm" if model is None else "Prediction based on ML model"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "SmartShip ML Prediction API is running!",
        "version": "1.0.0",
        "endpoints": ["/predict"]
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "service": "ml-backend"})

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=False)
