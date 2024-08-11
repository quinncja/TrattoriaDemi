function Details() {

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  return (
    <div className="details">
      <div>
        <h2>Location</h2>
        <a onClick={() => openInNewTab('https://www.google.com/maps/place/Trattoria+Demi/@42.0462027,-87.6841271,17z/data=!3m1!4b1!4m6!3m5!1s0x880fd00d95d69657:0xda4a27ea17ff42a1!8m2!3d42.0461987!4d-87.6815522!16s%2Fg%2F1th7yynq?entry=ttu')}> 1571 Sherman Ave, Evanston, IL 60201</a>
      </div>
      <div>
        <h2>Hours</h2>
        <div className="time-div">
          <p>Mon - Thurs</p>
          <p>11:30am - 8:30pm</p>
        </div>
        <div className="time-div">
          <p>Fri - Sat</p>
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
          <a href="tel:847-332-2330">847-332-2330</a>
        </div>
        <div className="time-div">
          <p>Email</p>
          <a onClick={() => {window.location.href ='mailto:trattoriademi@gmail.com'}}> trattoriademi@gmail.com </a>
        </div>
      </div>
    </div>
  );
}

export default Details;
