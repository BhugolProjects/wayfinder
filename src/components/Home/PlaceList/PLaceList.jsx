import React, { useState, useEffect, createRef, useMemo } from "react";
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

  // Update elRefs when places change
  useEffect(() => {
    const refs = Array(places?.length)
      .fill()
      .map((_, i) => elRefs[i] || createRef());
    setElRefs(refs);
  }, [places]);

  // Memoize sortedPlaces to avoid recalculating on every render
  const sortedPlaces = useMemo(() => {
    return topPlaceId
      ? [...places].sort((a, b) =>
          a.id === topPlaceId ? -1 : b.id === topPlaceId ? 1 : 0
        )
      : places;
  }, [places, topPlaceId]);

  // Filter places by type and update filteredPlacesInBuffer

  useEffect(() => {
    const filteredPlaces = sortedPlaces?.filter(
      (place) => place.Type_of_Locality === type
    );

    // Only update state if the filtered data has changed
    if (
      JSON.stringify(filteredPlaces) !== JSON.stringify(filteredPlacesInBuffer)
    ) {
      setFilteredPlacesInBuffer(filteredPlaces);
    }
  }, [sortedPlaces, type, filteredPlacesInBuffer]); // Add filteredPlacesInBuffer as a dependency

  const hasPlaces = sortedPlaces?.some(
    (place) => place.Type_of_Locality === type
  );

  return (
    <Container>
      {isLoading ? (
        <LoadingContainer>
          <CircularProgress size="2rem" color="primary" />
        </LoadingContainer>
      ) : (
        <>
          {hasPlaces ? (
            <ListContainer
              container
              spacing={3}
              sx={{
                width: "100%",
                overflowX: "scroll",
                scrollBehavior: "smooth",
                "::-webkit-scrollbar": { display: "none" },
                "-ms-overflow-style": "none",
                "scrollbar-width": "none",
              }}
            >
              {sortedPlaces?.map((place, i) =>
                place.Type_of_Locality === type ? (
                  <Grid ref={elRefs[i]} item key={i} xs={12}>
                    <PlaceDetails
                      place={place}
                      selected={Number(childClicked) === i}
                      refProp={elRefs[i]}
                      cardcolor="rgba(230, 241, 247, 1)"
                      nearestStation={nearestStation}
                      selectedStation={selectedStation}
                      username={username}
                    />
                  </Grid>
                ) : null
              )}
            </ListContainer>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                textAlign: "center",
                color: "text.secondary",
                fontSize: "1.2rem",
                padding: "20px",
              }}
            >
              Please select a Station to view places
            </Box>
          )}
        </>
      )}
    </Container>
  );
}

export default PlaceList;
