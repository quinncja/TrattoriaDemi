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
          <div className="footer-link">847-332-2330</div>
          <div className="footer-link">
            1571 Sherman Ave, Evanston, IL 60201
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
