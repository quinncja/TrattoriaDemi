import React from "react";
import { Parallax, ParallaxBanner } from "react-scroll-parallax";
import Patio from "images/OutsidePatio.jpg";
import ReviewDisplayer from "components/ReviewDisplayer";
import { useNavigate } from "react-router-dom";
import ImageDisplayer from "./Gallery/ImageDisplayer";
import ManyItems from "food_pictures/ManyItems.jpg";
import Interior from "images/Interior.JPG";
import EmblemBanner from "components/EmblemBanner";

export default function Home() {
  const navigate = useNavigate();
  const image = { file: ManyItems };

  return (
    <div className="home">
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
                        type="button"
                        onClick={() => navigate("/order")}
                      >
                        {" "}
                        Order Online
                      </button>
                      <button
                        className="button-main"
                        type="button"
                        onClick={() => navigate("/reserve")}
                      >
                        {" "}
                        Reserve a table{" "}
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
            <h2>Serving authentic Italian cuisine</h2>
            <h3>Since 1993</h3>
            <br />
            <div className="home-flex">
              <div className="home-left">
                <p>
                  Welcome to our family-owned and operated Trattoria. We've been
                  proudly serving the Northshore area for over 30 years.
                  <br />
                  <br />
                  Our menu is a blend of traditional and innovative Italian
                  dishes, all crafted from fresh, high-quality ingredients.
                  Every dish is made to order, allowing us to cater to a variety
                  of tastes and dietary needs, including vegan and gluten-free
                  options. Here, everyone can find something to enjoy.
                  <br />
                  <br />
                  Our welcoming atmosphere is perfect for any occasion, be it a
                  casual lunch or a cozy dinner. Step into Trattoria Demi, and
                  let our family serve yours.
                </p>
                <div className="button-row">
                  <button
                    className="subtle-button"
                    type="button"
                    onClick={() => navigate("/menu")}
                  >
                    View our menu
                  </button>
                  <button
                    className="subtle-button"
                    type="button"
                    onClick={() => navigate("/gallery")}
                  >
                    View our gallery
                  </button>
                </div>
              </div>
              <div className="home-right">
                <div className="image-wrapper">
                  <ImageDisplayer pic={image.file} name={image.name} />
                </div>
              </div>
            </div>
          </div>
        </Parallax>
        <ParallaxBanner
          layers={[
            { image: Interior, speed: 10 },
            {
              speed: -10,
            },
          ]}
          className="mid-pic aspect-[2/1]"
        />
      </div>
        <ReviewDisplayer />
      <EmblemBanner />
    </div>
  );
}
