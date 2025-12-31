import React from "react";
import "../styles/Card.css";

const Card = ({ title, description, buttonText, onButtonClick, children }) => {
  return (
    <div className="card">
      <h2 className="card-title">{title}</h2>
      <p className="card-description">{description}</p>
      {children}
      {buttonText && (
        <button className="card-button" onClick={onButtonClick}>
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default Card;
