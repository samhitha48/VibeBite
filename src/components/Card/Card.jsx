import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import "./Card.css";

import {
  faStar as solidStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { useMemo } from "react";

export default function Card({
  image,
  name,
  expense,
  distance,
  vibes,
  starRating,
  siteLink,
}) {
  const allStars = useMemo(() => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(starRating)) {
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={solidStar}
            className="text-[#7BA388]"
          />
        );
      } else if (i - starRating <= 0.5) {
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={faStarHalfAlt}
            className="text-[#7BA388]"
          />
        );
      } else {
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={regularStar}
            className="text-[#7BA388]"
          />
        );
      }
    }
    return stars;
  }, []);

  const openWebsite = () => {
    window.open(siteLink, "_blank");
  };

  return (
    <div className="card">
      <div className="image-container">
        <img src={image} alt="location pic" className="restaurant-image" />
      </div>
      <div className="card-info">
        <div className="name-price-container">
          <p>{name}</p>
          <p>{expense}</p>
        </div>
        <p className="distance">{`${distance} mi`}</p>
        <div className="vibes-container">
          {vibes?.map((vibe) => (
            <div className="a-vibe">
              <p>{vibe}</p>
            </div>
          ))}
        </div>
        <div className="star-and-site-container">
          <div className="stars-container">{allStars}</div>
          <div className="button-container">
            <Button
              text="Visit Website"
              type="link"
              onClick={openWebsite}
            ></Button>

            <FontAwesomeIcon
              icon={faArrowRight}
              className="w-4 h-4 text-[#7ba388]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
