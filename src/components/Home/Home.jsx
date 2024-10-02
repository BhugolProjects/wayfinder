import React, { useState, useEffect } from "react";
import { CssBaseline, Grid } from "@mui/material";
import "../../App.css";
import Header from "./Header";
import CategorySection from "./CategorySection";

import { addVisitor, getPlacesData, getStationData } from "../../api";
import FullMapView from "../Map/FullMapView";
import Map from "../Map/Map";
import PlaceList from "./PlaceList/PLaceList";
import { getDistance } from "geolib";

function Home({
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
      <CategorySection setType={setType} />

      <br />

      <FullMapView
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
      />
      <br />

      <PlaceList
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
      />
    </main>
  );
}

export default Home;
