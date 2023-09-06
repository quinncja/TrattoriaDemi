import React from "react";
import ImageDisplayer from "./ImageDisplayer";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Baked_Rigatoni from "../../food_pictures/BakedRigatoni.jpg";
import Petite_Chicken from "../../food_pictures/Chicken.jpg";
import Meatballs from "../../food_pictures/Meatballs.jpg";
import Ziti_Primavera from "../../food_pictures/Pasta.jpg";
import Florentine from "../../food_pictures/Pizza.jpg";
import Walnut_Gorgonzola from "../../food_pictures/Salad.jpg";
import Grilled_New_York_Strip_Steak from "../../food_pictures/Steak.jpg";
import Tirimisu from "../../food_pictures/Tirimisu.jpg";
import "./Gallery.css";

function GalleryPopulator() {
  const pictures = [
    { file: Walnut_Gorgonzola, name: "Walnut Gorgonzola" },
    { file: Petite_Chicken, name: "Petite Chicken" },
    { file: Meatballs, name: "Meatballs" },
    { file: Ziti_Primavera, name: "Ziti Primavera" },
    { file: Tirimisu, name: "Tirimisu" },
    { file: Florentine, name: "Florentine" },
    { file: Baked_Rigatoni, name: "Baked Rigatoni" },
    {
      file: Grilled_New_York_Strip_Steak,
      name: "Grilled New York Strip Steak",
    },
  ];

  return (
    <div className="gallery-container">
      <ResponsiveMasonry columnsCountBreakPoints={{ 700: 1, 750: 2 }}>
        <Masonry gutter="15px">
          {pictures.map((image) => (
            <ImageDisplayer
              key={image.name}
              pic={image.file}
              name={image.name}
            />
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
}

export default GalleryPopulator;
