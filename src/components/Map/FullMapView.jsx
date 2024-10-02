import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  useMediaQuery,
  Typography,
  Box,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  CardMedia,
} from "@mui/material";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import { MapContainer } from "./styles.js";
import "./Map.css";
import stationGeoJSON from "./MML3_Alignment.geojson";
import { ArrowBack } from "@mui/icons-material";
import DirectionsIcon from '@mui/icons-material/Directions';
import { addVisitor, addVisitorAnalysis, getStationData } from "../../api/index.js";
import { getDistance } from "geolib";

function createMarker(
  icon,
  position,
  color,
  popupText,
  draggable = false,
  map,
  setChildClicked,
  i,
  setSelectedPlace,
  place
) {
  var markerElement = document.createElement("div");
  markerElement.className = "marker";

  var markerContentElement = document.createElement("div");
  markerContentElement.className = "";
  markerContentElement.style.backgroundColor = color;
  markerElement.appendChild(markerContentElement);

  var iconElement = document.createElement("div");
  iconElement.className = "marker-icon";
  iconElement.style.backgroundImage = `url(${icon})`;
  markerContentElement.appendChild(iconElement);

  // var markerPointerElement = document.createElement("div");
  // markerPointerElement.className = "marker-pointer";
  // markerContentElement.appendChild(markerPointerElement);

  var popup = new tt.Popup({ offset: 30 }).setText(popupText);

  const marker = new tt.Marker({
    element: markerElement,
    anchor: "bottom",
    draggable: draggable,
  })
    .setLngLat(position)
    .setPopup(popup)
    .addTo(map);

  marker.getElement().addEventListener("click", () => {
    setChildClicked(i);
    setSelectedPlace(place); // Set the selected place data
  });

  return marker;
}

function createSelfMarker(
  icon,
  position,
  color,
  popupText,
  draggable,
  map,
  onDragEnd
) {
  var markerElement = document.createElement("div");
  markerElement.className = "marker-circle";
  markerElement.style.zIndex = "9999";

  var markerContentElement = document.createElement("div");
  markerContentElement.className = "marker-circle-content";
  markerContentElement.style.backgroundColor = color;
  markerElement.appendChild(markerContentElement);

  var iconElement = document.createElement("div");
  iconElement.className = "marker-circle-icon";
  iconElement.style.backgroundImage = `url(${icon})`;
  markerContentElement.appendChild(iconElement);

  var popup = new tt.Popup({ offset: 30 }).setText(popupText);

  const marker = new tt.Marker({
    element: markerElement,
    anchor: "bottom",
    draggable: draggable,
  })
    .setLngLat(position)
    .setPopup(popup)
    .addTo(map);

  marker.on("dragend", onDragEnd);

  return marker;
}

function createCircleMarker(
  icon,
  position,
  color,
  popupText,
  draggable = false,
  map,
  setChildClicked,
  i
) {
  if (!map) {
    console.error("Map is not initialized");
    return;
  }

  var markerElement = document.createElement("div");
  markerElement.style.width = "30px";
  markerElement.style.height = "30px";
  markerElement.style.borderRadius = "50%";
  markerElement.style.backgroundColor = "white";
  markerElement.style.borderColor = "green";
  markerElement.style.borderWidth = "3px";
  markerElement.style.borderStyle = "solid";
  markerElement.style.display = "flex";
  markerElement.style.justifyContent = "center";
  markerElement.style.alignItems = "center";

  var iconElement = document.createElement("div");
  iconElement.style.backgroundImage = `url(${icon})`;
  iconElement.style.backgroundSize = "22px 22px";
  iconElement.style.width = "22px";
  iconElement.style.height = "22px";
  iconElement.style.borderRadius = "50%";
  markerElement.appendChild(iconElement);

  var popup = new tt.Popup({ offset: 30 }).setText(popupText);

  const marker = new tt.Marker({
    element: markerElement,
    anchor: "bottom",
    draggable: draggable,
  })
    .setLngLat(position)
    .setPopup(popup)
    .addTo(map);

  marker.getElement().addEventListener("click", () => setChildClicked(i));
  return marker;
}

