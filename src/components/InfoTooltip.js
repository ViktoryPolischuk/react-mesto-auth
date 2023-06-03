import React from "react";
import successIcon from "../images/success.svg";
import failIcon from "../images/fail.svg";

function InfoTooltip({type, message, onClose}) {
  return (
    <div className={`popup popup_info ${message ? 'popup_opened' : ''}`}>
      <div className="popup__container">
        <img
          className="popup__info-image"
          src={type === 'success' ? successIcon : failIcon}
          alt={type}
        />
        <h2 className="popup__message">{message}</h2>
        <button className="popup__close-button" onClick={onClose}></button>
      </div>
    </div>
  )
}

export default InfoTooltip
