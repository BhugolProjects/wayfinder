import React, { useState, useEffect, useMemo, useRef } from "react";
import { CircularProgress, Grid, Box, Chip } from "@mui/material";

function CategoryList({ type, setType, places }) {
  const sliderRef = useRef(null);

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

  // Compute available types from places using useMemo for optimization
  const availableTypes = useMemo(() => {
    return new Set(
      places.map((place) =>
        place.Type_of_Locality.toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      )
    );
  }, [places]);

  // Compute available options
  const availableOptions = useMemo(() => {
    return options.filter((opt) => availableTypes.has(opt.value));
  }, [availableTypes]);

  // Compute ordered options: available first, then unavailable
  const orderedOptions = useMemo(() => {
    const unavailableOptions = options.filter((opt) => !availableTypes.has(opt.value));
    return [...availableOptions, ...unavailableOptions];
  }, [availableOptions, availableTypes]);

  // Set type to first available option if current type is unavailable
  useEffect(() => {
    if (!availableTypes.has(type) && availableOptions.length > 0) {
      setType(availableOptions[0].value);
    }
  }, [availableOptions, availableTypes, type, setType]);

  // Scroll to the selected chip when type changes
  useEffect(() => {
    positionSelectedChip(type);
  }, [type]);

  const positionSelectedChip = (value) => {
    if (sliderRef.current) {
      const chipElement = document.getElementById(value);
      if (chipElement) {
        const slider = sliderRef.current;
        const sliderWidth = slider.clientWidth;
        const chipWidth = chipElement.clientWidth;
        const chipOffsetLeft = chipElement.offsetLeft;

        // Calculate the scroll position to center the selected chip
        const centerOffset = sliderWidth / 2 - chipWidth / 2;
        const scrollPosition = chipOffsetLeft - centerOffset;

        slider.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  };

  const handleChipClick = (value) => {
    setType(value);
  };

  return (
    <nav className="flex gap-2.5 items-start self-start mt-3 -mr-12 text-xs tracking-wide text-black text-opacity-30">
      <Box display="flex" overflow="hidden" justifyContent="center" padding={1}>
        <Box
          ref={sliderRef}
          display="flex"
          gap={1}
          flexWrap="nowrap"
          sx={{
            width: "100%",
            overflowX: "auto",
            scrollbarWidth: "none",
            scrollBehavior: "smooth",
            padding: 0,
          }}
        >
          {orderedOptions.map((option) => {
            const isAvailable = availableTypes.has(option.value);
            return (
              <Chip
                id={option.value}
                key={option.value}
                label={option.label}
                variant={isAvailable && type === option.value ? "filled" : "outlined"}
                onClick={() => isAvailable && handleChipClick(option.value)}
                disabled={!isAvailable}
                sx={{
                  backgroundColor: isAvailable && type === option.value ? "#0091B7" : "#ffffff",
                  color: isAvailable && type === option.value ? "#FFF" : "#000",
                //   opacity: isAvailable ? 1 : 0.8, // Reduce opacity for unavailable options
                //   filter: isAvailable ? "none" : "blur(1px)", // Apply blur to unavailable options
                  "&:hover": {
                    // backgroundColor: isAvailable
                    //   ? type === option.value
                    //     ? "#0091B7"
                    //     : "#BDBDBD"
                    //   : "#ffffff",
                  },
                }}
              />
            );
          })}
        </Box>
      </Box>
    </nav>
  );
}

export default CategoryList;