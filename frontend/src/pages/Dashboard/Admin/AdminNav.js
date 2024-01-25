import { useSearchParams } from "react-router-dom";

function AdminNav({setBody}){
    const [searchParams, setSearchParams] = useSearchParams();
    const body = searchParams.get('body') || "Home"
    const bodies = ["Home", "Menu", "Payroll"];

    const clickHandler = (tag) => {
        searchParams.set("body", tag.toLowerCase());
        setSearchParams(searchParams)
    }

    return(
        <div className="admin-nav">
            {bodies.map((tag) => {
                return(
                <button type="button" className={`selector ${tag === body.charAt(0).toUpperCase()
                    + body.slice(1) ? "selector-active" : ""}`} onClick={() => clickHandler(tag)}>
                    {tag}
                </button>
                )
            })}
        </div> 
    )
}

export default AdminNav;
