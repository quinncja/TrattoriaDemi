import React from "react";
import { Parallax, ParallaxBanner } from "react-scroll-parallax";
import Patio from "../images/OutsidePatio.jpg";
import ReviewDisplayer from "../components/ReviewDisplayer";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div className="home-header">
        <ParallaxBanner
          layers={[
            { image: Patio, speed: 10 },
            {
              speed: -10,
              children: (
                <div className="pic-overlay">
                  <div className="pic-content">
                    <div>
                      Old world Italian
                      <br />
                      in the heart of Evanston
                    </div>
                    <div className="welcome-buttons">
                      <button
                        className="button-main"
                        onClick={() => navigate("/order")}
                      >
                        {" "}
                        ORDER NOW
                      </button>
                      <button
                        className="button-main"
                        onClick={() => navigate("/reserve")}
                      >
                        {" "}
                        RESERVE NOW{" "}
                      </button>
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
          className="home-pic aspect-[2/1]"
        />
        <Parallax translate={[0, 20]}>
          <div className="home-block">
            <div>Authentic Italian</div>
            <ReviewDisplayer />
          </div>
        </Parallax>
      </div>
    </>
  );
}
