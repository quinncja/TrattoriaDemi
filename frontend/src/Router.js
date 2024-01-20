import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "App";
import Menu from "pages/Public/Menu/Menu.js";
import Home from "pages/Public/Home.js";
import "css/index.css";
import Reserve from "pages/Public/Reserve/Reserve";
import Order from "pages/Public/Order/Order";
import Contact from "pages/Public/Contact/Contact";
import Giftcard from "pages/Public/Giftcard/Giftcard";
import GalleryPopulator from "pages/Public/Gallery/GalleryPopulator";
import Dashboard from "pages/Dashboard/Dashboard";
import Email from "components/Email";
import Cancel from "pages/Public/Cancel";
import OrderStatus from "pages/Public/Order/OrderStatus";
import CheckoutPage from "pages/Public/Order/Checkout/CheckoutPage";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="/*" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/reserve" element={<Reserve />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<GalleryPopulator />} />
          <Route path="/giftcards" element={<Giftcard />} />
          <Route path="/order" element={<Order />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/email" element={<Email />} />
          <Route path="/cancel/*" element={<Cancel />} />
          <Route path="/order-status/*" element={<OrderStatus />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
