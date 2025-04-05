import React from "react";
import CategoryList from "./CategoryList";
import FullMapView from "./FullMapView";
import "./Map.css";

function Map({
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
  setStationsWithinRadius
}) {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* FullMapView (Map) Component */}
      <FullMapView
      setTopPlaceId={setTopPlaceId}
        setCoordinates={setCoordinates}
        coordinates={coordinates}
        places={places}
        setChildClicked={setChildClicked}
        type={type}
        setType={setType}
        StationData={StationData}
        nearestStation={nearestStation}
        selectedStation={selectedStation}
        stationsWithinRadius={stationsWithinRadius}
        setNearestStation={setNearestStation}
        setSelectedStation={setSelectedStation}
        setStationsWithinRadius={setStationsWithinRadius}
        username={username}
      />

      {/* CategoryList placed above the map */}
      <div className="absolute top-3 left-0 w-full z-10 p-4">
        <CategoryList type={type} setType={setType} places={places}/>
      </div>
    </main>
  );
}

export default Map;
