import React from "react";
import Logo from "../images/LogoAllWhite.png";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <>
      <div style={{ display: "grid", placeContent: "center", height: "100vh" }}>
        <img src={Logo} alt="logo" width="66%" className="center" />
        <div
          className="center"
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "2vw",
            paddingTop: ".5vw",
          }}
        >
          <button className="button-main" onClick={() => navigate("/order")}>
            {" "}
            Order Now
          </button>
          <button className="button-main" onClick={() => navigate("/home")}>
            {" "}
            Explore our Site{" "}
          </button>
        </div>
      </div>
    </>
  );
}
