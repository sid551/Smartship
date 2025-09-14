import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import "../styles/LoginForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import BackgroundVideo from "./BackgroundVideo";

function AuthForm({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ✅ FIX: Define handleAuth function
  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      let userCredential;

      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const fallbackName = email.split("@")[0];
        await updateProfile(user, { displayName: fallbackName });
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      const user = userCredential.user;
      onAuthSuccess(user);
      navigate("/");
      window.location.reload(); // optional: to force layout updates
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (!user.displayName && user.email) {
        const fallbackName = user.email.split("@")[0];
        await updateProfile(user, { displayName: fallbackName });
      }

      onAuthSuccess(user);
      navigate("/");
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-wrapper">
      <BackgroundVideo/>
      <form className="login-form" onSubmit={handleAuth}>
        <h2>{isSignUp ? "Create Account" : "Welcome"}</h2>
        <p>{isSignUp ? "Sign up to get started" : "Login to continue"}</p>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={isSignUp ? "Create password" : "Enter password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
        </div>

        <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>

        <p style={{ marginTop: "1rem" }}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <span className="signup-link" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Sign In" : "Sign Up"}
          </span>
        </p>

        <button type="button" className="google-btn" onClick={handleGoogleAuth}>
          {isSignUp ? "Sign up" : "Sign in"} with Google
        </button>
      </form>
    </div>
  );
}

export default AuthForm;
