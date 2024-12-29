import FoundTable from "./FoundTable";
import TableFinder from "./TableFinder";

const { useState } = require("react");

function ModifyRes(props) {
  const { reservation, setModify, updateRes } = props;
  const [table, setTable] = useState({ ...reservation, time: "" });
  const [isEditing, setEditing] = useState(true);

  const returnToEdit = () => {
    setTable((prevTable) => ({
      ...prevTable,
      time: "",
    }));
    setEditing(true);
  };

  return (
    <>
      {isEditing ? (
        <TableFinder
          table={table}
          setTable={setTable}
          editing={true}
          setEditing={setEditing}
        />
      ) : (
        <FoundTable table={table} setEditing={returnToEdit} inRes={true} />
      )}
      <div className="res-buttons">
        {!isEditing && (
          <button
            className={`submit-button save-modify-btn ${
              isEditing && "hidden-button"
            } `}
            onClick={() => updateRes(table)}
          >
            Save
          </button>
        )}

        <button
          className="submit-button res-cancel-btn"
          onClick={() => setModify(false)}
        >
          Cancel Editing
        </button>
      </div>
    </>
  );
}

export default ModifyRes;
