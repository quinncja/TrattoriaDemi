import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { leftArrow, rightArrow } from "svg";

const reviews = [
  '"A wonderful small authentic Italian restaurant that reminded me of my travels in Italy. The angel hair was delicate and sauce heavenly. The gnocchi with chicken was exquisite. Wonderful and attentive service."',
  '"The owner and her crew make for an enjoyable evening at a charming, small but intimate Italian restaurant in Evanston. Our second time there was as enjoyable as the first. Its a great atmosphere, with finely crafted food, impeccable service, and an old world vibe."',
  '"Great hidden gem. Small family owned Italian trattoria. Great pasta, fish and pizza. Ive never been to Italy, but this is what I image authentic Italian cuisine to be."',
  '"Best lil hidden gem in Evanston!"',
  '"Trattoria Demi is the one Italian place I go to again and again. The pasta dishes are tasty, with a wonderful blend of flavors. The lamb shank dish is positively to die for. Its a small place that stays to what it knows and does it extremely well."',
  '"Ive had celiac for nearly 30 years - great pasta & good Italian food are hard to find. This has become my favorite GF place!! The baked rigatoni is a star! I will come back to Evanston just for this place!!"',
  '"Weve been eating here since 1996, and it never disappoints"',
];

function ReviewDisplayer() {
  const [currentReview, setCurrentReview] = useState(0);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    startInterval();
    return () => clearInterval(intervalRef.current);
  });

  const startInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      paginate(1);
    }, 6500);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      transition: {
        x: { duration: 0.5 },
        opacity: { duration: 0.3 },
      },
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { duration: 0.5 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      transition: {
        x: { duration: 0.5 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentReview(
      (prev) => (prev + newDirection + reviews.length) % reviews.length
    );
    startInterval();
  };

  return (
    <div className="review-section">
      <button className="review-arrow" onClick={() => paginate(-1)}>
        {" "}
        {leftArrow()}{" "}
      </button>
      <div className="review-wrapper">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentReview}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="review"
            transition={{ duration: 0.5 }}
          >
            {reviews[currentReview]}
          </motion.div>
        </AnimatePresence>
      </div>
      <button className="review-arrow" onClick={() => paginate(+1)}>
        {" "}
        {rightArrow()}{" "}
      </button>
    </div>
  );
}

export default ReviewDisplayer;
