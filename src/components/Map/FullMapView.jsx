import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  useMediaQuery,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import AccessibleIcon from "@mui/icons-material/Accessible";
import { ArrowBack, Directions } from "@mui/icons-material"; // Corrected import
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import { MapContainer } from "./styles.js";
import "./Map.css";
import { addVisitor, addVisitorAnalysis, getStationData } from "../../api/index.js";
import { getDistance } from "geolib";
import stationGeoJSON from "./MML3_Alignment.geojson";
import stationBox from "./Station_Box.geojson";
import entryExitBoxes from "./Entry_Exits_Polygon.geojson";
import * as turf from "@turf/turf";
import debounce from "lodash.debounce";

// Marker creation functions
const createMarker = (
  icon,
  position,
  color,
  placeDetails,
  draggable = false,
  map,
  setChildClicked,
  i,
  setSelectedPlace,
  place,
  setTopPlaceId
) => {
  const markerElement = document.createElement("div");
  markerElement.className = "marker";

  const markerContentElement = document.createElement("div");
  markerContentElement.style.backgroundColor = color;
  markerElement.appendChild(markerContentElement);

  const iconElement = document.createElement("div");
  iconElement.className = "marker-icon";
  iconElement.style.backgroundImage = `url(${icon})`;
  markerContentElement.appendChild(iconElement);

  const popupText = place.Bus_Stops
    ? `${place.Locality_Name}<br>Buses: ${place.Bus_Stops}`
    : place.Locality_Name;

  const labelElement = document.createElement("div");
  labelElement.className = "marker-label";
  labelElement.innerText = place.Locality_Name;
  labelElement.style.display = "none";
  markerElement.appendChild(labelElement);

  var popup = new tt.Popup({
    offset: 30,
    className: "custom-popup", // Custom class for styling
  }).setHTML(popupText);

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
    setSelectedPlace(place);
    setTopPlaceId(place.id);
  });

  return marker;
};

const createSelfMarker = (icon, position, color, popupText, draggable, map, onDragEnd) => {
  const markerElement = document.createElement("div");
  markerElement.className = "marker-circle";
  markerElement.style.zIndex = "100";

  const markerContentElement = document.createElement("div");
  markerContentElement.className = "marker-circle-content";
  markerContentElement.style.backgroundColor = color;
  markerElement.appendChild(markerContentElement);

  const iconElement = document.createElement("div");
  iconElement.className = "marker-circle-icon";
  iconElement.style.backgroundImage = `url(${icon})`;
  markerContentElement.appendChild(iconElement);

  const popup = new tt.Popup({ offset: 30 }).setText(popupText);
  const marker = new tt.Marker({ element: markerElement, anchor: "bottom", draggable })
    .setLngLat(position)
    .setPopup(popup)
    .addTo(map);

  marker.on("dragend", onDragEnd);
  return marker;
};

const createCircleMarker = (
  icon,
  position,
  color,
  popupText,
  draggable = false,
  map,
  setChildClicked,
  i
) => {
  if (!map) return null;

  const markerElement = document.createElement("div");
  Object.assign(markerElement.style, {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "white",
    borderColor: "green",
    borderWidth: "3px",
    borderStyle: "solid",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  });

  const iconElement = document.createElement("div");
  Object.assign(iconElement.style, {
    backgroundImage: `url(${icon})`,
    backgroundSize: "22px 22px",
    width: "22px",
    height: "22px",
    borderRadius: "50%",
  });
  markerElement.appendChild(iconElement);

  const labelElement = document.createElement("div");
  labelElement.className = "station-label";
  labelElement.innerText = popupText;
  labelElement.style.display = "none";
  markerElement.appendChild(labelElement);

  const popup = new tt.Popup({ offset: 30 }).setText(popupText);
  const marker = new tt.Marker({ element: markerElement, anchor: "bottom", draggable })
    .setLngLat(position)
    .setPopup(popup)
    .addTo(map);

  marker.getElement().addEventListener("click", () => setChildClicked(i));
  return marker;
};

