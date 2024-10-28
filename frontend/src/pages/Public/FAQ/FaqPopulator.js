import { faqs } from "./faqs";
import FancyLine from "images/FancyLine.png";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import FaqCard from "./FaqCard";

function FaqPopulator() {
  return (
    <LayoutGroup>
      <div className="reserve-top">
        Can't find an answer? Call us at 847-332-2330
      </div>
      <div className="reserve-container faq--container">
        <div className="reserve-section faq-section">
          <div className="menu-section-header">Frequently asked questions</div>
          <img className="fancy-line" src={FancyLine} alt="" />
          <AnimatePresence>
            <motion.div className="faqs">
              {faqs.map((faq) => {
                return <FaqCard faq={faq} />;
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </LayoutGroup>
  );
}

export default FaqPopulator;
