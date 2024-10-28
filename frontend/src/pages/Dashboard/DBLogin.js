import { useEffect, useState } from "react";
import Userfront from "@userfront/core";
const USERFRONT_ID = process.env.REACT_APP_USERFRONT_ID;
Userfront.init(USERFRONT_ID);

function DBLogin(props) {
  const setAuthenticated = props.setAuthenticated;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [incorrect, setIncorrect] = useState(false);

  useEffect(() => {
    if (incorrect) {
      setTimeout(() => setIncorrect(false), 5000);
    }
  }, [incorrect]);

  const handleChange = (event) => {
    setIncorrect(false);
    if (event.target.id === "username") {
      setUsername(event.target.value);
    }
    if (event.target.id === "password") {
      setPassword(event.target.value);
    }
  };

  async function onSubmit() {
    setIncorrect(false);
    try {
      const response = await Userfront.login({
        method: "password",
        username,
        password,
      });
      if (response) setAuthenticated(true);
    } catch (error) {
      console.log(error);
      setIncorrect(true);
    }
  }

  return (
    <div className="login-input-wrapper">
      <div className="login-input">
        <div
          className={`new-res-header ${
            incorrect ? "reserve-select-error" : ""
          }`}
        >
          {" "}
          {incorrect ? "Incorrect Login" : "Dashboard Login"}{" "}
        </div>
        <input
          className={` new-res-input ${
            incorrect ? "reserve-select-error" : ""
          }`}
          id="username"
          type="username"
          placeholder="Username"
          onChange={(event) => handleChange(event)}
        ></input>
        <input
          className={` new-res-input ${
            incorrect ? "reserve-select-error" : ""
          } `}
          id="password"
          placeholder="Password"
          onChange={(event) => handleChange(event)}
          type="password"
        ></input>
        <button
          className="submit-button submit-new-res"
          type="button"
          onClick={() => {
            onSubmit();
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default DBLogin;
