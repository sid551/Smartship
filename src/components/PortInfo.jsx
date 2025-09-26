import { useState } from "react";
import "../styles/PortInfo.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function PortInfo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [portData, setPortData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError("");
    setPortData(null);

    try {
      // Check if API key is available (Vite uses import.meta.env)
      const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "API key not found. Please check your .env file and make sure it starts with VITE_"
        );
      }

      console.log("Making API request for:", searchTerm);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-latest:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Maritime Intelligence Query: "${searchTerm}"

Analyze the query and respond with ONLY valid JSON in one of these formats:

SINGLE PORT (for specific port names):
{
  "queryType": "single_port",
  "name": "Port Name",
  "country": "Country",
  "region": "Region",
  "throughput": "Annual throughput",
  "description": "Port description and business insights",
  "established": "Year",
  "facilities": ["Facility 1", "Facility 2"],
  "keyInsights": ["Insight 1", "Insight 2"],
  "competitiveAdvantages": ["Advantage 1", "Advantage 2"],
  "website": "website.com"
}

BULK LISTING (for "ports in [country/region]"):
{
  "queryType": "port_listing", 
  "name": "Major Ports in [Region]",
  "region": "Geographic area",
  "description": "Overview of regional ports",
  "portsList": [
    {"name": "Port 1", "city": "City", "throughput": "Volume", "specialization": "Type"},
    {"name": "Port 2", "city": "City", "throughput": "Volume", "specialization": "Type"}
  ],
  "keyInsights": ["Regional insight 1", "Regional insight 2"]
}

COMPARISON (for "compare X vs Y"):
{
  "queryType": "comparison",
  "name": "Port Comparison", 
  "description": "Comparison overview",
  "comparisonData": [
    {"name": "Port 1", "strengths": ["Strength 1"], "metrics": "Key stats"},
    {"name": "Port 2", "strengths": ["Strength 1"], "metrics": "Key stats"}
  ],
  "recommendation": "Which is better and why"
}

