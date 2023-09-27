import { useContext, useState } from "react";
import CartContext from "../../context/CartContext";
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

function Item({ item }) {
  const [isOpen, setOpen] = useState(false);
  const [price, setPrice] = useState(item.price[0]);
  const [qty, setQty] = useState(1);
  const [chicken, setChicken] = useState(false);
  const [pasta, setPasta] = useState(undefined);
  const [selectedSize, setSelectedSize] = useState();
  const [selectedSauce, setSelectedSauce] = useState();
  const [gf, setGf] = useState(false);
  const [wheat, setWheat] = useState(false);
  const [requestTxt, setRequestTxt] = useState("");
  const [dressing, setDressing] = useState(false);
  const [dressingQty, setDressingQty] = useState(1);
  const dressingPrice = dressingQty * 0.75;
  const [selectedButtons, setSelectedButtons] = useState([]);
  const { addItemToCart } = useContext(CartContext);

  const handleContainerClick = (event) => {
    event.stopPropagation();
  };

  function clearItem() {
    setQty(1);
    setChicken(false);
    setPasta(undefined);
    setGf(false);
    setWheat(false);
    setRequestTxt("");
    setSelectedSize();
    setDressing(false);
    setDressingQty(1);
    setSelectedButtons([]);
  }

  function handleButtonClick() {
    const newItem = {
      name: item.name,
      instructions: requestTxt,
      options: {
        selectedSize,
        selectedSauce,
        chicken,
        wheat,
        gf,
        dressing,
        dressingQty,
      },
      selectedButtons,
      qty,
      totalPrice: getTotalPrice(),
    };
    addItemToCart(newItem);
    setOpen(false);
    clearItem();
  }

  function Chicken() {
    function handleChickenSelect() {
      if (chicken) {
        setChicken(false);
      } else {
        setChicken(true);
      }
    }
    return (
      <button
        id="chicken"
        className={`option-btn ${chicken ? "option-btn-selected" : ""}`}
        onClick={() => handleChickenSelect()}
      >
        Add Chicken - $4
      </button>
    );
  }

  function Pasta() {
    function handlePastaSelect(id) {
      let localGf = false;
      let localWheat = false;
      if (id === "wheat") {
        localWheat = wheat ^ true;
        setGf(false);
        setWheat(!wheat);
      }
      if (id === "gf") {
        localGf = gf ^ true;
        setWheat(false);
        setGf(!gf);
      }
      setPasta(localGf || localWheat);
    }

    return (
      <>
        <button
          id="wheat"
          className={`option-btn ${wheat ? "option-btn-selected" : ""}`}
          onClick={(event) => handlePastaSelect(event.target.id)}
        >
          Whole wheat pasta - $2
        </button>
        <button
          id="gf"
          className={`option-btn ${gf ? "option-btn-selected" : ""}`}
          onClick={(event) => handlePastaSelect(event.target.id)}
        >
          Gluten free pasta - $2
        </button>
      </>
    );
  }

  function Dressing() {
    function dressingHandler(id) {
      if (id === "++") {
        setDressingQty(dressingQty + 1);
      }
      if (id === "--" && dressingQty > 1) {
        setDressingQty(dressingQty > 1 ? dressingQty - 1 : dressingQty);
      }
    }

    return (
      <div className="dressing-container">
        <button
          className={`option-btn ${
            dressing ? "option-btn-selected dressing-btn" : ""
          }`}
          onClick={() => setDressing(!dressing)}
        >
          Extra dressing {dressing && `- $${dressingPrice}`}
        </button>
        {dressing && (
          <div>
            <label className="dressing-label" htmlFor="dressing-qty">
              {" "}
              How Many?{" "}
            </label>
            <div id="dressing-qty" className="qty-btn-container dressing-qty">
              <button
                type="button"
                id="--"
                onClick={(event) => dressingHandler(event.target.id)}
                className="qty-btn qty-left"
              >
                -
              </button>

              <div className="qty-btn-center">{dressingQty}</div>

              <button
                type="button"
                id="++"
                onClick={(event) => dressingHandler(event.target.id)}
                className="qty-btn qty-right"
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  function Quantity() {
    function handleQtyChange(event) {
      if (event.currentTarget.id === "-" && qty > 1)
        setQty((prevQty) => prevQty - 1);
      if (event.currentTarget.id === "+") setQty((prevQty) => prevQty + 1);
    }

    return (
      <div>
        <div className="item-subheader"> Quantity </div>
        <div className="qty-btn-container">
          <button
            type="button"
            id="-"
            onClick={(event) => handleQtyChange(event)}
            className="qty-btn qty-left"
          >
            -
          </button>
          <div className="qty-btn-center">{qty}</div>
          <button
            type="button"
            id="+"
            onClick={(event) => handleQtyChange(event)}
            className="qty-btn qty-right"
          >
            +
          </button>
        </div>
      </div>
    );
  }

  function PizzaSize() {
    function handleButtonClick(size, name) {
      setSelectedSize({ size, name });
      setPrice(item.price[size - 1]);
    }

    return (
      <>
        <button
          className={
            selectedSize?.size === 1
              ? "option-btn option-btn-selected "
              : "option-btn"
          }
          onClick={() => handleButtonClick(1, "9")}
        >
          9" - ${item.price[0]}
        </button>
        <button
          className={
            selectedSize?.size === 2
              ? "option-btn option-btn-selected "
              : "option-btn"
          }
          onClick={() => handleButtonClick(2, "12")}
        >
          12" - ${item.price[1]}
        </button>
        <button
          className={
            selectedSize?.size === 3
              ? "option-btn option-btn-selected "
              : "option-btn"
          }
          onClick={() => handleButtonClick(3, "14")}
        >
          14" - ${item.price[2]}
        </button>
      </>
    );
  }

  function PastaSize() {
    function handleButtonClick(size, name) {
      setSelectedSize({ size, name });
      setPrice(
        selectedSauce?.num === 2 ? item.price[size + 1] : item.price[size - 1]
      );
    }

    return (
      <>
        <button
          id="pasta-small"
          className={
            selectedSize?.size === 1
              ? "option-btn option-btn-selected "
              : "option-btn"
          }
          onClick={() => handleButtonClick(1, "Small")}
        >
          Small - ${selectedSauce?.num === 2 ? item.price[2] : item.price[0]}
        </button>
        <button
          id="pasta-reg"
          className={
            selectedSize?.size === 2
              ? "option-btn option-btn-selected "
              : "option-btn"
          }
          onClick={() => handleButtonClick(2, "Regular")}
        >
          Regular - ${selectedSauce?.num === 2 ? item.price[3] : item.price[1]}
        </button>
      </>
    );
  }

  function SoupSize() {
    function handleButtonClick(size, name) {
      setSelectedSize({ size, name });
      setPrice(item.price[size - 1]);
    }

    return (
      <>
        <button
          className={
            selectedSize?.size === 1
              ? "option-btn option-btn-selected "
              : "option-btn"
          }
          onClick={() => handleButtonClick(1, "Cup")}
        >
          Cup - ${item.price[0]}
        </button>
        <button
          className={
            selectedSize?.size === 2
              ? "option-btn option-btn-selected "
              : "option-btn"
          }
          onClick={() => handleButtonClick(2, "Bowl")}
        >
          Bowl - ${item.price[1]}
        </button>
      </>
    );
  }

  function Sauce() {
    function onSauceChange(num, name) {
      setSelectedSauce({ num, name });
      document.getElementById("pasta-small").className = "option-btn";
      document.getElementById("pasta-reg").className = "option-btn";
      setSelectedSize();
    }

    return (
      <>
        <button
          className={
            selectedSauce?.num === 1
              ? "option-btn option-btn-selected "
              : "option-btn"
          }
          onClick={() => onSauceChange(1, "Marinara")}
        >
          Marinara
        </button>
        <button
          className={
            selectedSauce?.num === 2
              ? "option-btn option-btn-selected "
              : "option-btn"
          }
          onClick={() => onSauceChange(2, "Meat")}
        >
          Meat
        </button>
      </>
    );
  }

  function PlatterSelection() {
    const handleButtonClick = (index, name) => {
      let updatedSelectedButtons = [...selectedButtons];
      const buttonIndex = updatedSelectedButtons.findIndex(
        (button) => button.index === index
      );

      if (buttonIndex !== -1) {
        updatedSelectedButtons.splice(buttonIndex, 1);
      } else {
        updatedSelectedButtons.push({ index, name });
      }

      setSelectedButtons(updatedSelectedButtons);
      setPrice(5 * updatedSelectedButtons.length);
    };

    const isButtonSelected = (index) => {
      return selectedButtons.some((button) => button.index === index);
    };

    return (
      <>
        <button
          className={
            isButtonSelected(0)
              ? "option-btn option-btn-selected"
              : "option-btn"
          }
          onClick={() => handleButtonClick(0, item.platter[0])}
        >
          {item.platter[0]}
        </button>
        <button
          className={
            isButtonSelected(1)
              ? "option-btn option-btn-selected"
              : "option-btn"
          }
          onClick={() => handleButtonClick(1, item.platter[1])}
        >
          {item.platter[1]}
        </button>
        <button
          className={
            isButtonSelected(2)
              ? "option-btn option-btn-selected"
              : "option-btn"
          }
          onClick={() => handleButtonClick(2, item.platter[2])}
        >
          {item.platter[2]}
        </button>
        <button
          className={
            isButtonSelected(3)
              ? "option-btn option-btn-selected"
              : "option-btn"
          }
          onClick={() => handleButtonClick(3, item.platter[3])}
        >
          {item.platter[3]}
        </button>
      </>
    );
  }

  function getTotalPrice() {
    let totPrice = 0;
    totPrice += price;
    if (pasta) totPrice += 2;
    if (chicken) totPrice += 4;
    if (dressing) totPrice += dressingPrice;
    return `$${totPrice * qty}`;
  }

  function SubmitButton() {
    if (item.required?.includes(4) && selectedButtons.length === 0) {
      return (
        <button type="button" className="add-btn add-btn-disabled">
          None selected
        </button>
      );
    }
    if (item.required?.includes(3) && !selectedSauce) {
      return (
        <button type="button" className="add-btn add-btn-disabled">
          Select a sauce
        </button>
      );
    }
    if (
      (item.required?.includes(1) ||
        item.required?.includes(2) ||
        item.required?.includes(5)) &&
      !selectedSize
    ) {
      return (
        <button type="button" className="add-btn add-btn-disabled">
          Select a size
        </button>
      );
    }
    return (
      <button type="button" className="add-btn" onClick={handleButtonClick}>
        {getTotalPrice()}
      </button>
    );
  }

  function openItem() {
    return (
        <div className="inside-modal"> 
          <div className="item-header">
            {" "}
            <div className="header-row">
              <div className="item-info-left">
              <div className="item-name item-name-open"> {item.name} </div>{" "}
              <div className="item-price item-price-open">
                {" "}
                ${item.price[0]}
                {item.price.length > 1 ? "+" : ""}{" "}
              </div>{" "}
              </div>
            <button className="close-btn" onClick={() => setOpen(false)}>
              X
            </button>
            </div>
            <div className="item-desc-open"> {item.description} </div>
          </div>

          <div className="item-section">
            {item.required?.includes(3) && (
              <div>
                <div className="item-subheader"> Choose a sauce</div>
                <div className="item-options">
                  <Sauce />
                </div>
              </div>
            )}
            {(item.required?.includes(1) ||
              item.required?.includes(2) ||
              item.required?.includes(5)) && (
              <div>
                <div className="item-subheader"> Choose a size </div>
                <div className="item-options">
                  {item.required.includes(1) && <PizzaSize />}
                  {item.required.includes(2) && <PastaSize />}
                  {item.required.includes(5) && <SoupSize />}
                </div>
              </div>
            )}
            {item.required?.includes(4) && (
              <div>
                <div className="item-subheader"> $5 per selection </div>
                <div className="item-options">
                  <PlatterSelection />
                </div>
              </div>
            )}
            {item.options && (
              <div>
                <div className="item-subheader"> Options </div>
                <div className="item-options">
                  {item.options.includes(1) && <Chicken />}
                  {item.options.includes(2) && <Pasta />}
                  {item.options.includes(3) && <Dressing />}
                </div>
              </div>
            )}

            <div className="item-request">
              <div className="item-subheader"> Additional instructions </div>
              <textarea
                className="req-input"
                placeholder="Add any requests here"
                onChange={(event) => setRequestTxt(event.target.value)}
              />
            </div>
          </div>

          <div className="item-footer">
            <Quantity />
            <div>
              <div className="item-subheader"> Add to order </div>
              <SubmitButton />
            </div>
          </div>
          </div>
    );
  }
  return (
    <>
      <button className="item-container" onClick={() => setOpen(true)}>
        <div className="item-header">
          <div className="item-name"> {item.name} </div>
          <div className="item-price">
            {" "}
            ${item.price[0]}
            {item.price.length > 1 ? "+" : ""}{" "}
          </div>
        </div>
        <div className="item-desc"> {item.description} </div>
      </button>
      <Modal
      blockScroll={false}
      open={isOpen}
      center={true}
      showCloseIcon={false}
      classNames={{modal: "item-modal"}}
      onClose={(() => setOpen(false))}>
       {openItem()}
       </Modal>
    </>
  );
}

export default Item;
