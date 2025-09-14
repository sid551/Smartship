import { Link } from "react-router-dom";
import "../styles/Welcome.css";

function Welcome() {
  return (
    <div className="welcome-container">
      <div className="welcome-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🚢</span>
            <span className="badge-text">AI-Powered Logistics</span>
          </div>

          <h1 className="hero-title">
            Welcome to <span className="brand-name">SmartShip</span>
          </h1>

          <p className="hero-subtitle">
            Revolutionize your shipping operations with intelligent delay
            prediction and route optimization powered by advanced machine
            learning
          </p>

          {/* Problem Statement Section */}
          <div className="problem-section">
            <h2 className="section-title">The Challenge in Modern Shipping</h2>
            <div className="problem-grid">
              <div className="problem-item">
                <div className="problem-icon">⏰</div>
                <h4>Unpredictable Delays</h4>
                <p>
                  Shipping delays cost the global economy over $200 billion
                  annually, affecting supply chains worldwide
                </p>
              </div>
              <div className="problem-item">
                <div className="problem-icon">📈</div>
                <h4>Rising Costs</h4>
                <p>
                  Port congestion and inefficient routing increase operational
                  costs by up to 30% for logistics companies
                </p>
              </div>
              <div className="problem-item">
                <div className="problem-icon">🔍</div>
                <h4>Limited Visibility</h4>
                <p>
                  Traditional systems lack real-time insights into port
                  conditions, weather patterns, and cargo handling efficiency
                </p>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="features-section">
            <h2 className="section-title">
              Comprehensive Shipping Intelligence
            </h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Smart Analytics Dashboard</h3>
                <p>
                  Advanced data analysis of shipping patterns, port efficiency
                  scores, dwell times, and cargo handling metrics across 13+
                  major global ports
                </p>
                <ul className="feature-list">
                  <li>Real-time port efficiency monitoring</li>
                  <li>Historical trend analysis</li>
                  <li>Cargo type performance metrics</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3>AI Delay Prediction</h3>
                <p>
                  Machine learning algorithms trained on thousands of shipments
                  to forecast potential delays with 95% accuracy before they
                  impact operations
                </p>
                <ul className="feature-list">
                  <li>Weather risk assessment</li>
                  <li>Port congestion analysis</li>
                  <li>Customs clearance predictions</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🗺️</div>
                <h3>Interactive Route Planning</h3>
                <p>
                  Dynamic route visualization with real-time port conditions,
                  weather data, and optimal path calculations for maximum
                  efficiency
                </p>
                <ul className="feature-list">
                  <li>Distance and ETA calculations</li>
                  <li>Alternative route suggestions</li>
                  <li>Port capacity monitoring</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="how-it-works-section">
            <h2 className="section-title">How SmartShip Works</h2>
            <div className="steps-container">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Input Shipment Details</h4>
                  <p>
                    Enter your cargo type, weight, origin and destination ports,
                    and shipping date
                  </p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>AI Analysis</h4>
                  <p>
                    Our machine learning model analyzes 12+ factors including
                    port efficiency, weather risks, and congestion levels
                  </p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Get Predictions</h4>
                  <p>
                    Receive delay probability, route visualization, and
                    actionable recommendations for optimization
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Supported Ports Section */}
          <div className="ports-section">
            <h2 className="section-title">Global Port Coverage</h2>
            <p className="ports-description">
              SmartShip monitors and analyzes data from major shipping hubs
              across six continents
            </p>
            <div className="ports-grid">
              <div className="port-region">
                <h4>🌏 Asia-Pacific</h4>
                <ul>
                  <li>Shanghai (China)</li>
                  <li>Singapore</li>
                  <li>Busan (South Korea)</li>
                  <li>Sydney (Australia)</li>
                </ul>
              </div>
              <div className="port-region">
                <h4>🌍 Europe & Middle East</h4>
                <ul>
                  <li>Rotterdam (Netherlands)</li>
                  <li>Hamburg (Germany)</li>
                  <li>Jebel Ali (UAE)</li>
                  <li>Tanger Med (Morocco)</li>
                </ul>
              </div>
              <div className="port-region">
                <h4>🌎 Americas</h4>
                <ul>
                  <li>Los Angeles (USA)</li>
                  <li>New York/New Jersey (USA)</li>
                  <li>Santos (Brazil)</li>
                </ul>
              </div>
              <div className="port-region">
                <h4>🇮🇳 India</h4>
                <ul>
                  <li>Nhava Sheva (JNPT)</li>
                  <li>Mundra Port</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="benefits-section">
            <h2 className="section-title">Why Choose SmartShip?</h2>
            <div className="benefits-grid">
              <div className="benefit-item">
                <div className="benefit-icon">💰</div>
                <h4>Cost Reduction</h4>
                <p>
                  Reduce shipping costs by up to 25% through optimized routing
                  and delay prevention
                </p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">⚡</div>
                <h4>Faster Decisions</h4>
                <p>
                  Make informed decisions in seconds with real-time data and
                  AI-powered insights
                </p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">🛡️</div>
                <h4>Risk Mitigation</h4>
                <p>
                  Proactively identify and avoid potential delays before they
                  impact your supply chain
                </p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">📱</div>
                <h4>Easy Integration</h4>
                <p>
                  User-friendly interface that integrates seamlessly with your
                  existing logistics workflow
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="cta-section">
            <h2 className="cta-title">
              Ready to Transform Your Shipping Operations?
            </h2>
            <p className="cta-subtitle">
              Join leading logistics companies already using SmartShip to
              optimize their supply chains
            </p>
            <Link to="/login" className="get-started-btn">
              <span className="btn-icon">🚀</span>
              Start Free Analysis
            </Link>
            <p className="cta-description">
              No credit card required • Instant access • Trusted by 1000+
              professionals
            </p>
          </div>

          {/* Stats Section */}
          <div className="stats-section">
            <div className="stat-item">
              <div className="stat-number">13+</div>
              <div className="stat-label">Global Ports</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Accuracy Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Monitoring</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">25%</div>
              <div className="stat-label">Cost Savings</div>
            </div>
          </div>

          {/* Industry Insights */}
          <div className="insights-section">
            <h2 className="section-title">Industry Insights</h2>
            <div className="insights-grid">
              <div className="insight-card">
                <h4>🔬 Advanced Machine Learning</h4>
                <p>
                  Our proprietary algorithms analyze over 12 critical factors
                  including cargo complexity, port efficiency scores, weather
                  patterns, and historical delay data to provide unprecedented
                  accuracy in shipping predictions.
                </p>
              </div>
              <div className="insight-card">
                <h4>📈 Real-Time Market Data</h4>
                <p>
                  Stay ahead with live updates on port congestion levels,
                  customs clearance times, and shipping industry news that
                  directly impact your operations and decision-making process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
