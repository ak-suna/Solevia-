import React from "react";
import { Link } from "react-router-dom";
import "./CSS/Welcome.css";
import landingBG from "../assets/images/welcome.png";  // correct path

const Welcome = () => {
  return (
    <div
      className="welcome-container"
      style={{ backgroundImage: `url(${landingBG})` }}
    >
      <div className="welcome-content">
        <h1 className="welcome-title">
          Welcome To <span className="accent">Solevia</span>
        </h1>

        <p className="welcome-text1">
          Your journey to better wellbeing starts today.🍀
        </p>

        <p className="welcome-text2">
          Track your habits, boost your mindset, and take small daily steps toward a happier, healthier life.
        </p>

        <div className="btn-group">
          <Link to="/signup" className="btn-primary">Sign Up</Link>
          <Link to="/login" className="btn-outline">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
