import React from "react";
import "./css/index.css";
import { Router } from "./Router";
import { createRoot } from "react-dom/client";
import { CartProvider } from "./context/CartContext";
import { MobileProvider } from "./context/MobileContext";
import { ParallaxProvider } from "react-scroll-parallax";
import { StatusProvider } from "./context/StatusContext";
import { MenuProvider } from "./context/MenuContext";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <ParallaxProvider>
    <MenuProvider>
      <StatusProvider>
        <MobileProvider>
          <CartProvider>
            <Router />
          </CartProvider>
        </MobileProvider>
      </StatusProvider>
    </MenuProvider>
  </ParallaxProvider>
);
