import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Patio from "images/OutsidePatio.jpg";
import ReviewDisplayer from "components/ReviewDisplayer";
import { useNavigate } from "react-router-dom";
import ImageDisplayer from "./Gallery/ImageDisplayer";
import ManyItems from "food_pictures/ManyItems.jpg";
import Interior from "images/Interior.JPG";
import EmblemBanner from "components/EmblemBanner";
import ScrollDown from "components/ScrollDown/ScrollDown";
import { welcomeSvg } from "svg";

export default function Home() {
  const navigate = useNavigate();
  const image = { file: ManyItems };

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [1, 80], [1, 80]);
  const y2 = useTransform(scrollY, [1, 800], [1, 200]);
  const y3 = useTransform(scrollY, [0, 200], [0, 40]);
  const y4 = useTransform(scrollY, [0, 400], [80, 20]);
  const y5 = useTransform(scrollY, [0, 700], [400, 20]);
  const opacity = useTransform(scrollY, [300, 700], [0, 1]);
  const opacity2 = useTransform(scrollY, [1200, 1600], [0, 1]);
  const color = useTransform(scrollY, [100, 500], ["#ffffff", "#d3963a"]);

  return (
    <div className="home">
      <div className="home-header">
        <motion.div
          className="home-pic"
          style={{
            y: y2,
          }}
        >
          <img src={Patio} alt="Patio"/>
          <div className="pic-overlay">
            <div className="pic-content">{welcomeSvg()}</div>
            <motion.div style={{ y: y1 }} className="scroll-down-wrapper">
              <ScrollDown />
            </motion.div>
          </div>
        </motion.div>
        <motion.div style={{ y: y3 }} className="home-block">
          <motion.div style={{ y: y4 }}>
            <div className="hero-text">
              Old world Italian in the{" "}
              <motion.span style={{ color: color }}> heart </motion.span> of
              Evanston
            </div>
            <h2>Since 1993</h2>
            <br />
            <br />
            <motion.div style={{ y: y5, opacity: opacity }}>
              <div className="home-flex">
                <div className="home-left">
                  <p>
                    Welcome to our family-owned and operated Trattoria. We're
                    the little italian joint thats been serving the Northshore
                    area for over 3 decades.
                    <br />
                    <br />
                    Our menu is a blend of traditional and innovative Italian
                    dishes, all crafted from fresh, high-quality ingredients.
                    Every dish is made to order, allowing us to cater to a
                    variety of tastes and dietary needs, including vegan and
                    gluten-free options. Here, everyone can find something to
                    enjoy.
                    <br />
                    <br />
                    Our welcoming atmosphere is perfect for any occasion, be it
                    a casual lunch or a cozy dinner. Step into Trattoria Demi,
                    and let our family serve yours.
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
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <div className="mid-pic-overlay">
        <img className="mid-pic" src={Interior} alt="Cozy-interior" />
      </div>

      <motion.div className="review-section" style={{ opacity: opacity2 }}>
        <div className="review-container">
          <ReviewDisplayer />
        </div>
      </motion.div>

      <EmblemBanner />
    </div>
  );
}
