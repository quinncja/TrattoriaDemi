import { persondeals, calendarDeals } from "./deals";
import FancyLine from "images/FancyLine.png";

export function DealsPopulator(){

    return(
        <> 
        <div className="reserve-top">Who doesn't love a good deal?</div>
        <div className="reserve-container">
        <div className="reserve-section faq-section">
          <div className="menu-section-header">Discounts & Deals</div>
          <img className="fancy-line" src={FancyLine} alt="" />
            <div className="faqs deals"> 
                <div className="deal-container">
                    <div className="deal-svg">
                        {persondeals[0].svg()}
                    </div>
                    <div className="deal-text">
                        <div className="deal-title">
                            {persondeals[0].title}
                        </div>
                        <p>
                            {persondeals[0].text}
                        </p>
                    </div>
                </div>
                <div className="deal-container">
                <div className="deal-svg">
                        {persondeals[1].svg()}
                    </div>
                    <div className="deal-text">  
                        <div className="deal-title">
                            {persondeals[1].title}
                        </div>
                        <p>
                            {persondeals[1].text}
                        </p>
                    </div>
                </div>

                <div className="deal-container">
                    <div className="deal-svg cal-svg">
                        {calendarDeals.svg()}
                    </div>
                    <div className="deal-texts">
                    <div className="deal-text">
                        <div className="deal-title">
                            {calendarDeals.title}
                        </div>
                        <p>
                            {calendarDeals.text}
                        </p>
                    </div>
                    <div className="deal-text">
                        <div className="deal-title">
                            {calendarDeals.title2}
                        </div>
                        <p>
                            {calendarDeals.text2}
                        </p>
                    </div>
                    <p className="excluding-text"> Excluding Holidays </p>
                </div>
                </div>
            </div>
          </div>
        </div>
        </>
    )
}