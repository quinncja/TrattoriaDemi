import Userfront from "@userfront/core";

function Signout() {
  return <button onClick={() => Userfront.logout()}>Sign Out</button>;
}

export default Signout;
