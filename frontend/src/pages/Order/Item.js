import { useContext, useState } from "react";
import CartContext from "../../context/CartContext";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

function Item({ item }) {
  const [isOpen, setOpen] = useState(false);
  const [price, setPrice] = useState(item.price);
  const [qty, setQty] = useState(1);
  const [pasta, setPasta] = useState(null);
  const [size, setSize] = useState(null);
  const [sauce, setSauce] = useState(null);
  const [options, setOptions] = useState([]);
  const [platter, setPlatter] = useState([]);
  const [requestTxt, setRequestTxt] = useState("");
  const [dressing, setDressing] = useState(false);
  const [dressingQty, setDressingQty] = useState(1);
  const dressingPrice = dressingQty * 0.75;
  const { addItemToCart } = useContext(CartContext);

  function clearItem() {
    setQty(1);
    setPasta(null);
    setSize(null);
    setSauce(null);
    setOptions([]);
    setPlatter([]);
    setRequestTxt("");
    setDressing(false);
    setDressingQty(1);
  }

  function handleButtonClick() {
    const serverItem = {
      itemId: item._id,
      size: size?.id,
      sauce: sauce?.id,
      pasta: pasta?.id,
      options: options?.map((obj) => obj.id),
      platter: platter?.map((plat) => plat.id),
      dressing,
      dressingQty,
    };
    const localItem = {
      name: item.name,
      modifiers: {
        instructions: requestTxt,
        size: size?.name,
        sauce: sauce?.name,
        pasta: pasta?.name,
        options: options?.map((obj) => obj.name),
        platter: platter?.map((plat) => plat.name),
      },
      qty,
      totalPrice: getTotalPrice(),
      serverItem,
    };
    addItemToCart(localItem);
    setOpen(false);
    clearItem();
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
      <div className="dressing-container" key={item._id + "dressing"}>
        <button
          className={`option-btn ${
            dressing ? "option-btn-selected dressing-btn" : ""
          }`}
          onClick={() => setDressing(!dressing)}
        >
          Extra dressing {dressing && `- $${dressingPrice.toFixed(2)}`}
        </button>
        {dressing && (
          <div id="dressing-qty" className="qty-btn-container dressing-qty">
            <button
              type="button"
              id="--"
              onClick={(event) => dressingHandler(event.target.id)}
              className="qty-btn qty-left qty-btn-dressing"
            >
              -
            </button>

            <div className="qty-btn-center-dressing">{dressingQty}</div>

            <button
              type="button"
              id="++"
              onClick={(event) => dressingHandler(event.target.id)}
              className="qty-btn qty-right qty-btn-dressing"
            >
              +
            </button>
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

  function getOptionsPrice() {
    return options.reduce((total, option) => total + option.price, 0);
  }

  function getTotalPrice() {
    let totPrice = 0;
    totPrice += price;
    if (size) totPrice += size.price;
    if (pasta) totPrice += pasta.price;
    if (dressing) totPrice += dressingPrice;
    if (options) totPrice += getOptionsPrice();
    if (platter.length > 0) totPrice += (platter.length - 1) * 5;

    return `$${totPrice * qty}`;
  }

  function SubmitButton() {
    if (item.sauces.length > 1 && !sauce) {
      return (
        <button type="button" className="add-btn add-btn-disabled">
          Select a sauce
        </button>
      );
    }
    if (item.sizes.length > 1 && !size) {
      return (
        <button type="button" className="add-btn add-btn-disabled">
          Select a size
        </button>
      );
    }
    if (item.platters.length > 1 && platter.length === 0) {
      return (
        <button type="button" className="add-btn add-btn-disabled">
          Select an option
        </button>
      );
    }
    return (
      <button type="button" className="add-btn" onClick={handleButtonClick}>
        {getTotalPrice()}
      </button>
    );
  }

  function isPlatterPresent(id) {
    return platter.some((option) => option.id === id);
  }

  function platterMapper(platters) {
    const handleClick = ({ id, name }) => {
      if (isPlatterPresent(id))
        setPlatter((prevOptions) =>
          prevOptions.filter((option) => option.id !== id)
        );
      else setPlatter((prevOptions) => [...prevOptions, { id, name }]);
    };
    return platters.map((platter) => (
      <button
        type="button"
        className={`option-btn ${
          isPlatterPresent(platter._id) ? "option-btn-selected" : ""
        }`}
        id={platter._id}
        key={platter._id}
        value={platter.price}
        onClick={() => handleClick({ id: platter._id, name: platter.name })}
      >
        {platter.name}
      </button>
    ));
  }

  function sauceMapper(sauces) {
    const handleClick = ({ id, price, name }) => {
      if (sauce?.id === id) {
        setPrice(item.price);
        setSauce(null);
      } else {
        setPrice(item.price + price);
        setSauce({ id, price, name });
      }
    };
    return sauces.map((s) => (
      <button
        type="button"
        className={`option-btn ${sauce?.id === s._id && "option-btn-selected"}`}
        id={s._id}
        key={s._id}
        value={s.price}
        onClick={() => handleClick({ id: s._id, price: s.price, name: s.name })}
      >
        {s.name}
      </button>
    ));
  }

  function isOptionPresent(id) {
    return options.some((option) => option.id === id);
  }

  function optionsMapper(options) {
    const handleClick = ({ id, price, name }) => {
      if (isOptionPresent(id))
        setOptions((prevOptions) =>
          prevOptions.filter((option) => option.id !== id)
        );
      else setOptions((prevOptions) => [...prevOptions, { id, price, name }]);
    };
    return options.map((option) =>
      option.name === "Extra dressing" ? (
        Dressing()
      ) : (
        <button
          type="button"
          className={`option-btn ${
            isOptionPresent(option._id) ? "option-btn-selected" : ""
          }`}
          id={option._id}
          key={option._id}
          value={option.price}
          onClick={() =>
            handleClick({
              id: option._id,
              price: option.price,
              name: option.name,
            })
          }
        >
          {option.name} - ${option.price}
        </button>
      )
    );
  }

  function sizeMapper(sizes) {
    const handleClick = ({ id, price, name }) => {
      if (size?.id === id) {
        setSize(null);
      } else setSize({ id, price, name });
    };
    return sizes.map((s) => (
      <button
        type="button"
        className={`option-btn ${size?.id === s._id && "option-btn-selected"}`}
        id={s._id}
        key={s._id}
        value={s.price}
        onClick={() => handleClick({ id: s._id, price: s.price, name: s.name })}
      >
        {s.name} - ${price + s.price}
      </button>
    ));
  }

  function pastaMapper(types) {
    const handleClick = ({ id, price, name }) => {
      if (pasta?.id === id) {
        setPasta(null);
      } else setPasta({ id, price, name });
    };
    return types.map((type) => (
      <button
        type="button"
        className={`option-btn ${
          pasta?.id === type._id && "option-btn-selected"
        }`}
        id={type._id}
        key={type._id}
        value={type.price}
        onClick={() =>
          handleClick({ id: type._id, price: type.price, name: type.name })
        }
      >
        {type.name} - ${type.price}
      </button>
    ));
  }

  function openItem() {
    return (
      <div className="inside-modal" key={item._id + "-modal"}>
        <div className="item-header">
          {" "}
          <div className="header-row">
            <div className="item-info-left">
              <div className="item-name item-name-open"> {item.name} </div>{" "}
              <div className="item-price item-price-open">
                {" "}
                ${item.price}
                {item.sizes.length > 1 ? "+" : ""}{" "}
              </div>{" "}
            </div>
            <button className="close-btn" onClick={() => setOpen(false)}>
              X
            </button>
          </div>
          <div className="item-desc-open"> {item.description} </div>
        </div>

        <div className="item-section">
          {item.platters.length >= 1 && (
            <div>
              <div className="item-subheader"> $5 per selection </div>
              <div className="item-options">{platterMapper(item.platters)}</div>
            </div>
          )}
          {item.sauces.length >= 1 && (
            <div>
              <div className="item-subheader"> Choose a sauce</div>
              <div className="item-options">{sauceMapper(item.sauces)}</div>
            </div>
          )}
          {item.sizes.length >= 1 && (
            <div>
              <div className="item-subheader"> Choose a size </div>
              <div className="item-options">{sizeMapper(item.sizes)}</div>
            </div>
          )}
          {item.pastas.length >= 1 && (
            <div>
              <div className="item-subheader"> Pasta options </div>
              <div className="item-options">{pastaMapper(item.pastas)}</div>
            </div>
          )}
          {item.options.length >= 1 && (
            <div>
              <div className="item-subheader"> Additonal options </div>
              <div className="item-options">{optionsMapper(item.options)}</div>
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
        <div className="item-closed-header">
          <div className="item-name"> {item.name} </div>
          <div className="item-price">
            {" "}
            ${item.price}
            {item.sizes.length >= 1 ? "+" : ""}{" "}
          </div>
        </div>
        <div className="item-desc"> {item.description} </div>
      </button>
      <Modal
        blockScroll={false}
        open={isOpen}
        center={true}
        showCloseIcon={false}
        classNames={{ modal: "item-modal" }}
        onClose={() => setOpen(false)}
      >
        {openItem()}
      </Modal>
    </>
  );
}

export default Item;
