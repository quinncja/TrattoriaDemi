import { useSearchParams } from "react-router-dom";
import { clockSvg, homeSvg, menuSvg, peopleSvg } from "svg";

function AdminNav() {
  const [searchParams, setSearchParams] = useSearchParams();
  const body = searchParams.get("body") || "Home";
  const bodies = [
    {
      tag: "Home",
      svg: homeSvg(),
    },
    {
      tag: "Menu",
      svg: menuSvg(),
    },
    {
      tag: "Payroll",
      svg: clockSvg(),
    },
    {
      tag: "Employees",
      svg: peopleSvg(),
    },
  ];

  const clickHandler = (tag) => {
    searchParams.set("body", tag.toLowerCase());
    setSearchParams(searchParams);
  };

  return (
    <div className="admin-nav">
      {bodies.map((item) => {
        return (
          <button
            type="button"
            className={`admin-selector ${
              item.tag === body.charAt(0).toUpperCase() + body.slice(1)
                ? "selector-active"
                : ""
            }`}
            onClick={() => clickHandler(item.tag)}
          >
            {item.svg}
            {item.tag}
          </button>
        );
      })}
    </div>
  );
}

export default AdminNav;
