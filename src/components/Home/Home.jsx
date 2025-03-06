import React, { useState, useEffect, useRef } from "react";
import { CssBaseline, Grid } from "@mui/material";
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
  // Ref for FullMapView
  const fullMapViewRef = useRef(null);

  // Scroll to FullMapView when down arrow is clicked
  const handleScrollToMap = () => {
    if (fullMapViewRef.current) {
      fullMapViewRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="flex overflow-hidden flex-col px-5 pt-5 pb-5 mx-auto w-full bg-white rounded max-w-[480px]">
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
      <CategorySection
        setType={setType}
        filteredPlacesInBuffer={filteredPlacesInBuffer}
        setFilteredPlacesInBuffer={setFilteredPlacesInBuffer}
        places={places}
      />

      <br />

      {/* FullMapView with ref */}
      <div ref={fullMapViewRef}>
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

      <KnowYourStation
        selectedStation={selectedStation} // Pass selected station name or ID
        StationData={StationData} // Pass the full station data array
        centerThisStation={centerThisStation}
        setCenterThisStation={setCenterThisStation}
      />

      {/* Bouncing arrow */}
      <div className="relative rounded-xl overflow-auto pt-4">
        <div className="flex justify-center">
          <div
            onClick={handleScrollToMap} // Scroll on arrow click
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
    </main>
  );
}

export default Home;
