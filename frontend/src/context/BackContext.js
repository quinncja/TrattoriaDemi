import React, { useState, createContext } from "react";

const BackContext = createContext();
export default BackContext;

export function BackProvider(props) {
  const [backObj, setBackObject] = useState([
    {
      body: null,
      tag: null,
    },
  ]);

  return (
    <BackContext.Provider
      value={{
        obj: backObj,
        setter: setBackObject,
      }}
    >
      {props.children}
    </BackContext.Provider>
  );
}
