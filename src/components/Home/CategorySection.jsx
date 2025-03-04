import React, { useState, useEffect, useMemo } from "react";
import Slider from "react-slick";
import "./style.css";

function CategorySection({ setType, places }) {
  const [selectedSlide, setSelectedSlide] = useState(0);

  const options = [
    { value: "Transportation", label: "Transport", image: "Transportation.svg" },
    { value: "Hotels", label: "Hotels", image: "Hotels.svg" },
    { value: "Health", label: "Hospitals", image: "Health.svg" },
    { value: "Restaurants", label: "Restaurants", image: "Restaurants.svg" },
    { value: "Tourist place", label: "Tourist place", image: "Tourist_place.svg" },
    { value: "Industry", label: "Industry", image: "Industry.svg" },
    { value: "Institutional", label: "Institutional", image: "Institutional.svg" },
    { value: "Commercial", label: "Commercial", image: "Commercial.svg" },
    { value: "Residential", label: "Residential", image: "Residential.svg" },
    { value: "Government Offices", label: "Government Offices", image: "Government_Offices.svg" },
    { value: "Private Offices", label: "Private Offices", image: "Private_Offices.svg" },
    { value: "Recreation", label: "Recreation", image: "Recreation.svg" },
    { value: "Sports", label: "Sports", image: "Sports.svg" },
    { value: "Heritage", label: "Heritage", image: "Heritage.svg" },
    { value: "Religious", label: "Religious", image: "Religious.svg" },
    { value: "Nature", label: "Nature", image: "Nature.svg" },
    { value: "Other", label: "Other", image: "Other.svg" },
  ];

  // Normalize Type_of_Locality to match options (title case)
  const availableTypes = useMemo(() => {
    return new Set(
      places.map(place =>
        place.Type_of_Locality.toLowerCase()
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      )
    );
  }, [places]);

  // Reorder options: available first, disabled last
  const sliderOptions = useMemo(() => {
    const availableOptions = options.filter(opt => availableTypes.has(opt.value));
    const disabledOptions = options.filter(opt => !availableTypes.has(opt.value));
    return [...availableOptions, ...disabledOptions];
  }, [availableTypes]);

  // Set initial slide based on saved type or first available
  useEffect(() => {
    const savedType = localStorage.getItem("selectedType");
    let initialSlide = 0;

    if (savedType) {
      const index = sliderOptions.findIndex(opt => opt.value === savedType);
      if (index !== -1 && availableTypes.has(savedType)) {
        initialSlide = index;
      } else {
        initialSlide = sliderOptions.findIndex(opt => availableTypes.has(opt.value));
      }
    } else {
      initialSlide = sliderOptions.findIndex(opt => availableTypes.has(opt.value));
    }

    if (initialSlide !== -1) {
      setSelectedSlide(initialSlide);
      setType(sliderOptions[initialSlide].value);
    }
  }, [sliderOptions, availableTypes, setType]);

  const handleSlideChange = (currentSlide) => {
    setSelectedSlide(currentSlide);
    const selectedValue = sliderOptions[currentSlide].value;
    setType(selectedValue);
    localStorage.setItem("selectedType", selectedValue);
  };

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    focusOnSelect: false,
    speed: 500,
    initialSlide: selectedSlide,
  };

  return (
    <section className="flex flex-col px-3 pt-2 mt-5 w-full font-medium tracking-tight text-center text-black rounded-2xl bg-gradient-to-t from-mmwhite to-mmblue shadow-md">
      <div className="row d-flex text-center">
        <div className="slides slider-nav style-2 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
          <Slider {...settings}>
            {sliderOptions.map((option, index) => {
              const isAvailable = availableTypes.has(option.value);
              return (
                <div
                  className={`single-nav ${selectedSlide === index ? "highlight" : ""} ${!isAvailable ? "disabled" : ""}`}
                  key={option.value}
                  style={{ width: "80vw", padding: "0" }}
                  onClick={() => {
                    if (isAvailable) {
                      handleSlideChange(index);
                    }
                  }}
                >
                  <div className="slide-icon">
  <img
    src={`${option.value.replace(/ /g, "_").replace("(", "").replace(")", "")}.svg`}
    alt={`${option.value}`}
    className={!isAvailable ? "grayscale blur" : ""}
  />
  <span className={!isAvailable ? "unavailable-text" : ""}>
    {option.label}
  </span>
</div>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    </section>
  );
}

export default CategorySection;