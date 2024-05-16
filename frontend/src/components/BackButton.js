import { leftArrow } from "svg";
import { useSearchParams } from "react-router-dom";
import { useContext } from "react";
import BackContext from "context/BackContext";

function BackButton() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { obj } = useContext(BackContext);
  const handleClick = () => {
    obj.forEach((item) => {
      if (item.tag) {
        searchParams.set(item.body, item.tag);
      } else if (searchParams.has(item.body)) {
        searchParams.delete(item.body);
      }
    });

    setSearchParams(searchParams);
  };
  return (
    <button
      onClick={handleClick}
      className={`nav-back-button ${
        searchParams.size <= 1 ? "nav-back-hidden" : ""
      }`}
    >
      {leftArrow()}
    </button>
  );
}

export default BackButton;
