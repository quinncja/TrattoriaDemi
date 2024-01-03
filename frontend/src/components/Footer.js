import React from "react";
import Vases from "../images/VasesDarker.png";
import DetailsWrapper from "./DetailsWrapper";

export function Footer() {
  return (
    <>
    <DetailsWrapper/>
    <div className="footer-container">
      <img src={Vases} alt="vases" width="10%" className="vases" />
      <div className="footer">
        <div className="footer-links">
          <div className="footer-link">
            Made with <div style={{display: "inline", fontWeight: "800", fontSize: ".8rem"}}> ♡ </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
