import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Header from "./components/Home/Header";
import CategorySection from "./components/Home/CategorySection";
import MapView from "./components/Home/MapView";
import Home from "./components/Home/Home";
import Map from "./components/Map/Map";
import { addVisitor, getPlacesData, getStationData } from "./api";
import SplashScreen from "./components/Splash/SplashScreen";
import Terms from "./components/Terms/Terms";
import { getDistance } from "geolib";

function App() {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  const [childClicked, setChildClicked] = useState(null);

  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBounds] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const [type, setType] = useState("Transportation");
  const [rating, setRating] = useState(0);

  const [username, setUsername] = useState('');

  const [nearestStation, setNearestStation] = useState(null);
  const [selectedStation, setSelectedStation] = useState("");
  const [StationData, setStationData] = useState([]);
  const [stationsWithinRadius, setStationsWithinRadius] = useState([]);

  // const [showSplashScreen, setShowSplashScreen] = useState(true); // State to manage the splash screen

  // // Show splash screen for 3 seconds
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowSplashScreen(false);
  //   }, 3000); // Adjust the time as needed (3 seconds)

  //   return () => clearTimeout(timer); // Clear the timer when the component unmounts
  // }, []);

  useEffect(() => {
    if (localStorage.getItem('wayfinderUsername')){
      setUsername(localStorage.getItem('wayfinderUsername'));
    } 
    else {
    // Generate username when the component mounts
    const timestamp = Date.now(); // Get the current timestamp
    const newUsername = `USER${timestamp}`;
    setUsername(newUsername);
    }
  }, []); // Empty dependency array ensures it only runs on mount

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

  


  useEffect(() => {
    const fetchStationData = async () => {
      const data = await getStationData();  // Fetch station data
      setStationData(data);  // Update state with fetched station data
    };

    fetchStationData();
  }, []);



  useEffect(() => {
    if (coordinates.lat && coordinates.lng) {
      const { lat, lng } = coordinates;

      // Find stations within the radius
      const filteredStations = StationData.filter(station => {
        const distance = getDistance(
          { latitude: lat, longitude: lng },
          { latitude: station.Station_Latitude, longitude: station.Station_Longitude }
        );
        return distance <= 1000; // Filter stations within 1000 meters
      });

      // If there are any stations within the radius, find the closest one
      if (filteredStations.length > 0) {
        const nearest = filteredStations.reduce((prev, curr) => {
          const prevDistance = getDistance(
            { latitude: lat, longitude: lng },
            { latitude: prev.Station_Latitude, longitude: prev.Station_Longitude }
          );
          const currDistance = getDistance(
            { latitude: lat, longitude: lng },
            { latitude: curr.Station_Latitude, longitude: curr.Station_Longitude }
          );
          return currDistance < prevDistance ? curr : prev;
        });
        // console.log(nearest);
        addVisitor(nearest); // Increment visitor count for the nearest station
        setNearestStation(nearest);
        setStationsWithinRadius(filteredStations);
        setSelectedStation(nearest.Station_Code); // Set selected station to nearest one
      } else {
        // No station within the radius
        setNearestStation(null);
        setStationsWithinRadius([]);
        setSelectedStation("no-station"); // Use a unique value to indicate no station
      }
    }
  }, [coordinates]);

  // If splash screen is active, show it
  // if (showSplashScreen) {
  //   return <SplashScreen 
  //   stationName={'AAREY'}
  //   />;
  // }

  // Main app routes after the splash screen disappears
  return (
    <main className="flex overflow-hidden flex-col mx-auto w-full bg-white rounded max-w-[480px]">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <SplashScreen stationName={'Aarey'}/>
            }
          />
          <Route
            path="/home"
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
                StationData={StationData}
                nearestStation={nearestStation}
                selectedStation={selectedStation}
                stationsWithinRadius={stationsWithinRadius}
                setNearestStation={setNearestStation}
                setSelectedStation={setSelectedStation}
                setStationsWithinRadius={setStationsWithinRadius}
                username={username}
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
                StationData={StationData}
                nearestStation={nearestStation}
                selectedStation={selectedStation}
                stationsWithinRadius={stationsWithinRadius}
                setNearestStation={setNearestStation}
                setSelectedStation={setSelectedStation}
                setStationsWithinRadius={setStationsWithinRadius}
                username={username}
              />
            }
          />
          <Route path="/terms"
            element={
              <Terms />
            }
          />
        </Routes>
      </Router>
    </main>
  );
}

export default App;
