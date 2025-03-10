import React, { useState, useEffect, useRef } from "react"; // Ensure useRef is imported
import { CssBaseline, Grid } from "@mui/material";
import Joyride from "react-joyride";
import "../../App.css";
import Header from "./Header";
import CategorySection from "./CategorySection";
import { addVisitor, getPlacesData, getStationData } from "../../api";
import FullMapView from "../Map/FullMapView";
import Map from "../Map/Map";
import KnowYourStation from "./KnowYourStation";
import PlaceList from "./PlaceList/PLaceList";
import { getDistance } from "geolib";

function Home({
  topPlaceId,
  setTopPlaceId,
  setCoordinates,
  coordinates,
  places,
  setChildClicked,
  type,
  setType,
  username,
  StationData,
  nearestStation,
  selectedStation,
  stationsWithinRadius,
  setNearestStation,
  setSelectedStation,
  setStationsWithinRadius,
}) {
  const [filteredPlacesInBuffer, setFilteredPlacesInBuffer] = useState();
  const [centerThisStation, setCenterThisStation] = useState();
  const fullMapViewRef = useRef(null); // Define useRef for scrolling
  const placeListViewRef = useRef(null); // Define useRef for scrolling
  
  const [runTour, setRunTour] = useState(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    return !hasVisited; // true on first visit, false otherwise
  });

  const steps = [
    {
      target: ".header",
      content: "Find and search for stations with ease.",
      disableBeacon: true, // No beacon, starts directly
    },
    {
      target: ".category-section",
      content: "Filter places by categories like Transport or Hotels here.",
      disableBeacon: true,
    },
    {
      target: ".full-map-view",
      content: "Explore stations and nearby places on the interactive map. Drag the pin to find points of interest.",
      disableBeacon: true,
    },
    {
      target: ".know-your-station",
      content: "Learn more about your selected station here. Click on this card to zoom in on your station on the map for a closer view.",
      disableBeacon: true,
    },
    {
      target: ".place-list",
      content: "Browse nearby places in this list. You can also view the nearest gate of the metro station and check the lift status.",
      disableBeacon: true,
    },
  ];

  // Set localStorage on first visit, no auto-progression
  useEffect(() => {
    if (runTour) {
      localStorage.setItem("hasVisited", "true");
    }
  }, [runTour]);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if (status === "finished" || status === "skipped") {
      setRunTour(false); // End tour when finished or skipped
    }
  };

  const handleScrollToMap = () => {
    if (fullMapViewRef.current) {
      fullMapViewRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleScrollToPlaceList = () => {
    if (placeListViewRef.current) {
      placeListViewRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <main className="flex overflow-hidden flex-col px-5 pt-5 pb-5 mx-auto w-full bg-white rounded max-w-[480px]">
      <Joyride
        steps={steps}
        run={runTour} // Starts immediately on first visit
        continuous={true} // Allows manual progression with "Next" button
        showSkipButton={true} // Show skip button
        showProgress={true} // Optional: Show step progress
        disableOverlayClose={true} // No closing by clicking outside
        spotlightClicks={false} // No clicking on spotlighted area to proceed
        disableCloseOnEsc={false} // Allow ESC key to close
        hideCloseButton={false} // Show close button
        hideFooter={false} // Show footer with "Next" button
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 10000,
            beaconSize: 0, // Fallback to hide beacon globally
          },
        }}
      />

      <div className="header">
        <Header
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          StationData={StationData}
          nearestStation={nearestStation}
          selectedStation={selectedStation}
          stationsWithinRadius={stationsWithinRadius}
          setNearestStation={setNearestStation}
          setSelectedStation={setSelectedStation}
          setStationsWithinRadius={setStationsWithinRadius}
        />
      </div>
      <div className="category-section">
        <CategorySection
          setType={setType}
          filteredPlacesInBuffer={filteredPlacesInBuffer}
          setFilteredPlacesInBuffer={setFilteredPlacesInBuffer}
          places={places}
        />
      </div>

      <br />

      <div className="full-map-view" ref={fullMapViewRef}>
        <FullMapView
          topPlaceId={topPlaceId}
          setTopPlaceId={setTopPlaceId}
          setCoordinates={setCoordinates}
          coordinates={coordinates}
          places={places}
          setChildClicked={setChildClicked}
          type={type}
          setType={setType}
          isFullView={false}
          username={username}
          nearestStation={nearestStation}
          selectedStation={selectedStation}
          stationsWithinRadius={stationsWithinRadius}
          setNearestStation={setNearestStation}
          setSelectedStation={setSelectedStation}
          setStationsWithinRadius={setStationsWithinRadius}
          centerThisStation={centerThisStation}
          setCenterThisStation={setCenterThisStation}
        />
      </div>

      <div className="know-your-station">
        <KnowYourStation
          selectedStation={selectedStation}
          StationData={StationData}
          centerThisStation={centerThisStation}
          setCenterThisStation={setCenterThisStation}
          fullMapViewRef={fullMapViewRef}
        />
      </div>

      <div className="relative rounded-xl overflow-auto pt-4">
        <div className="flex justify-center">
          <div
            onClick={handleScrollToPlaceList}
            className="cursor-pointer animate-bounce bg-gradient-to-t from-mmwhite to-mmblue shadow-md w-10 h-10 ring-1 ring-slate-900/5 dark:ring-slate-200/20 shadow-lg rounded-full flex items-center justify-center"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ transform: "translateY(2px)" }}
            >
              <path
                d="M2 7 L12 17 L22   7"
                stroke="black"
                stroke-width="4"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="place-list" ref={placeListViewRef}>
        <PlaceList
          topPlaceId={topPlaceId}
          setTopPlaceId={setTopPlaceId}
          setCoordinates={setCoordinates}
          coordinates={coordinates}
          places={places}
          setChildClicked={setChildClicked}
          type={type}
          setType={setType}
          username={username}
          StationData={StationData}
          nearestStation={nearestStation}
          selectedStation={selectedStation}
          stationsWithinRadius={stationsWithinRadius}
          setNearestStation={setNearestStation}
          setSelectedStation={setSelectedStation}
          setStationsWithinRadius={setStationsWithinRadius}
          filteredPlacesInBuffer={filteredPlacesInBuffer}
          setFilteredPlacesInBuffer={setFilteredPlacesInBuffer}
        />
      </div>
    </main>
  );
}

export default Home;