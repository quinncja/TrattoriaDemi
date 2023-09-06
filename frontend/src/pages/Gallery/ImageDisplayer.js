function ImageDisplayer(props) {
  return (
    <div className="image-container">
      <img src={props.pic} alt="Yummy Food" />
      <div className="image-description">{props.name}</div>
    </div>
  );
}

export default ImageDisplayer;
