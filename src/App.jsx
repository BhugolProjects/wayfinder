import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Header from "./components/Home/Header";
import CategorySection from "./components/Home/CategorySection";
import MapView from "./components/Home/MapView";
import Home from "./components/Home/Home";
import Map from "./components/Map/Map";
import { getPlacesData } from "./api";
import SplashScreen from "./components/Splash/SplashScreen";

function App() {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  const [childClicked, setChildClicked] = useState(null);

  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBounds] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const [type, setType] = useState("Transportation");
  const [rating, setRating] = useState(0);

  const [showSplashScreen, setShowSplashScreen] = useState(true); // State to manage the splash screen

  // Show splash screen for 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplashScreen(false);
    }, 3000); // Adjust the time as needed (3 seconds)

    return () => clearTimeout(timer); // Clear the timer when the component unmounts
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  useEffect(() => {
    if (places && places.length > 0) {
      const filteredPlaces = places;
      setFilteredPlaces(filteredPlaces);
    }
  }, [rating, places]);

  useEffect(() => {
    const bounds = {
      sw: {
        lat: coordinates.lat - 0.005,
        lng: coordinates.lng - 0.005,
      },
      ne: {
        lat: coordinates.lat + 0.005,
        lng: coordinates.lng + 0.005,
      },
    };
    setBounds(bounds);
  }, [coordinates]);

  useEffect(() => {
    if (bounds.sw && bounds.ne) {
      setIsLoading(true);
      getPlacesData(type, bounds.sw, bounds.ne, coordinates)
        .then((data) => {
          if (data && Array.isArray(data)) {
            setPlaces(data);
            setFilteredPlaces([]);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching places data:", error);
          setIsLoading(false);
        });
    }
  }, [type, bounds]);

  // If splash screen is active, show it
  if (showSplashScreen) {
    return <SplashScreen 
    stationName={'AAREY'}
    />;
  }

  // Main app routes after the splash screen disappears
  return (
    <main className="flex overflow-hidden flex-col mx-auto w-full bg-white rounded max-w-[480px]">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                setCoordinates={setCoordinates}
                setBounds={setBounds}
                coordinates={coordinates}
                places={places}
                setChildClicked={setChildClicked}
                isLoading={isLoading}
                type={type}
                setType={setType}
                rating={rating}
                setRating={setRating}
              />
            }
          />
          <Route path="/map"
            element={
              <Map
                setCoordinates={setCoordinates}
                setBounds={setBounds}
                coordinates={coordinates}
                places={places}
                setChildClicked={setChildClicked}
                isLoading={isLoading}
                type={type}
                setType={setType}
                rating={rating}
                setRating={setRating}
              />
            }
          />
        </Routes>
      </Router>
    </main>
  );
}

export default App;
