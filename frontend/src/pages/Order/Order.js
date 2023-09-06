import Cart from "./Cart";
import Item from "./Item";
import { lunchMenu, dinnerMenu, wineList } from "../Menu/MenuList.js";
import "./Order.css";

function Order() {
  const handleOptionClick = (selectedId) => {
    console.log(selectedId);
    const menuSection = document.getElementById(selectedId);
    if (menuSection) {
      const scrollOptions = {
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      };
      const offset = 137; // To adjust for header offset
      const scrollY =
        menuSection.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ ...scrollOptions, top: scrollY });
    }
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0) + string.slice(1).toLowerCase();
  }

  function orderTopBar() {
    return (
      <div className="order-top">
        <div className="order-selectors">
          {dinnerMenu.sections.map((section) => (
            <div
              className="order-selector"
              key={section.header + "display"}
              onClick={() => handleOptionClick(section.header)}
            >
              {" "}
              {capitalizeFirstLetter(section.header)}
            </div>
          ))}
          <div className="order-selector" key={"wine"}>
            {" "}
            Bottled Wine
          </div>
          <div className="order-selector">
            <Cart />
          </div>
        </div>
      </div>
    );
  }

  function displayItems() {
    return (
      <>
        {dinnerMenu.sections.map((section) => (
          <div
            className="order-section"
            key={section.header}
            id={section.header}
          >
            <div className="order-section-header">
              {" "}
              {capitalizeFirstLetter(section.header)}{" "}
            </div>
            <div className="section-items">
              {section.items.map((item) => (
                <Item item={item} key={item.name} />
              ))}
            </div>
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="background-color">
      {orderTopBar()}
      <div className="order-container">{displayItems()}</div>
    </div>
  );
}

export default Order;
