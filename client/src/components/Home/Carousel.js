import { useState } from 'react';
import icon_facebook from "../../image/icon_facebook.svg";
import icon_github from "../../image/icon_github.svg";
import icon_insta from "../../image/icon_insta.svg";
import "./Carousel.css";

const Carousel = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const features = [
    {
      id: 1,
      title: 'Feature 1',
      image: icon_facebook,
    },
    {
      id: 2,
      title: 'Feature 2',
      image: icon_github,
    },
    {
      id: 3,
      title: 'Feature 3',
      image: icon_insta,
    },
  ];

  const handleNextFeature = () => {
    setCurrentFeature((currentFeature + 1) % features.length);
  };

  return (
    <div className="carousel-container">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{features[currentFeature].title}</h1>
        <img
          src={features[currentFeature].image}
          alt={`Feature ${features[currentFeature].id}`}
          className="w-20 h-20 mx-auto mt-4"
        />
      </div>
      <div className="carousel-controls text-centel justify-center items-center">
        <div className="carousel-indicators">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`w-3 h-3 mx-1 rounded-full ${
                index === currentFeature ? 'bg-black' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
        <button onClick={handleNextFeature} className="p-2 text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 inline-block"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Carousel;