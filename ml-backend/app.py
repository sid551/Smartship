# ml-backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS  # ✅ Add this
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS for all domains (or configure per origin if needed)

# Load the trained model
with open("smartship_model.pkl", "rb") as f:
    model = pickle.load(f)

# Prediction endpoint
@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    try:
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
