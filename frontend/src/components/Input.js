import PhoneInput from "react-phone-number-input/input";

function Input(obj) {
  function addressBody(obj) {
    return (
      <input
        ref={obj.ref}
        type="text"
        id={obj.id}
        value={obj.value}
        className={`reserve-select ${obj.error && `reserve-select-error`}`}
        onChange={(event) => obj.handleChange(event)}
      />
    );
  }

  function phoneBody(obj) {
    return (
      <PhoneInput
        country="US"
        withCountryCallingCode={true}
        className={`reserve-select input-phone ${
          obj.error && `reserve-select-error`
        }`}
        value={obj.value}
        onChange={(event) => obj.handleChange(event)}
      />
    );
  }

  function textBody(obj) {
    return (
      <input
        type="text"
        id={obj.id}
        className={`reserve-select select-${obj.name} ${
          obj.error && `reserve-select-error`
        }`}
        onChange={(event) => obj.handleChange(event)}
        placeholder={obj.name === "other" ? obj.value : undefined}
      ></input>
    );
  }

  function textAreaBody(obj) {
    return (
      <textarea
        type="text"
        id={obj.id}
        className={`reserve-select tai ${obj.error && `reserve-select-error`}`}
        onChange={(event) => obj.handleChange(event)}
      ></textarea>
    );
  }

  function inputBody(obj) {
    switch (obj.type) {
      case "phone":
        return phoneBody(obj);
      case "textarea":
        return textAreaBody(obj);
      case "address":
        return addressBody(obj);
      default:
        return textBody(obj);
    }
  }

  return (
    <div
      className={`input-${obj.name} ${
        obj.hidden && "input-hidden"
      } input-group`}
    >
      <label className={`input-text ${obj.error && `input-text-error`}`}>
        {" "}
        {obj.text}{" "}
      </label>
      {inputBody(obj)}
    </div>
  );
}

export default Input;
