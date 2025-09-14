// src/components/NavbarPublic.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function NavbarPublic() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="title">SmartShip</div>

      <button
        className={`mobile-menu-toggle ${isMenuOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`menuItems ${isMenuOpen ? "active" : ""}`}>
        <li>
          <Link to="/about" className="nav-link" onClick={closeMenu}>
            About Us
          </Link>
        </li>
        <li>
          <Link to="/login" className="login-btn" onClick={closeMenu}>
            Sign In
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavbarPublic;
