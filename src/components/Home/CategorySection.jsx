import React, { useState, useEffect, createRef } from "react";
import CategoryItem from "./CategoryItem";
import Slider from "react-slick";
import './style.css'


function CategorySection({setType}) {
  const [selectedSlide, setSelectedSlide] = useState(0);


  const options = [
    { value: "Transportation", label: "Transport", image:'Transportation.svg' },
      { value: "Hotels", label: "Hotels", image:'Hotels.svg' },
      { value: "Health", label: "Hospitals", image:'Health.svg' },
      { value: "Restaurants", label: "Restaurants", image:'Restaurants.svg' },
      { value: "Tourist place", label: "Tourist place", image:'Tourist_place.svg' },
      { value: "Industry", label: "Industry", image:'Industry.svg' },
      { value: "Institutional", label: "Institutional", image:'Institutional.svg' },
      { value: "Commercial", label: "Commercial", image:'Commercial.svg' },
      { value: "Residential", label: "Residential", image:'Residential.svg' },
      { value: "Government Offices", label: "Government Offices", image:'Government_Offices.svg' },
      { value: "Private Offices", label: "Private Offices", image:'Private_Offices.svg' },
      { value: "Recreation", label: "Recreation", image:'Recreation.svg' },
      { value: "Sports", label: "Sports", image:'Sports.svg' },
      { value: "Heritage", label: "Heritage", image:'Heritage.svg' },
      { value: "Religious", label: "Religious", image:'Religious.svg' },
      { value: "Nature", label: "Nature", image:'Nature.svg' },
      { value: "Other", label: "Other", image:'Other.svg' },
  ];

  useEffect(() => {
    const savedSlide = localStorage.getItem("selectedSlide");
    if (savedSlide) {
      setSelectedSlide(parseInt(savedSlide, 10));
      setType(options[parseInt(savedSlide, 10)].value);
    }
  }, []);

  const handleSlideChange = (currentSlide) => {
    setSelectedSlide(currentSlide);
    setType(options[currentSlide].value);
    localStorage.setItem("selectedSlide", currentSlide);
  };


  const settings = {
    dots: false,
    infinite: true, // Disable infinite scroll if you don't need it
    // centerPadding: "2vw", // Keep padding if you want space on both sides
    slidesToShow: 3, // Show three slides at a time
    slidesToScroll: 1, // Scroll only one slide at a time
    swipeToSlide: true, // Allows smooth swiping between slides
    focusOnSelect: false, // Prevent auto selection when sliding
    speed: 500, // Set a smooth scroll speed
    initialSlide: selectedSlide, // Set the initial slide to the saved slide
  };



  return (
    <section className="flex flex-col px-3 pt-2 mt-5 w-full font-medium tracking-tight text-center text-black rounded-2xl bg-gradient-to-t from-mmwhite to-mmblue shadow-md">
      <div className="row d-flex text-center">
            <div className="slides slider-nav style-2 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
              <Slider {...settings}>
                {options.map((option, index) => (
                  <div
                    className={`single-nav ${selectedSlide === index ? "highlight" : ""}`}
                    key={index}
                    style={{ width: "80vw", padding: "0" }}
                    onClick={() => handleSlideChange(index)}
                  >
                    <div className="slide-icon">
                      <img
                        src={`${option.value
                          .replace(/ /g, "_")
                          .replace("(", "")
                          .replace(")", "")}.svg`}
                          alt={`${option.value}`}
                          />
                          <span>{option.label}</span>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
      {/* <button className="px-16 py-3 mt-3.5 text-sm rounded-lg bg-neutral-200">
        All Categories
      </button> */}
    </section>
  );
}

export default CategorySection;