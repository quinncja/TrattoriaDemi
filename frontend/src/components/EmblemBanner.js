function EmblemBanner(){

    return(
        <div className="emblem-block">
        <link href="https://awards.infcdn.net/circ5_n.css" rel="stylesheet" />
        <div
          id="rest_circ5"
          onClick={(event) =>
            event.target.nodeName.toLowerCase() !== "a"
              ? window.open(this.querySelector(".circ_top_title").href)
              : ""
          }
        >
          <div className="circ_cont">
            <div
              className="circ_img"
              style={{
                background: "url('https://awards.infcdn.net/img/star_red.svg')",
                repeat: "4 1fr",
                align: "center",
              }}
            >
              &nbsp;
            </div>
            <a
              href="https://restaurantguru.com"
              rel="noreferrer"
              target="_blank"
              className="circ_top_title"
            >
              Restaurant Guru 2023
            </a>
            <span className="">Best italian restaurant</span>{" "}
            <a
              href="https://restaurantguru.com/Trattoria-Demi-Chicago"
              rel="noreferrer"
              className="circ_bot_title"
              target="_blank"
            >
              Trattoria Demi
            </a>
          </div>
        </div>
        <a
          href="http://www.opentable.com/restaurant/profile/252628/reserve?rid=252628&restref=252628"
          target="_blank"
          rel="noreferrer"
        >
          <img
            height="150px"
            width="150px"
            src="https://restaurant.opentable.com/badge/ot/DC-2022.png"
            alt="Open table"
          />
        </a>
      </div>
    )
}

export default EmblemBanner;