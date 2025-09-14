import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import "leaflet/dist/leaflet.css";
import "./styles/GlobalResponsive.css";

import NavbarPublic from "./components/NavbarPublic";
import NavbarPrivate from "./components/NavbarPrivate";
import Footer from "./components/Footer";
import AuthForm from "./components/AuthForm";
import Welcome from "./components/Welcome";
import Home from "./components/Home";
import News from "./components/News";
import PortInfo from "./components/PortInfo";
import About from "./components/About";
import Result from "./components/Result";
import BackgroundVideo from "./components/BackgroundVideo";
import PageTransition from "./components/PageTransition";

import "./styles/AppLayout.css";

function AppContent({ user, setUser }) {
  const location = useLocation();

  const getRoutes = () => {
    if (!user) {
      return (
        <>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<AuthForm onAuthSuccess={setUser} />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Welcome />} />
        </>
      );
    } else {
      return (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/portinfo" element={<PortInfo />} />
          <Route path="/news" element={<News />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Home />} />
          <Route path="/result" element={<Result />} />
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </>
      );
    }
  };

  return (
    <>
      <BackgroundVideo />
      {user ? <NavbarPrivate user={user} /> : <NavbarPublic />}

      <div className="main-content">
        <PageTransition locationKey={location.key}>
          <Routes location={location}>{getRoutes()}</Routes>
        </PageTransition>
      </div>

      <Footer />
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="app-layout">
      <Router>
        <AppContent user={user} setUser={setUser} />
      </Router>
    </div>
  );
}

export default App;
