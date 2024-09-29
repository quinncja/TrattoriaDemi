import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Patio from "images/OutsidePatioCompressed.jpg";
import ReviewDisplayer from "components/ReviewDisplayer";
import { useNavigate } from "react-router-dom";
import ImageDisplayer from "./Gallery/ImageDisplayer";
import ManyItems from "food_pictures/ManyItemsCompressed.jpg";
import Interior from "images/InteriorCompressed.JPG";
import EmblemBanner from "components/EmblemBanner";
import ScrollDown from "components/ScrollDown/ScrollDown";
import { welcomeSvg } from "svg";
import SuperLine from "images/Gold under.webp"
import Eater from "images/eater.jpg"
import FancyLine from "images/FancyLine.png";


export default function Home() {
  const navigate = useNavigate();
  const image = { file: ManyItems };

  const { scrollY } = useScroll();
  const color = useTransform(scrollY, [100, 500], ["#ffffff", "#d3963a"]);

  return (
    <div className="home">
      <div className="home-header">
        <div className="home-pic">
          <img
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
            src={Patio}
            alt="Patio"
            loading="lazy"
          />
          <div className="pic-overlay">
            <div className="pic-content">{welcomeSvg()}</div>
            <div className="scroll-down-wrapper">
              <ScrollDown />
            </div>
          </div>
        </div>
        <div className="home-block">
          <div>
            <div className="hero-text">
              Old world Italian in the{" "}
              <motion.span style={{ color: color }}> heart </motion.span> of
              Evanston
            </div>
            <h2>Since 1993</h2>
            <br />
            <br />
            <div>
              <div className="home-flex">
                <div className="home-left">
                  <p>
                    Welcome to our family-owned and operated Trattoria. We're
                    that little italian joint in the neighborhood that's been
                    serving the Northshore area for over 3 decades.
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
            </div>
            
          </div>
        </div>
      </div>
      <div className="featured-block">
        <div className="featured-top"> 
        <div className="featured-text"> 
          <div className="hero-text"> Featured in </div>
          <h2 className="article-text"> 
          <a href="https://chicago.eater.com/maps/the-best-pasta-in-chicago" target="_blank" rel="noopener noreferrer">
          The Best Pasta in Chicago
        </a> </h2>
        </div>
        <a href="https://chicago.eater.com/maps/the-best-pasta-in-chicago" target="_blank" rel="noopener noreferrer" className="eater-wrapper">
          <img src={Eater} alt="Eater" className="eater-img" />
        </a>
        </div>

      </div>  
      <div className="mid-pic-overlay">
        <img
          className="mid-pic"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            filter: "brightness(0.8) contrast(1.05)",
          }}
          src={Interior}
          alt="Cozy-interior"
          loading="lazy"
        />
      </div>
      <div className="after-mid-pic"/>

      <div className="review-container">
      <div className="review-box"> 
      <div className="hero-text elegant-hero" >Hear it from the locals </div>
      <img className="fancy-line review-line" src={FancyLine} alt="" />
          <ReviewDisplayer />
          <img
          className="super-line"
            src={SuperLine}
            alt="Fancy under line"
          />
      </div>
      </div>

      <EmblemBanner />
    </div>
  );
}