RULES:
- Return ONLY valid JSON, no extra text
- Use real port data and current information
- For bulk queries, include 5-10 major ports
- If unclear query, return: {"error": "Please specify your port query more clearly"}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 2000,
            },
          }),
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (
        !data.candidates ||
        !data.candidates[0] ||
        !data.candidates[0].content
      ) {
        throw new Error("Invalid API response structure");
      }

      const aiResponse = data.candidates[0].content.parts[0].text;
      console.log("AI Response Text:", aiResponse);

      // Enhanced JSON parsing with better error handling
      let portInfo;
      try {
        // First, clean the response
        let cleanResponse = aiResponse.trim();

        // Remove markdown code blocks if present
        cleanResponse = cleanResponse
          .replace(/```json\s*/g, "")
          .replace(/```\s*/g, "");

        // Try to parse directly
        portInfo = JSON.parse(cleanResponse);
      } catch (parseError) {
        console.log("Direct parse failed, trying to extract JSON...");

        try {
          // Try to find JSON object in the response
          const jsonMatch = aiResponse.match(/\{[\s\S]*?\}(?=\s*$|\s*[^}]*$)/);
          if (jsonMatch) {
            portInfo = JSON.parse(jsonMatch[0]);
          } else {
            // If no JSON found, create a fallback response
            portInfo = {
              queryType: "general_info",
              name: searchTerm,
              description: aiResponse.substring(0, 500) + "...",
              keyInsights: [
                "AI response received but couldn't parse as structured data",
              ],
              error: "Response format issue - showing raw AI response",
            };
          }
        } catch (secondParseError) {
          console.error("All parsing attempts failed:", secondParseError);
          // Create a simple fallback
          portInfo = {
            queryType: "general_info",
            name: searchTerm,
            description:
              "AI response received but couldn't be parsed properly. Please try rephrasing your query.",
            keyInsights: [
              "Try simpler queries like 'Port of Rotterdam' or 'ports in Germany'",
            ],
            error: "JSON parsing failed",
          };
        }
      }

      if (portInfo.error) {
        setError(portInfo.error);
      } else {
        setPortData(portInfo);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(`Search failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Export to PDF function
  const exportToPDF = async () => {
    if (!portData) return;

    try {
      const element = document.querySelector(".port-result");
      if (!element) return;

      // Create a clone for PDF generation with better styling
      const clone = element.cloneNode(true);
      clone.style.background = "white";
      clone.style.color = "black";
      clone.style.padding = "30px";
      clone.style.fontFamily = "Arial, sans-serif";

      // Style all text elements for PDF
      const allElements = clone.querySelectorAll("*");
      allElements.forEach((el) => {
        el.style.color = "black";
        el.style.background = "transparent";
        el.style.boxShadow = "none";
        el.style.textShadow = "none";
      });

      // Temporarily add to document for rendering
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.width = "800px";
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        backgroundColor: "white",
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      // Add header
      pdf.setFontSize(20);
      pdf.setFont(undefined, "bold");
      pdf.text("Port Information Report", 20, 20);

      pdf.setFontSize(12);
      pdf.setFont(undefined, "normal");
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
      pdf.text(`Search Query: ${searchTerm}`, 20, 37);

      // Add the captured content
      const imgWidth = 170;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let yPosition = 50;
      if (yPosition + imgHeight > 280) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.addImage(imgData, "PNG", 20, yPosition, imgWidth, imgHeight);

      // Add footer
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.text(`Page ${i} of ${pageCount}`, 20, 290);
        pdf.text("Generated by SmartShip Port Intelligence", 150, 290);
      }

      pdf.save(`${portData.name || searchTerm}_Port_Report.pdf`);
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Failed to export PDF. Please try again.");
    }
  };

  // Export to Excel function
  const exportToExcel = () => {
    if (!portData) return;

    try {
      const workbook = XLSX.utils.book_new();

      // Create main data sheet
      const mainData = [];

      // Add header
      mainData.push(["Port Information Report"]);
      mainData.push(["Generated on:", new Date().toLocaleDateString()]);
      mainData.push(["Search Query:", searchTerm]);
      mainData.push([]);

      // Add basic information
      if (portData.queryType === "single_port") {
        mainData.push(["BASIC INFORMATION"]);
        if (portData.name) mainData.push(["Port Name:", portData.name]);
        if (portData.country) mainData.push(["Country:", portData.country]);
        if (portData.region) mainData.push(["Region:", portData.region]);
        if (portData.established)
          mainData.push(["Established:", portData.established]);
        if (portData.throughput)
          mainData.push(["Throughput:", portData.throughput]);
        mainData.push([]);

        if (portData.description) {
          mainData.push(["DESCRIPTION"]);
          mainData.push([portData.description]);
          mainData.push([]);
        }

        // Add business metrics
        if (portData.businessMetrics) {
          mainData.push(["BUSINESS METRICS"]);
          if (portData.businessMetrics.ranking)
            mainData.push(["Ranking:", portData.businessMetrics.ranking]);
          if (portData.businessMetrics.growth)
            mainData.push(["Growth:", portData.businessMetrics.growth]);
          if (portData.businessMetrics.specialization)
            mainData.push([
              "Specialization:",
              portData.businessMetrics.specialization,
            ]);
          mainData.push([]);
        }

        // Add facilities
        if (portData.facilities && portData.facilities.length > 0) {
          mainData.push(["FACILITIES"]);
          portData.facilities.forEach((facility) => {
            mainData.push([facility]);
          });
          mainData.push([]);
        }

        // Add key insights
        if (portData.keyInsights && portData.keyInsights.length > 0) {
          mainData.push(["KEY INSIGHTS"]);
          portData.keyInsights.forEach((insight) => {
            mainData.push([insight]);
          });
          mainData.push([]);
        }

        // Add competitive advantages
        if (
          portData.competitiveAdvantages &&
          portData.competitiveAdvantages.length > 0
        ) {
          mainData.push(["COMPETITIVE ADVANTAGES"]);
          portData.competitiveAdvantages.forEach((advantage) => {
            mainData.push([advantage]);
          });
          mainData.push([]);
        }

        // Add shipping routes
        if (portData.shippingRoutes && portData.shippingRoutes.length > 0) {
          mainData.push(["SHIPPING ROUTES"]);
          portData.shippingRoutes.forEach((route) => {
            mainData.push([route]);
          });
        }
      }

      // Handle port listing data
      else if (portData.queryType === "port_listing" && portData.portsList) {
        mainData.push(["PORT LISTING"]);
        if (portData.region) mainData.push(["Region:", portData.region]);
        if (portData.totalCount)
          mainData.push(["Total Ports:", portData.totalCount]);
        mainData.push([]);

        // Create ports table
        mainData.push([
          "Port Name",
          "City",
          "Throughput",
          "Specialization",
          "Ranking",
        ]);
        portData.portsList.forEach((port) => {
          mainData.push([
            port.name || "",
            port.city || "",
            port.throughput || "",
            port.specialization || "",
            port.ranking || "",
          ]);
        });
      }

      // Handle comparison data
      else if (portData.queryType === "comparison" && portData.comparisonData) {
        mainData.push(["PORT COMPARISON"]);
        mainData.push([]);

        portData.comparisonData.forEach((port, index) => {
          mainData.push([`PORT ${index + 1}: ${port.name}`]);
          if (port.metrics) mainData.push(["Metrics:", port.metrics]);
          if (port.marketPosition)
            mainData.push(["Market Position:", port.marketPosition]);
          if (port.strengths && port.strengths.length > 0) {
            mainData.push(["Strengths:"]);
            port.strengths.forEach((strength) => {
              mainData.push([strength]);
            });
          }
          mainData.push([]);
        });

        if (portData.recommendation) {
          mainData.push(["RECOMMENDATION"]);
          mainData.push([portData.recommendation]);
        }
      }

      const worksheet = XLSX.utils.aoa_to_sheet(mainData);

      // Set column widths
      worksheet["!cols"] = [
        { width: 25 },
        { width: 30 },
        { width: 20 },
        { width: 25 },
        { width: 20 },
      ];

      XLSX.utils.book_append_sheet(workbook, worksheet, "Port Report");

      // Generate and save file
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(data, `${portData.name || searchTerm}_Port_Report.xlsx`);
    } catch (error) {
      console.error("Excel export failed:", error);
      alert("Failed to export Excel file. Please try again.");
    }
  };

  return (
    <div className="port-page">
      <div className="container">
        <h1>🚢 Port Information Search</h1>
        <p>Search for any port worldwide</p>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Try: 'all ports in Germany', 'compare Hamburg vs Rotterdam', 'container terminals in Asia'..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <span>Searching for port information...</span>
          </div>
        )}

        {error && <div className="error">{error}</div>}

        {portData && (
          <div className="port-result">
            <div className="result-header">
              <div className="header-left">
                <h2>{portData.name}</h2>
                {portData.queryType && (
                  <span className="query-type">
                    {portData.queryType.replace("_", " ").toUpperCase()}
                  </span>
                )}
              </div>

              <div className="export-buttons">
                <button
                  onClick={exportToPDF}
                  className="export-btn pdf-btn"
                  title="Export to PDF"
                >
                  📄 PDF
                </button>
                <button
                  onClick={exportToExcel}
                  className="export-btn excel-btn"
                  title="Export to Excel"
                >
                  📊 Excel
                </button>
              </div>
            </div>

            <div className="port-details">
              {/* SINGLE PORT DISPLAY */}
              {portData.queryType === "single_port" && (
                <>
                  {/* Basic Information */}
                  <div className="info-section">
                    <h3>📍 Basic Information</h3>
                    {portData.country && (
                      <p>
                        <strong>Country:</strong> {portData.country}
                      </p>
                    )}
                    {portData.region && (
                      <p>
                        <strong>Region:</strong> {portData.region}
                      </p>
                    )}
                    {portData.established && (
                      <p>
                        <strong>Established:</strong> {portData.established}
                      </p>
                    )}
                    {portData.throughput && (
                      <p>
                        <strong>Throughput:</strong> {portData.throughput}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  {portData.description && (
                    <div className="info-section">
                      <h3>📋 Overview</h3>
                      <p>{portData.description}</p>
                    </div>
                  )}

                  {/* Business Metrics */}
                  {portData.businessMetrics && (
                    <div className="info-section">
                      <h3>📊 Business Metrics</h3>
                      {portData.businessMetrics.ranking && (
                        <p>
                          <strong>Ranking:</strong>{" "}
                          {portData.businessMetrics.ranking}
                        </p>
                      )}
                      {portData.businessMetrics.growth && (
                        <p>
                          <strong>Growth:</strong>{" "}
                          {portData.businessMetrics.growth}
                        </p>
                      )}
                      {portData.businessMetrics.specialization && (
                        <p>
                          <strong>Specialization:</strong>{" "}
                          {portData.businessMetrics.specialization}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Key Insights */}
                  {portData.keyInsights && portData.keyInsights.length > 0 && (
                    <div className="info-section">
                      <h3>💡 Key Insights</h3>
                      <ul className="insights-list">
                        {portData.keyInsights.map((insight, index) => (
                          <li key={index}>{insight}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Competitive Advantages */}
                  {portData.competitiveAdvantages &&
                    portData.competitiveAdvantages.length > 0 && (
                      <div className="info-section">
                        <h3>🏆 Competitive Advantages</h3>
                        <ul className="advantages-list">
                          {portData.competitiveAdvantages.map(
                            (advantage, index) => (
                              <li key={index}>{advantage}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {/* Shipping Routes */}
                  {portData.shippingRoutes &&
                    portData.shippingRoutes.length > 0 && (
                      <div className="info-section">
                        <h3>🚢 Major Shipping Routes</h3>
                        <ul className="routes-list">
                          {portData.shippingRoutes.map((route, index) => (
                            <li key={index}>{route}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {/* Facilities */}
                  {portData.facilities && portData.facilities.length > 0 && (
                    <div className="info-section">
                      <h3>🏗️ Facilities & Infrastructure</h3>
                      <ul className="facilities-list">
                        {portData.facilities.map((facility, index) => (
                          <li key={index}>{facility}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Practical Information */}
                  {portData.practicalInfo && (
                    <div className="info-section">
                      <h3>🕒 Practical Information</h3>
                      {portData.practicalInfo.timeZone && (
                        <p>
                          <strong>Time Zone:</strong>{" "}
                          {portData.practicalInfo.timeZone}
                        </p>
                      )}
                      {portData.practicalInfo.workingHours && (
                        <p>
                          <strong>Working Hours:</strong>{" "}
                          {portData.practicalInfo.workingHours}
                        </p>
                      )}
                      {portData.practicalInfo.contactInfo && (
                        <p>
                          <strong>Contact:</strong>{" "}
                          {portData.practicalInfo.contactInfo}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Website */}
                  {portData.website && (
                    <div className="info-section">
                      <h3>🌐 Official Website</h3>
                      <p>
                        <a
                          href={`https://${portData.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="website-link"
                        >
                          {portData.website}
                        </a>
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* BULK PORT LISTING DISPLAY */}
              {portData.queryType === "port_listing" && (
                <>
                  {/* Overview */}
                  <div className="info-section">
                    <h3>🌍 Regional Overview</h3>
                    {portData.region && (
                      <p>
                        <strong>Region:</strong> {portData.region}
                      </p>
                    )}
                    {portData.totalCount && (
                      <p>
                        <strong>Total Ports Listed:</strong>{" "}
                        {portData.totalCount}
                      </p>
                    )}
                    {portData.description && <p>{portData.description}</p>}
                  </div>

                  {/* Ports List */}
                  {portData.portsList && portData.portsList.length > 0 && (
                    <div className="info-section">
                      <h3>🚢 Major Ports</h3>
                      <div className="ports-grid">
                        {portData.portsList.map((port, index) => (
                          <div key={index} className="port-card">
                            <h4>{port.name}</h4>
                            {port.city && (
                              <p className="port-city">📍 {port.city}</p>
                            )}
                            {port.throughput && (
                              <p>
                                <strong>Throughput:</strong> {port.throughput}
                              </p>
                            )}
                            {port.specialization && (
                              <p>
                                <strong>Specialization:</strong>{" "}
                                {port.specialization}
                              </p>
                            )}
                            {port.ranking && (
                              <p>
                                <strong>Ranking:</strong> {port.ranking}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Market Analysis */}
                  {portData.marketAnalysis &&
                    portData.marketAnalysis.length > 0 && (
                      <div className="info-section">
                        <h3>📈 Market Analysis</h3>
                        <ul className="insights-list">
                          {portData.marketAnalysis.map((analysis, index) => (
                            <li key={index}>{analysis}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {/* Strategic Importance */}
                  {portData.strategicImportance &&
                    portData.strategicImportance.length > 0 && (
                      <div className="info-section">
                        <h3>🎯 Strategic Importance</h3>
                        <ul className="advantages-list">
                          {portData.strategicImportance.map(
                            (importance, index) => (
                              <li key={index}>{importance}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {/* Key Insights */}
                  {portData.keyInsights && portData.keyInsights.length > 0 && (
                    <div className="info-section">
                      <h3>💡 Regional Insights</h3>
                      <ul className="insights-list">
                        {portData.keyInsights.map((insight, index) => (
                          <li key={index}>{insight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              {/* COMPARISON DISPLAY */}
              {portData.queryType === "comparison" && (
                <>
                  {/* Overview */}
                  {portData.description && (
                    <div className="info-section">
                      <h3>⚖️ Comparison Overview</h3>
                      <p>{portData.description}</p>
                    </div>
                  )}

                  {/* Comparison Data */}
                  {portData.comparisonData &&
                    portData.comparisonData.length > 0 && (
                      <div className="info-section">
                        <h3>📊 Port Comparison</h3>
                        <div className="comparison-grid">
                          {portData.comparisonData.map((port, index) => (
                            <div key={index} className="comparison-card">
                              <h4>{port.name}</h4>
                              {port.metrics && (
                                <p>
                                  <strong>Key Metrics:</strong> {port.metrics}
                                </p>
                              )}
                              {port.marketPosition && (
                                <p>
                                  <strong>Market Position:</strong>{" "}
                                  {port.marketPosition}
                                </p>
                              )}
                              {port.strengths && port.strengths.length > 0 && (
                                <div>
                                  <strong>Strengths:</strong>
                                  <ul className="strengths-list">
                                    {port.strengths.map((strength, idx) => (
                                      <li key={idx}>{strength}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Recommendation */}
                  {portData.recommendation && (
                    <div className="info-section">
                      <h3>🎯 Recommendation</h3>
                      <p className="recommendation">
                        {portData.recommendation}
                      </p>
                    </div>
                  )}

                  {/* Key Insights */}
                  {portData.keyInsights && portData.keyInsights.length > 0 && (
                    <div className="info-section">
                      <h3>💡 Comparison Insights</h3>
                      <ul className="insights-list">
                        {portData.keyInsights.map((insight, index) => (
                          <li key={index}>{insight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              {/* FALLBACK FOR OTHER QUERY TYPES */}
              {!["single_port", "port_listing", "comparison"].includes(
                portData.queryType
              ) && (
                <>
                  {portData.description && (
                    <div className="info-section">
                      <h3>📋 Information</h3>
                      <p>{portData.description}</p>
                    </div>
                  )}

                  {portData.keyInsights && portData.keyInsights.length > 0 && (
                    <div className="info-section">
                      <h3>💡 Key Insights</h3>
                      <ul className="insights-list">
                        {portData.keyInsights.map((insight, index) => (
                          <li key={index}>{insight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        <div className="info-box">
          <h3>Enhancecd AI Maritime Intelligence</h3>
          <p>
            ✅ Natural language understanding with comprehensive maritime
            insights!
          </p>

          <div className="capabilities">
            <div className="capability-group">
              <h4>🔍 What You Can Ask:</h4>
              <ul>
                <li>
                  <strong>Specific Ports:</strong> "Port of Rotterdam",
                  "Singapore Port"
                </li>
                <li>
                  <strong>Comparisons:</strong> "Compare Hamburg vs Rotterdam"
                </li>
                <li>
                  <strong>Regional Queries:</strong> "Best container ports in
                  Asia"
                </li>
                <li>
                  <strong>Business Questions:</strong> "Fastest growing ports in
                  Europe"
                </li>
                <li>
                  <strong>Route Information:</strong> "Major shipping routes
                  from China"
                </li>
              </ul>
            </div>

            <div className="capability-group">
              <h4>📊 Enhanced Information:</h4>
              <ul>
                <li>🏆 Competitive advantages & market position</li>
                <li>💡 Strategic business insights</li>
                <li>🚢 Major shipping routes & connections</li>
                <li>📈 Growth trends & rankings</li>
                <li>🕒 Practical operational details</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortInfo;
