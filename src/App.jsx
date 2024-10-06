import { BrowserRouter as Router, Route, Routes, useSearchParams } from "react-router-dom";
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

  useEffect(() => {
    if (localStorage.getItem('wayfinderUsername')){
      setUsername(localStorage.getItem('wayfinderUsername'));
    } else {
      const timestamp = Date.now();
      const newUsername = `USER${timestamp}`;
      setUsername(newUsername);
    }
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

  useEffect(() => {
    const fetchStationData = async () => {
      const data = await getStationData();
      setStationData(data);
    };

    fetchStationData();
  }, []);

  useEffect(() => {
    if (coordinates.lat && coordinates.lng) {
      const { lat, lng } = coordinates;
      const filteredStations = StationData.filter(station => {
        const distance = getDistance(
          { latitude: lat, longitude: lng },
          { latitude: station.Station_Latitude, longitude: station.Station_Longitude }
        );
        return distance <= 1000;
      });

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
        addVisitor(nearest);
        setNearestStation(nearest);
        setStationsWithinRadius(filteredStations);
        setSelectedStation(nearest.Station_Code);
      } else {
        setNearestStation(null);
        setStationsWithinRadius([]);
        setSelectedStation("no-station");
      }
    }
  }, [coordinates]);

  return (
    <main className="flex overflow-hidden flex-col mx-auto w-full bg-white rounded max-w-[480px]">
      <Router>
        <Routes>
          <Route path="/" element={<SplashScreenWithQuery/>} />
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
          <Route
            path="/map"
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
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </Router>
    </main>
  );
}

function SplashScreenWithQuery() {
  const [searchParams] = useSearchParams();
  const stationName = searchParams.get("stationName") || ""; // Default to 'Aarey' if no stationName is provided

  return <SplashScreen />;
}

export default App;
