import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/News.css"; // Make sure styles match layout and BBC feel

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_NEWS_API_URL || "http://localhost:5000"
          }/api/news`
        );
        setArticles(response.data.articles);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="news-loading-screen">
        <div className="news-spinner"></div>
        <p className="news-loading-text">Fetching latest news...</p>
      </div>
    );
  }

  return (
    <div className="news-page">
      <h1 className="news-heading">Shipping & Logistics - News</h1>
      <div className="news-container">
        {articles.map((article, index) => (
          <div className="news-card" key={index}>
            {article.image && (
              <img
                src={article.image}
                alt={article.title}
                className="news-image"
              />
            )}
            <div className="news-details">
              <h3 className="news-title">{article.title}</h3>
              <p className="news-description">{article.description}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="news-link"
              >
                Read more
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