// Map initialization
const initializeMap = (containerId, coordinates, setCoordinates, setLocationSource) => {
  const map = tt.map({
    key: process.env.REACT_APP_TOMTOM_API_KEY,
    container: containerId,
    center: [coordinates.lng, coordinates.lat],
    zoom: 14,
    stylesVisibility: { poi: false },
  });

  map.addControl(new tt.NavigationControl());
  const geolocateControl = new tt.GeolocateControl({ positionOptions: { enableHighAccuracy: false } });
  geolocateControl.on("geolocate", (e) => {
    const { latitude, longitude } = e.coords;
    setCoordinates({ lat: latitude, lng: longitude });
    setLocationSource("geolocation");
    map.setCenter([longitude, latitude]);
  });
  map.addControl(geolocateControl);

  navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
    setCoordinates({ lat: latitude, lng: longitude });
    setLocationSource("geolocation");
    map.setCenter([longitude, latitude]);
  });

  map.on("load", () => {
    map.addLayer({
      id: "metro-line",
      type: "line",
      source: { type: "geojson", data: stationGeoJSON },
      layout: { "line-join": "round", "line-cap": "round" },
      paint: { "line-color": "#02D8E9", "line-width": 5 },
    });

    map.addLayer({
      id: "station-box",
      type: "fill",
      source: { type: "geojson", data: stationBox },
      paint: {
        "fill-color": ["case", ["==", ["get", "Name"], "Aarey Depot"], "rgb(178, 181, 186)", "rgb(38, 135, 129)"],
        "fill-opacity": 0.9,
      },
    });

    map.addLayer({
      id: "entry-exit-boxes",
      type: "fill",
      source: { type: "geojson", data: entryExitBoxes },
      paint: { "fill-color": "rgb(50, 91, 84)", "fill-opacity": 0.9 },
    });

    map.addLayer({
      id: "entry-exit-labels",
      type: "symbol",
      source: { type: "geojson", data: entryExitBoxes },
      layout: {
        "text-field": ["get", "descriptio"],
        "text-size": 14,
        "text-anchor": "center",
        "text-offset": [0, 1.2],
        "text-allow-overlap": true,
        visibility: "none",
      },
      paint: { "text-color": "#FFFFFF", "text-halo-color": "#000000", "text-halo-width": 2 },
    });

    map.on("zoom", () => {
      const zoom = map.getZoom();
      map.setLayoutProperty("entry-exit-labels", "visibility", zoom > 16 ? "visible" : "none");
    });
  });

  map.on("zoom", () => {
    const zoom = map.getZoom();
    document.querySelectorAll(".marker-label").forEach((label) => {
      label.style.display = zoom > 16 ? "block" : "none";
    });
    document.querySelectorAll(".station-label").forEach((label) => {
      label.style.display = zoom > 12 ? "block" : "none";
    });
  });

  return map;
};

const handleGetDirections = async (place, username, nearestStation) => {
  const { Latitude: latitude, Longitude: longitude, address } = place;
  await addVisitorAnalysis(place, username, nearestStation);
  const url = latitude && longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
    : address
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
    : null;
  if (url) window.open(url, "_blank");
  else alert("Location information is not available.");
};

