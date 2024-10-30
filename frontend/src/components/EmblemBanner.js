function EmblemBanner() {
  return (
    <div className="emblem-block">
      <link href="https://awards.infcdn.net/circ5_n.css" rel="stylesheet" />

      <link
        href="https://awards.infcdn.net/2024/circle_v2.css"
        rel="stylesheet"
      />
      <div className="award-wrapper">
        <div
          id="circle-r-ribbon"
          onclick="if(event.target.nodeName.toLowerCase() != 'a') {window.open(this.querySelector('.r-ribbon_title').href);return 0;}"
          class=""
        >
          <div class="r-ribbon_ahead">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="160px"
              height="160px"
              viewBox="0 0 160 160"
            >
              <defs>
                <path id="heading-arc" d="M 30 80 a 50 50 0 1 1 100 0"></path>
              </defs>
              <text
                class="r-ribbon_ahead-heading f9"
                fill="#000"
                text-anchor="middle"
                transform="translate(8, 0)"
              >
                <textPath href="#heading-arc" startOffset="50%">
                  Best Italian Restaurant
                </textPath>
              </text>
            </svg>
          </div>
          <p class="r-ribbon_year">2024</p>
          <a
            href="https://restaurantguru.com/Trattoria-Demi-Chicago"
            class="r-ribbon_title"
            target="_blank"
            rel="noreferrer"
          >
            Trattoria Demi
          </a>
          <div class="r-ribbon_ahead r-ribbon_ahead-bottom">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="140px"
              height="140px"
              viewBox="0 0 120 120"
            >
              <defs>
                <path id="subheading-arc" d="M 12 60 a 48 48 0 0 0 96 0"></path>
              </defs>
              <text
                class="r-ribbon_ahead-subh"
                fill="#000"
                text-anchor="middle"
                transform="translate(5, 10)"
              >
                <textPath href="#subheading-arc" startOffset="50%">
                  <a
                    href="https://restaurantguru.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Restaurant Guru
                  </a>
                </textPath>
              </text>
            </svg>
          </div>
        </div>
      </div>

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
  );
}

export default EmblemBanner;
