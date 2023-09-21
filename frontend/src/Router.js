import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Menu from "./pages/Menu/Menu.js";
import Home from "./pages/Home.js";
import "./css/index.css";
import Reserve from "./pages/Reserve/Reserve";
import Order from "./pages/Order/Order";
import Checkout from "./pages/Order/Checkout";
import Contact from "./pages/Contact/Contact";
import Giftcard from "./pages/Giftcard/Giftcard";
import GalleryPopulator from "./pages/Gallery/GalleryPopulator";
import Dashboard from "./pages/Dashboard/Dashboard";
import Email from "./components/Email";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="/*" element={<Home/>} />
          <Route path="/home" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/reserve" element={<Reserve />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<GalleryPopulator />} />
          <Route path="/giftcards" element={<Giftcard />} />
          <Route path="/order" element={<Order />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/email" element={<Email />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