function initializeMap(containerId, coordinates, setCoordinates) {
  const map = tt.map({
    key: process.env.REACT_APP_TOMTOM_API_KEY,
    container: containerId,
    center: [coordinates.lng, coordinates.lat], // Ensure valid coordinates are passed
    zoom: 14,
    stylesVisibility: {
      poi: false,
    },
  });

  map.addControl(new tt.NavigationControl());
  var geolocateControl = new tt.GeolocateControl({
    positionOptions: { enableHighAccuracy: false },
  });

  geolocateControl.on("geolocate", function (e) {
    var coordinates = e.coords;
    setCoordinates({ lat: coordinates.latitude, lng: coordinates.longitude });
  });

  map.addControl(geolocateControl);

  map.on("load", function () {
    map.addLayer({
      id: "metro-line",
      type: "line",
      source: {
        type: "geojson",
        data: stationGeoJSON,
      },
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#02D8E9",
        "line-width": 5,
      },
    });
  });

  // Set user's current location if available
  navigator.geolocation.getCurrentPosition(
    ({ coords: { latitude, longitude } }) => {
      setCoordinates({ lat: latitude, lng: longitude });
      map.setCenter([longitude, latitude]);
    }
  );

  return map;
}

const handleGetDirections = async (place, username, nearestStation) => {
  const latitude = place.Latitude;
  const longitude = place.Longitude;
  await addVisitorAnalysis(place, username, nearestStation)
  if (latitude && longitude) {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
      "_blank"
    );
  } else if (place.address) {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        place.address
      )}`,
      "_blank"
    );
  } else {
    alert("Location information is not available.");
  }
};

function FullMapView({
  setCoordinates,
  coordinates,
  places,
  setChildClicked,
  type,
  setType,
  isFullView = true,
  username,
  StationData,
  nearestStation,
  selectedStation,
  stationsWithinRadius,
  setNearestStation,
  setStationsWithinRadius,
  setSelectedStation,
}) {
  const [selectedPlace, setSelectedPlace] = useState(null); // State for selected place
  const mapRef = useRef(null); // UseRef to hold the map instance
  const markersRef = useRef([]); // To hold the current markers
  const selfMarkerRef = useRef(null); // UseRef to hold the self-marker instance
  const [stationData, setStationData] = useState([]);
  const isDesktop = useMediaQuery("(min-width:600px)");
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchStationData = async () => {
      const data = await getStationData(); // Fetch station data
      setStationData(data); // Update state with fetched station data
    };

    fetchStationData();
  }, []);

  useEffect(() => {
    if (coordinates.lat && coordinates.lng) {
      const { lat, lng } = coordinates;

      // Find stations within the radius
      const filteredStations = stationData.filter(station => {
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

  // Initialize the map only once
  useEffect(() => {
    if (!mapRef.current && coordinates.lat && coordinates.lng) {
      mapRef.current = initializeMap("map", coordinates, setCoordinates);
    }
  }, [coordinates, setCoordinates]);

  // Function to remove previous markers
  const removeMarkers = () => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
  };

  // Function to update the self-marker position without duplicating it
  const updateSelfMarker = () => {
    if (!selfMarkerRef.current && mapRef.current) {
      selfMarkerRef.current = createSelfMarker(
        "current-location-pin-map.png",
        [coordinates.lng, coordinates.lat],
        "#c31a26",
        "You are here",
        true,
        mapRef.current,
        () => {
          const lngLat = selfMarkerRef.current.getLngLat();
          setCoordinates({ lat: lngLat.lat, lng: lngLat.lng });
        }
      );
    } else if (selfMarkerRef.current) {
      selfMarkerRef.current.setLngLat([coordinates.lng, coordinates.lat]); // Move the marker without recreating
    }
  };

  // Update markers based on `places` and `type`
  useEffect(() => {
    if (mapRef.current) {
      removeMarkers(); // Remove existing markers before adding new ones
      markersRef.current = places
        .map((place, i) => {
          if (place.Type_of_Locality === type) {
            return createMarker(
              `${
                place.SVG_Icon
                  ? process.env.REACT_APP_BASE_URL + "assets/" + place.SVG_Icon
                  : (!place.Sub_Type_of_Locality
                      ? `location/`+place.Type_of_Locality
                      : place.Sub_Type_of_Locality
                    )
                      .replace(/ /g, "_")
                      .replace("(", "")
                      .replace(")", "") + ".svg"
              }`,
              [place.Longitude, place.Latitude],
              "#c31a26",
              place.Locality_Name,
              false,
              mapRef.current,
              setChildClicked,
              i,
              setSelectedPlace,
              place
            );
          }
          return null;
        })
        .filter((marker) => marker !== null);
    }
  }, [
    places,
    type,
    setChildClicked,
    coordinates,
    setCoordinates,
    setSelectedPlace,
  ]);
  stationData.forEach((place, i) => {
    createCircleMarker(
      "metro.png",
      [place.Station_Longitude, place.Station_Latitude],
      "#c31a26",
      `${place.Station_Code} - ${place.Station_Commercial_Name}`,
      false,
      mapRef.current,
      setChildClicked,
      i
    );
  });

  // Update the self-marker position whenever coordinates change
  useEffect(() => {
    updateSelfMarker();
  }, [coordinates]);

  const navigate = useNavigate();
  const handleViewMap = () => {
    navigate("/map");
  };

  // Handle input change
  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    // Filter suggestions based on input
    if (value) {
      const filteredSuggestions = places.filter(
        (place) =>
          place.Locality_Name &&
          place.Locality_Name.toLowerCase().includes(value.toLowerCase()) // Guard against undefined
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.Locality_Name); // Set input value to the selected suggestion
    setSelectedPlace(suggestion); // Set the selected place data
    setSuggestions([]); // Clear suggestions
  };

  // Handle reset button click
  const handleReset = () => {
    setInputValue(""); // Clear input value
    setSelectedPlace(null); // Clear selected place
    setSuggestions([]); // Clear suggestions
  };

  return (
    <MapContainer
      isDesktop={isDesktop}
      style={{
        height: isFullView ? "100vh" : "300px",
        width: isFullView ? "100vw" : "100%",
        position: "relative",
        padding: isFullView ? 0 : "2px",
        backgroundColor: isFullView ? "" : "#26B3D1",
        borderRadius: "5px",
      }}
    >
      {isFullView && (
        <div className="relative">
          {/* Back Arrow */}
          <div
            className="absolute top-2 left-2 z-50 bg-black bg-opacity-50 rounded-full flex items-center justify-center w-8 h-8 cursor-pointer"
            onClick={() => navigate(-1)} // Go back to the previous page
          >
            <ArrowBack className="text-white text-lg" />
          </div>

          {/* Search Form */}
          <form className="absolute top-2 left-14 right-4 z-40 flex flex-col">
            {/* Search Input */}
            <div className="relative w-full">
              {/* Search Icon */}
              <button
                className="absolute left-2 top-1/2 transform -translate-y-1/2 p-0.5 bg-transparent"
                type="button"
                onClick={(e) => e.preventDefault()} // Prevent form submission
              >
                <svg
                  width="17"
                  height="16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-labelledby="search"
                  className="w-4 h-4 text-gray-700"
                >
                  <path
                    d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                    stroke="currentColor"
                    strokeWidth="1.333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </button>

              <input
                className="rounded-full pl-10 pr-3 py-1.5 bg-white bg-opacity-85 border border-gray-300 focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-all duration-300 shadow-md w-full text-sm"
                placeholder="Search..."
                value={inputValue}
                onChange={handleInputChange}
                required
                type="text"
              />

              {/* Reset Button */}
              <button
                type="button" // Change to type button to prevent form submission
                className="absolute right-3 -translate-y-1/2 top-1/2 p-0.5"
                onClick={handleReset} // Call handleReset on click
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            {/* Suggestions List */}
            {suggestions.length > 0 && (
              <ul className="absolute top-7 left-0 right-0 bg-white bg-opacity-90 border border-gray-300 rounded-lg mt-1 z-50">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-blue-500 hover:text-black cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.Locality_Name}
                  </li>
                ))}
              </ul>
            )}
          </form>
        </div>
      )}

      <div id="map" style={{ width: "100%", height: "100%" }} />

      {!isFullView && (
        <button
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            padding: "2px",
            backgroundColor: "rgba(0, 144, 179, 1)",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={handleViewMap}
        >
          <img src="fullscreen.png" style={{ width: "35px" }} />
        </button>
      )}

      {isFullView && selectedPlace && (
        <Card
        style={{
          position: "absolute",
          bottom: "10vh",
          left: "50%", // Center horizontally
          transform: "translateX(-50%)", // Shift it back by 50% of its own width
          width: "90vw", // Card takes 90% of the viewport width
          backgroundColor: "#ffffff", // Updated to match the white background
          borderRadius: "20px", // Match the rounded corners from the second code
          // padding: "20px", // Added padding to mimic the second code's padding
          margin: "1vh",
          zIndex: 5000,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Added subtle shadow for depth
        }}
      >
        <Box display="flex" alignItems="start" style={{ width: "100%" }}>
          {/* Image on the left */}
          <CardMedia
            style={{
              width: "104px", // Fixed width as in the second code
              height: "104px", // Ensure the image height adapts to the content
              objectFit: "cover", // Use object-cover to ensure the image scales properly
              borderRadius: "12px", // Rounded corners similar to the second code
              marginLeft: "10px", // Add some space between the image and content
              marginTop: "10px", // Add some space at the top
              padding:5
            }}
            component="img" // Explicitly set it as an img component
            image={
              selectedPlace.Image
                ? `${
                    process.env.REACT_APP_BASE_URL +
                    "assets/" +
                    selectedPlace.Image
                  }`
                : "https://plus.unsplash.com/premium_photo-1686090448301-4c453ee74718?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            title={selectedPlace.Locality_Name}
          />
      
          {/* Content on the right */}
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            style={{
              // width: "200px", // Match the width of the content from the second code
              // paddingLeft: "5px",
              // paddingRight: "5px",
            }}
          >
            <CardContent style={{ flexGrow: 1, padding:5, marginTop: "10px" }}>
              <Typography
                gutterBottom
                variant="h6" // Changed to smaller font size as in the second code
                style={{
                  fontWeight: "bold",
                  color: "#000000", // Black color for text
                  fontSize: "16px", // Match the text size from the second code
                  marginBottom: "8px",
                  fontFamily: "Inter",
                }}
              >
                {selectedPlace.Locality_Name}
              </Typography>
              <Typography
                style={{
                  color: "#71717A", // Adapted to match the gray color from the second code
                  marginTop: "8px",
                  fontSize: "14px",
                  lineHeight: "1.4",
                  fontFamily: "Inter",
                }}
              >
                {selectedPlace.Type_of_Locality}{" "}
                {selectedPlace.Sub_Type_of_Locality
                  ? `- ${selectedPlace.Sub_Type_of_Locality}`
                  : ""}
              </Typography>
              <Typography
                style={{
                  color: "#65a30d", // Lime green to match the second code
                  marginTop: "6px",
                  fontWeight: "500", // Medium font weight for emphasis
                  fontSize: "14px",
                  fontFamily: "Inter",
                }}
              >
                Nearest Gates: {selectedPlace.Nearest_Gates}
              </Typography>
            </CardContent>
          </Box>
        </Box>
      
        {/* Directions button at the bottom, centered */}
        <Box
          display="flex"
          justifyContent="center"
          style={{
            width: "100%",
            // paddingTop: "10px",
            paddingBottom: "10px",
            backgroundColor: "white",
          }}
        >
          <Button
            endIcon={<DirectionsIcon style={{ fontSize: 23 }} />}
            color="primary"
            onClick={() => handleGetDirections(selectedPlace, username, nearestStation)}
            style={{
              marginTop:5,
              backgroundColor: "rgba(0, 145, 183, 1)",
              color: "white",
              borderRadius: "12px", // Rounded corners as in the second code
              textTransform: "none",
              paddingLeft: "10px",
              paddingRight: "10px",
              width: "90%", // Button takes 90% of the card width
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Inter",
            }}
          >
            Directions
          </Button>
        </Box>
      </Card>
            
      )}
    </MapContainer>
  );
}

export default FullMapView;
