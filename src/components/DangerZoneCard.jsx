import React from 'react';
import '../css/SafeHabitsLab.css';

const DangerZoneCard = ({ image, title, info }) => {
  return (
    <div className="danger-zone-container">
      <div className="danger-zone-image-box">
        <img src={image} alt={title} className="danger-zone-image" />
      </div>
      <div className="danger-zone-info">
        <h2 className="danger-zone-title">⚠️ {title}</h2>
        <p className="danger-zone-text">{info}</p>
      </div>
    </div>
  );
};

export default DangerZoneCard;
