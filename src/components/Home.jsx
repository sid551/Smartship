import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    origin: "",
    destination: "",
    cargo_type: "Electronics",
    cargo_weight: 1000,
    shipping_date: "",
  });

  const cargoComplexity = {
    Fragile: 0.8,
    Perishable: 0.9,
    Electronics: 0.7,
    Machinery: 0.5,
    Standard: 0.3,
  };

  const cargoEncoding = {
    Electronics: 0,
    Machinery: 1,
    Standard: 2,
    Perishable: 3,
    Fragile: 4,
  };

  const portEncoding = {
    Shanghai: {
      lat: 31.2198,
      lon: 121.4869,
      efficiency: 0.92,
      dwell: 1.1,
      clearance: 0.95,
      congestion: 0.25,
      weather: 0.2,
    },
    "Nhava Sheva (JNPT)": {
      lat: 18.952,
      lon: 72.948,
      efficiency: 0.7,
      dwell: 2.8,
      clearance: 0.65,
      congestion: 0.6,
      weather: 0.6,
    },
    Mundra: {
      lat: 22.746,
      lon: 69.7,
      efficiency: 0.76,
      dwell: 2.5,
      clearance: 0.68,
      congestion: 0.55,
      weather: 0.55,
    },
    "Jebel Ali": {
      lat: 25.0113,
      lon: 55.0612,
      efficiency: 0.8,
      dwell: 1.9,
      clearance: 0.8,
      congestion: 0.5,
      weather: 0.45,
    },
    Busan: {
      lat: 35.1796,
      lon: 129.0756,
      efficiency: 0.88,
      dwell: 1.3,
      clearance: 0.9,
      congestion: 0.35,
      weather: 0.25,
    },
    Singapore: {
      lat: 1.3521,
      lon: 103.8198,
      efficiency: 0.95,
      dwell: 1.0,
      clearance: 0.92,
      congestion: 0.2,
      weather: 0.15,
    },
    Rotterdam: {
      lat: 51.9244,
      lon: 4.4777,
      efficiency: 0.93,
      dwell: 1.2,
      clearance: 0.91,
      congestion: 0.28,
      weather: 0.22,
    },
    Hamburg: {
      lat: 53.5511,
      lon: 9.9937,
      efficiency: 0.9,
      dwell: 1.4,
      clearance: 0.89,
      congestion: 0.3,
      weather: 0.2,
    },
    "Tanger Med": {
      lat: 35.8844,
      lon: -5.4975,
      efficiency: 0.65,
      dwell: 3.2,
      clearance: 0.5,
      congestion: 0.75,
      weather: 0.7,
    },
    "Los Angeles": {
      lat: 34.0522,
      lon: -118.2437,
      efficiency: 0.85,
      dwell: 1.5,
      clearance: 0.85,
      congestion: 0.4,
      weather: 0.3,
    },
    "New York/New Jersey": {
      lat: 40.7128,
      lon: -74.006,
      efficiency: 0.8,
      dwell: 2.0,
      clearance: 0.82,
      congestion: 0.45,
      weather: 0.4,
    },
    Santos: {
      lat: -23.9608,
      lon: -46.3336,
      efficiency: 0.6,
      dwell: 3.5,
      clearance: 0.45,
      congestion: 0.8,
      weather: 0.75,
    },
    Sydney: {
      lat: -33.8688,
      lon: 151.2093,
      efficiency: 0.78,
      dwell: 2.2,
      clearance: 0.76,
      congestion: 0.5,
      weather: 0.5,
    },
  };

  const haversine = (lat1, lon1, lat2, lon2) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371; // Earth's radius in km

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "cargo_weight" && Number(value) < 0) return;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { origin, destination, cargo_type, cargo_weight, shipping_date } =
      formState;

    if (origin === destination) {
      navigate("/result", {
        state: { error: "Origin and destination ports cannot be the same." },
      });
      return;
    }

    const month = new Date(shipping_date).getMonth() + 1;
    const originData = portEncoding[origin];
    const destData = portEncoding[destination];

    const distance = haversine(
      originData.lat,
      originData.lon,
      destData.lat,
      destData.lon
    );
    const etaDays = (distance / 55.56 / 24).toFixed(1); // assuming ~30 knots ship speed

    const payload = {
      cargo_type_encoded: cargoEncoding[cargo_type],
      cargo_weight_tons: Number(cargo_weight) / 1000,
      shipping_month: month,
      origin_port_encoded: Object.keys(portEncoding).indexOf(origin),
      destination_port_encoded: Object.keys(portEncoding).indexOf(destination),
      origin_efficiency_score: originData.efficiency,
      destination_efficiency_score: destData.efficiency,
      avg_dwell_time_origin: originData.dwell,
      customs_clearance_score: originData.clearance,
      congestion_index: originData.congestion,
      weather_risk_score: originData.weather,
      handling_complexity_score: cargoComplexity[cargo_type],
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_ML_API_URL || "http://localhost:5001"}/predict`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();
      navigate("/result", {
        state: {
          prediction: result.prediction,
          probability: result.probability,
          suggestion: result.suggestion,
          origin,
          destination,
          originCoords: [originData.lat, originData.lon],
          destinationCoords: [destData.lat, destData.lon],
          distance: distance.toFixed(1), // in km
          eta: etaDays, // in days
        },
      });
    } catch (err) {
      navigate("/result", {
        state: { error: "Server error. Please try again later." },
      });
    }
  };

  const ports = Object.keys(portEncoding);
  const cargoTypes = Object.keys(cargoComplexity);

  return (
    <div className="home">
      <div className="form-card">
        <h1>Predict Shipping Delays with SmartShip</h1>
        <p>Leverage port metrics and cargo analysis to forecast reliability.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div>
              <label>Origin Port</label>
              <select
                name="origin"
                value={formState.origin}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {ports.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Destination Port</label>
              <select
                name="destination"
                value={formState.destination}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {ports.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>Cargo Type</label>
              <select
                name="cargo_type"
                value={formState.cargo_type}
                onChange={handleChange}
              >
                {cargoTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Cargo Weight (kg)</label>
              <input
                type="number"
                name="cargo_weight"
                min="0"
                step="1"
                value={formState.cargo_weight}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>Shipping Date</label>
              <input
                type="date"
                name="shipping_date"
                value={formState.shipping_date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <button id="predict" type="submit">
            Predict Delay
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;
