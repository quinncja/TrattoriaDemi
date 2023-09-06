import React from "react"
import LeftBranch from "../images/LeftLeaf.png"
import RightBranch from "../images/RightLeaf.png"
import useEmblaCarousel from 'embla-carousel-react'
import AutoHeight from 'embla-carousel-auto-height'
import Autoplay from 'embla-carousel-autoplay'

const reviews =
[
    '"A wonderful small authentic Italian restaurant that reminded me of my travels in Italy. The angel hair was delicate and sauce heavenly. The gnocchi with chicken was exquisite. Wonderful and attentive service."',
    '"The owner and her crew make for an enjoyable evening at a charming, small but intimate Italian restaurant in Evanston. Our second time there was as enjoyable as the first. Its a great atmosphere, with finely crafted food, impeccable service, and an old world vibe."',
    '"Great hidden gem. Small family owned Italian trattoria. Great pasta, fish and pizza. Ive never been to Italy, but this is what I image authentic Italian cuisine to be."',
    '"Best lil hidden gem in Evanston!"',
    '"Trattoria Demi is the one Italian place I go to again and again. The pasta dishes are tasty, with a wonderful blend of flavors. The lamb shank dish is positively to die for. Its a small place that stays to what it knows and does it extremely well."',
    '"Ive had celiac for nearly 30 years - great pasta & good Italian food are hard to find. This has become my favorite GF place!! The baked rigatoni is a star! I will come back to Evanston just for this place!!"',
    '"Weve been eating here since 1996, and it never disappoints"'
];


export const EmblaCarousel = () => {
    const autoplayOptions = {  delay: 8000,  rootNode: (emblaRoot) => emblaRoot.parentElement,}

    const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay(autoplayOptions)], [AutoHeight()])
  
    return (
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {reviews.map((review, index) => (
            <div key={index} className="embla__slide">
              {review}
            </div>
          ))}
        </div>
      </div>
    );
  };


function ReviewDisplayer(){

    return(
        <div className="review-display-container">
            <img className="left-branch" src={LeftBranch} alt="LeftBranch"/> 
                <div className="embla-container"> {EmblaCarousel()} </div>
            <img className="right-branch" src={RightBranch} alt="RightBranch"/>
        </div>
    )
}

export default ReviewDisplayer;