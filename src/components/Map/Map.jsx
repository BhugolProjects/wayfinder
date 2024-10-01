import React from "react";
import CategoryList from "./CategoryList";
import FullMapView from "./FullMapView";
import './Map.css';

function Map({ setCoordinates, coordinates, places, setChildClicked, type, setType }) {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* FullMapView (Map) Component */}
      <FullMapView 
        setCoordinates={setCoordinates}
        coordinates={coordinates}
        places={places}
        setChildClicked={setChildClicked}
        type={type}
        setType={setType}
      />

      {/* CategoryList placed above the map */}
      <div className="absolute top-3 left-0 w-full z-10 p-4">
        <CategoryList type={type} setType={setType} />
      </div>
    </main>
  );
}

export default Map;
