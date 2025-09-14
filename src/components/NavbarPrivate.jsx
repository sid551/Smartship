import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

function NavbarPrivate({ user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsMenuOpen(false); // Close menu after logout
    } catch (error) {
      alert("Logout failed: " + error.message);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const displayName =
    user?.displayName || (user?.email ? user.email.split("@")[0] : "User");

  return (
    <nav className="navbar">
      <div className="title">
        <span className="welcome-text">Welcome, </span>
        <strong className="user-name">{displayName}</strong>
        <span className="to-smartship"> to SmartShip</span>
      </div>

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
          <Link to="/" className="nav-link" onClick={closeMenu}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/portinfo" className="nav-link" onClick={closeMenu}>
            Port Info
          </Link>
        </li>
        <li>
          <Link to="/news" className="nav-link" onClick={closeMenu}>
            News
          </Link>
        </li>
        <li>
          <Link to="/about" className="nav-link" onClick={closeMenu}>
            About Us
          </Link>
        </li>
        <li>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default NavbarPrivate;
