import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css"; // CSS for animations

const NotFound = () => {
  return (
    <div className="not-found-container">
      <img src="src/funny404.png" alt="Funny 404" className="funny-img" />
      <h1 className="bounce">404</h1>
      <h2>Oops! Looks like you're lost.</h2>
      <p>Even our astronaut couldn't find this page! 😵</p>
      <Link to="/home" className="go-home">Take me home 🚀</Link>
    </div>
  );
};

export default NotFound;
