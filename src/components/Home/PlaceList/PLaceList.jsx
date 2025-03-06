import React, { useState, useEffect, createRef } from "react";
import { CircularProgress, Grid, Box } from "@mui/material";
import { Container, ListContainer, LoadingContainer } from "./styles.jsx";
import PlaceDetails from "../PlaceDetails/PlaceDetails";

function PlaceList({
  topPlaceId,
  setTopPlaceId,
  places,
  childClicked,
  isLoading,
  type,
  setType,
  rating,
  setRating,
  setCoordinates,
  nearestStation,
  selectedStation,
  username,
  filteredPlacesInBuffer,
  setFilteredPlacesInBuffer,
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
  // console.log("places", places);
  useEffect(() => {
    const refs = Array(places?.length)
      .fill()
      .map((_, i) => elRefs[i] || createRef());
    setElRefs(refs);
  }, [places]);

  const sortedPlaces = topPlaceId
    ? [...places].sort((a, b) =>
        a.id === topPlaceId ? -1 : b.id === topPlaceId ? 1 : 0
      )
    : places;

  // Log only the places that match the current type
  useEffect(() => {
    const filteredPlaces = sortedPlaces?.filter(
      (place) => place.Type_of_Locality === type
    );
    setFilteredPlacesInBuffer(filteredPlaces);
    // console.log("Filtered Places being rendered:", filteredPlaces);
  }, [sortedPlaces, type]); // Dependencies: sortedPlaces and type

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
              "::-webkit-scrollbar": { display: "none" }, // Hide scrollbar for Webkit browsers
              "-ms-overflow-style": "none", // Hide scrollbar for IE and Edge
              "scrollbar-width": "none", // Hide scrollbar for Firefox
            }}
          >
            {sortedPlaces?.map((place, i) =>
              place.Type_of_Locality === type ? (
                <Grid ref={elRefs[i]} item key={i} xs={12}>
                  <PlaceDetails
                    place={place}
                    selected={Number(childClicked) === i}
                    refProp={elRefs[i]}
                    cardcolor="rgba(230, 241, 247, 1)" // Single color applied
                    nearestStation={nearestStation}
                    selectedStation={selectedStation}
                    username={username}
                  />
                </Grid>
              ) : null
            )}
          </ListContainer>

        </>
      )}



<div className="flex flex-col items-center mt-5 mb-5 text-xs font-semibold tracking-tight text-center text-neutral-600">
  <p className="mb-2">Developed by</p>
  <img
    loading="lazy"
    src="bhugol.png"
    alt="Developer logo"
    className="object-contain max-w-full rounded-lg aspect-[4.74] w-[152px]"
  />
</div>

    </Container>
  );
}

export default PlaceList;