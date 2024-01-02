function Details() {
  return (
    <div className="details">
      <div>
        <h2>Location</h2>
        <p>1571 Sherman Ave, Evanston, IL 60201</p>
      </div>
      <div>
        <h2>Hours</h2>
        <div className="time-div">
          <p>Monday - Thursday</p>
          <p>11:30am - 8:30pm</p>
        </div>
        <div className="time-div">
          <p>Friday - Saturday</p>
          <p>11:30am - 9:30pm</p>
        </div>
        <div className="time-div">
          <p>Sunday</p>
          <p>12:00pm - 8:30pm</p>
        </div>
      </div>
      <div>
        <h2>Contact</h2>
        <div className="time-div">
          <p>Phone</p>
          <p>847-332-2330</p>
        </div>
        <div className="time-div">
          <p>Email</p>
          <p>trattoriademi@gmail.com</p>
        </div>
      </div>
    </div>
  );
}

export default Details;
