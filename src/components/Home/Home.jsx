import React, { useState, useEffect } from "react";
import { CssBaseline, Grid } from "@mui/material";
import '../../App.css';
import Header from './Header';
import CategorySection from './CategorySection';

import { getPlacesData } from "../../api";
import FullMapView from '../Map/FullMapView';
import Map from "../Map/Map";
import PlaceList from "./PlaceList/PLaceList";

function Home({setCoordinates, coordinates, places, setChildClicked, type, setType}) {
  



  return (
    <main className="flex overflow-hidden flex-col px-5 pt-5 pb-5 mx-auto w-full bg-white rounded max-w-[480px]">
      <Header coordinates={coordinates} setCoordinates={setCoordinates} />
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
          />
        <br />

        <PlaceList 
        setCoordinates={setCoordinates}
        coordinates={coordinates}
        places={places}
        setChildClicked={setChildClicked}
        type={type}
        setType={setType}
        />
    </main>
  );
}

export default Home;
