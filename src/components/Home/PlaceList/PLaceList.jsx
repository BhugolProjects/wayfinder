import React, { useState, useEffect, createRef } from "react";
import { CircularProgress, Grid, Box } from "@mui/material";
import { Container, ListContainer, LoadingContainer } from "./styles.jsx";
import PlaceDetails from "../PlaceDetails/PlaceDetails";



function PlaceList({
  places,
  childClicked,
  isLoading,
  type,
  setType,
  rating,
  setRating,
  setCoordinates,
}) {
  const [elRefs, setElRefs] = useState([]);


  const options = [
    { value: "Transportation", label: "Transport" },
    { value: "Hotels", label: "Hotels" },
    { value: "Health", label: "Hospitals" },
    { value: "Restaurants", label: "Restaurants" },
    { value: "Tourist place", label: "Tourist place" },
    { value: "Industry", label: "Industry" },
    { value: "Institutional", label: "Institutional" },
    { value: "Commercial", label: "Commercial" },
    { value: "Residential", label: "Residential" },
    { value: "Government Offices", label: "Government Offices" },
    { value: "Private Offices", label: "Private Offices" },
    { value: "Recreation", label: "Recreation" },
    { value: "Sports", label: "Sports" },
    { value: "Heritage", label: "Heritage" },
    { value: "Religious", label: "Religious" },
    { value: "Nature", label: "Nature" },
    { value: "Other", label: "Other" },
  ];

  useEffect(() => {
    const refs = Array(places?.length)
      .fill()
      .map((_, i) => elRefs[i] || createRef());
    setElRefs(refs);
  }, [places]);

  const cardcolors = ['rgba(3, 182, 187, 0.1)', 'rgba(90, 69, 149, 0.1)', 'rgba(255, 107, 131, 0.1)'];







  return (
    <Container>
      {isLoading ? (
        <LoadingContainer>
          <CircularProgress size="2rem" color="primary" />
        </LoadingContainer>
      ) : (
        <>
          <ListContainer
            container
            spacing={3}
            sx={{
              width: "100%",
              overflowX: "scroll",
              scrollBehavior: "smooth",
              marginTop: "10px",
              "::-webkit-scrollbar": { display: "none" }, // Hide scrollbar for Webkit browsers
              "-ms-overflow-style": "none", // Hide scrollbar for IE and Edge
              "scrollbar-width": "none", // Hide scrollbar for Firefox
            }}
          >
            {places?.map((place, i) =>
              place.Type_of_Locality === type ? (
                <Grid ref={elRefs[i]} item key={i} xs={12}>
                  <PlaceDetails
                    place={place}
                    selected={Number(childClicked) === i}
                    refProp={elRefs[i]}
                    cardcolor={cardcolors[i % cardcolors.length]}
                  />
                </Grid>
              ) : null
            )}
          </ListContainer>
        </>
      )}
    </Container>
  );
}

export default PlaceList;
