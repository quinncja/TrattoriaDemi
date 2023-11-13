import { useState } from "react";
import Userfront from "@userfront/core";
const USERFRONT_ID = process.env.REACT_APP_USERFRONT_ID;
Userfront.init(USERFRONT_ID);

function DBLogin(props) {
  const setAuthenticated = props.setAuthenticated;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleChange = (event) => {
    if (event.target.id === "username") {
      setUsername(event.target.value);
    }
    if (event.target.id === "password") {
      setPassword(event.target.value);
    }
  };

  async function onSubmit() {
    try {
      const response = await Userfront.login({
        method: "password",
        username,
        password,
      });
      if (response) {
        setAuthenticated(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="login-input">
      <div className="new-res-header">Dashboard Login</div>
      <input
        className="new-res-input"
        id="username"
        type="username"
        placeholder="Username"
        onChange={(event) => handleChange(event)}
      ></input>
      <input
        className="new-res-input"
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
  );
}

export default DBLogin;