// Main Component
function FullMapView({
  topPlaceId,
  setTopPlaceId,
  setCoordinates,
  coordinates,
  places,
  setChildClicked,
  type,
  setType,
  isFullView = true,
  username,
  nearestStation,
  selectedStation,
  stationsWithinRadius,
  setNearestStation,
  setStationsWithinRadius,
  setSelectedStation,
  centerThisStation,
  setCenterThisStation,
}) {
  
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [locationSource, setLocationSource] = useState("geolocation");
  const [stationData, setStationData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const selfMarkerRef = useRef(null);
  const isDesktop = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const metroStations = {
    27: { name: "Aarey JVLR", gates: ["A1", "B1"], lifts: [] },
    26: { name: "SEEPZ", gates: ["A1", "A2", "B1", "B2"], lifts: ["A2"] },
    25: { name: "MIDC-Andheri", gates: ["A1", "A2", "B1", "B2"], lifts: ["B1"] },
    24: { name: "Marol Naka", gates: ["A1", "A2", "B1", "B2"], lifts: ["A1", "A2", "B1", "B2"] },
    23: { name: "CSMIA-T2", gates: ["A1", "A2", "B1"], lifts: ["A1"] },
    22: { name: "Sahar Road", gates: ["A1", "A2", "A3", "A4", "A5", "B1"], lifts: ["A1", "A3", "A5", "B1"] },
    21: { name: "CSMIA-T1", gates: ["A1", "B1"], lifts: ["A1", "B1"] },
    20: { name: "Santacruz Metro", gates: ["A1", "A2", "B1", "B2"], lifts: ["A1", "A2", "B1", "B2"] },
    19: { name: "Bandra Colony", gates: ["A1", "A2", "B1", "B2"], lifts: ["A2", "B1"] },
    18: { name: "Bandra-Kurla Complex", gates: ["A1", "A2", "A3", "A4", "A5", "B1"], lifts: ["A1", "A2", "A3", "A4", "B1"] },
  };

  const stationId = selectedPlace?.Station;
  const nearestGates = selectedPlace?.Nearest_Gates?.split(",").map((gate) => gate.trim());
  const hasLift = nearestGates && metroStations[stationId]?.lifts.some((lift) => nearestGates.includes(lift));

  const debouncedAddBuffer = useRef(debounce((lng, lat) => addBufferCircle(lng, lat, 1000), 300)).current;

  const addBufferCircle = (lng, lat, radius) => {
    if (!lat || isNaN(lat) || !lng || isNaN(lng)) return;
    const point = turf.point([lng, lat]);
    const buffer = turf.buffer(point, radius, { units: "meters" });

    const source = mapRef.current.getSource("self-marker-buffer");
    if (source) source.setData(buffer);
    else {
      mapRef.current.addSource("self-marker-buffer", { type: "geojson", data: buffer });
      mapRef.current.addLayer({
        id: "self-marker-buffer-layer",
        type: "fill",
        source: "self-marker-buffer",
        paint: { "fill-color": "#c31a26", "fill-opacity": 0.2 },
      });
    }
  };


  useEffect(() => {
    if (centerThisStation && mapRef.current) {
      const lat = parseFloat(centerThisStation.Station_Latitude);
      const lng = parseFloat(centerThisStation.Station_Longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        mapRef.current.flyTo({
          center: [lng, lat],
          zoom: 17,
          speed: 0.8,
        });
      }
    }
  }, [centerThisStation]);

  useEffect(() => {
    getStationData().then(setStationData);
  }, []);

  useEffect(() => {
    if (!coordinates.lat || !coordinates.lng) return;

    const { lat, lng } = coordinates;
    const filteredStations = stationData
      .map((station) => ({
        ...station,
        distance: getDistance(
          { latitude: lat, longitude: lng },
          { latitude: station.Station_Latitude, longitude: station.Station_Longitude }
        ),
      }))
      .filter((station) => station.distance <= 1000);

    if (filteredStations.length > 0) {
      const nearest = filteredStations.reduce((prev, curr) =>
        curr.distance < prev.distance ? curr : prev
      );
      addVisitor(nearest);
      setNearestStation(nearest);
      setStationsWithinRadius(filteredStations);
      setSelectedStation(nearest.Station_Code);
    } else {
      setNearestStation(null);
      setStationsWithinRadius([]);
      setSelectedStation("no-station");
    }
  }, [coordinates, stationData]);

  useEffect(() => {
    if (!mapRef.current && coordinates.lat && coordinates.lng) {
      mapRef.current = initializeMap("map", coordinates, setCoordinates, setLocationSource);
    }
  }, [coordinates]);

  const removeMarkers = () => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
  };

  const updateSelfMarker = () => {
    if (!coordinates || isNaN(coordinates.lat) || isNaN(coordinates.lng)) return;

    const { lng, lat } = coordinates;
    if (!selfMarkerRef.current) {
      selfMarkerRef.current = createSelfMarker(
        "current-location-pin-map.png",
        [lng, lat],
        "#c31a26",
        "You are here",
        true,
        mapRef.current,
        () => {
          const lngLat = selfMarkerRef.current.getLngLat();
          setCoordinates({ lat: lngLat.lat, lng: lngLat.lng });
          setLocationSource("drag");
          debouncedAddBuffer(lngLat.lng, lngLat.lat);
        }
      );
      debouncedAddBuffer(lng, lat);
    } else {
      selfMarkerRef.current.setLngLat([lng, lat]);
      debouncedAddBuffer(lng, lat);
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;

    removeMarkers();
    markersRef.current = places
      .filter((place) => place.Type_of_Locality === type)
      .map((place, i) =>
        createMarker(
          `${place.SVG_Icon ? process.env.REACT_APP_BASE_URL + "assets/" + place.SVG_Icon : (!place.Sub_Type_of_Locality ? `location/` + place.Type_of_Locality : place.Sub_Type_of_Locality).replace(/ /g, "_").replace("(", "").replace(")", "") + ".svg"}`,
          [place.Longitude, place.Latitude],
          "#c31a26",
          place,
          false,
          mapRef.current,
          setChildClicked,
          i,
          setSelectedPlace,
          place,
          setTopPlaceId
        )
      );

    stationData.forEach((place, i) => {
      if (!place.Station_Longitude || !place.Station_Latitude) return;
      createCircleMarker(
        "metro.png",
        [place.Station_Longitude, place.Station_Latitude],
        "#c31a26",
        `${place.Station_Name}`,
        false,
        mapRef.current,
        setChildClicked,
        i
      );
    });
  }, [places, type, stationData]);

  useEffect(() => {
    if (!mapRef.current) return;
    updateSelfMarker();
  
    if (selfMarkerRef.current) {
      selfMarkerRef.current.setPopup(
        locationSource === "geolocation"
          ? new tt.Popup({ offset: 30 }).setText("You are here")
          : null
      );
    }
  
    if (coordinates.lat && coordinates.lng) {
      mapRef.current.easeTo({
        center: [coordinates.lng, coordinates.lat],
        zoom: 13,
        speed: 0.8,
      });
    }
  }, [coordinates, locationSource]);
  

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    setSuggestions(
      value
        ? places.filter((place) =>
            place.Locality_Name?.toLowerCase().includes(value.toLowerCase())
          )
        : []
    );
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.Locality_Name);
    setSelectedPlace(suggestion);
    setSuggestions([]);
  };

  const handleReset = () => {
    setInputValue("");
    setSelectedPlace(null);
    setSuggestions([]);
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
          <div
            className="absolute top-2 left-2 z-50 bg-black bg-opacity-50 rounded-full flex items-center justify-center w-8 h-8 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ArrowBack className="text-white text-lg" />
          </div>
          <form className="absolute top-2 left-14 right-4 z-40 flex flex-col">
            <div className="relative w-full">
              <button
                className="absolute left-2 top-1/2 transform -translate-y-1/2 p-0.5 bg-transparent"
                type="button"
                onClick={(e) => e.preventDefault()}
              >
                <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-700">
                  <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
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
              <button type="button" className="absolute right-3 -translate-y-1/2 top-1/2 p-0.5" onClick={handleReset}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {suggestions.length > 0 && (
              <ul className="absolute top-7 left-0 right-0 bg-white bg-opacity-90 border border-gray-300 rounded-lg mt-1 z-50">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-blue-500 hover:text-black border border-gray-300 cursor-pointer"
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
          onClick={() => navigate("/map")}
        >
          <img src="fullscreen.png" style={{ width: "35px" }} />
        </button>
      )}
      {isFullView && selectedPlace && (
        <Card
          style={{
            position: "absolute",
            bottom: "7vh",
            left: "50%",
            transform: "translateX(-50%)",
            width: "90vw",
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            margin: "1vh",
            zIndex: 5000,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box display="flex" alignItems="start" style={{ width: "100%" }}>
            <CardMedia
              style={{
                width: "104px",
                height: "104px",
                objectFit: "cover",
                borderRadius: "12px",
                marginLeft: "10px",
                marginTop: "10px",
                padding: 5,
              }}
              component="img"
              image={
                selectedPlace.Image
                  ? `${process.env.REACT_APP_BASE_URL + "assets/" + selectedPlace.Image}`
                  : "https://plus.unsplash.com/premium_photo-1686090448301-4c453ee74718?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              title={selectedPlace.Locality_Name}
            />
            <Box display="flex" flexDirection="column" justifyContent="flex-start">
              <CardContent style={{ flexGrow: 1, padding: 5, marginTop: "10px" }}>
                <Typography gutterBottom variant="h6" style={{ fontWeight: "bold", color: "#000000", fontSize: "16px", marginBottom: "8px", fontFamily: "Inter" }}>
                  {selectedPlace.Locality_Name}
                </Typography>
                <Typography style={{ color: "#71717A", marginTop: "8px", fontSize: "14px", lineHeight: "1.4", fontFamily: "Inter" }}>
                  {selectedPlace.Type_of_Locality}{" "}
                  {selectedPlace.Sub_Type_of_Locality ? `- ${selectedPlace.Sub_Type_of_Locality}` : ""}
                </Typography>
                <Typography style={{ color: "#2563eb", marginTop: "6px", fontWeight: "bold", fontSize: "14px", fontFamily: "Inter", textTransform: "uppercase", textShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)", letterSpacing: "0.8px" }}>
                  Nearest Gates:{" "}
                  {nearestGates.map((gate, index) => (
                    <span key={index} style={{ display: "flex", alignItems: "center", gap: "1px" }}>
                      {gate}
                      {metroStations[stationId]?.lifts?.includes(gate) && (
                        <AccessibleIcon sx={{ fontSize: "16px", color: "rgb(232, 23, 23)" }} />
                      )}
                    </span>
                  ))}
                </Typography>
              </CardContent>
            </Box>
          </Box>
          <Box display="flex" justifyContent="center" style={{ width: "100%", paddingBottom: "10px", backgroundColor: "white" }}>
            <Button
              endIcon={<Directions style={{ fontSize: 23 }} />} // Corrected to Directions
              color="primary"
              onClick={() => handleGetDirections(selectedPlace, username, nearestStation)}
              style={{
                marginTop: 5,
                backgroundColor: "#212021",
                color: "white",
                borderRadius: "12px",
                textTransform: "none",
                paddingLeft: "10px",
                paddingRight: "10px",
                width: "90%",
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