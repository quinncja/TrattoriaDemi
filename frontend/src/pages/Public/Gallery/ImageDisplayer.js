import { useState } from "react";

function ImageDisplayer(props) {
  const [isLoaded, setLoaded] = useState(false);

  return (
    <div className="image-container">
      <img
        src={props.pic}
        alt="Yummy Food"
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
      {isLoaded && props.name && (
        <div className="image-description">{props.name}</div>
      )}
    </div>
  );
}

export default ImageDisplayer;
