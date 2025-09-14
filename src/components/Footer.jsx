// src/components/Footer.jsx
import React from "react";
import "../styles/Footer.css";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer className="custom-footer">
      <div className="footer-inner">
        {/* Branding */}
        <div className="footer-branding">
          <h2>SmartShip</h2>
          <p>Smart shipping, smart future.</p>
        </div>

        {/* Navigation */}
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/portinfo">Port Info</Link>
          <Link to="/news">News</Link>
          <Link to="/about">About</Link>
        </div>

        {/* Social Icons */}
        <div className="footer-social">
          <a
            href="https://github.com/sid551"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/siddharth-gupta-752865294?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>
          <a href="mailto:siddhu13072005@gmail.com">
            <FaEnvelope />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SmartShip. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
