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
import { ArrowBack, Directions } from "@mui/icons-material";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import { MapContainer } from "./styles.js";
import "./Map.css";
import {
  addVisitor,
  addVisitorAnalysis,
  getStationData,
} from "../../api/index.js";
import { getDistance } from "geolib";
import stationGeoJSON from "./MML3_Alignment.geojson";
import stationBox from "./Station_Box.geojson";
import entryExitBoxes from "./Entry_Exits_Polygon.geojson";
import * as turf from "@turf/turf";
import debounce from "lodash.debounce";

// Marker creation functions (unchanged)
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
    className: "custom-popup",
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

const createSelfMarker = (
  icon,
  position,
  color,
  popupText,
  draggable,
  map,
  onDragEnd
) => {
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
  const marker = new tt.Marker({
    element: markerElement,
    anchor: "bottom",
    draggable,
  })
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
  const marker = new tt.Marker({
    element: markerElement,
    anchor: "bottom",
    draggable,
  })
    .setLngLat(position)
    .setPopup(popup)
    .addTo(map);

  marker.getElement().addEventListener("click", () => setChildClicked(i));
  return marker;
};

const initializeMap = (
  containerId,
  coordinates,
  setCoordinates,
  setLocationSource
) => {
  // Use fallback coordinates if initial coordinates are invalid
  const fallbackCoordinates = { lat: 19.0760, lng: 72.8777 }; // Mumbai center as default
  const initialCoords = coordinates.lat && coordinates.lng && !isNaN(coordinates.lat) && !isNaN(coordinates.lng)
    ? coordinates
    : fallbackCoordinates;

  const map = tt.map({
    key: process.env.REACT_APP_TOMTOM_API_KEY,
    container: containerId,
    center: [initialCoords.lng, initialCoords.lat],
    zoom: 14,
    stylesVisibility: { poi: false },
  });

  // Add NavigationControl for zoom/pan
  map.addControl(new tt.NavigationControl());

  // Add GeolocateControl with optimized settings
  const geolocateControl = new tt.GeolocateControl({
    positionOptions: { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 },
  });
  geolocateControl.on("geolocate", (e) => {
    const { latitude, longitude } = e.coords;
    setCoordinates({ lat: latitude, lng: longitude });
    setLocationSource("geolocation");
    map.flyTo({ center: [longitude, latitude], speed: 1.5, zoom: 15 }); // Smooth transition
  });
  map.addControl(geolocateControl);

  // Fetch geolocation with optimization and fallback
  navigator.geolocation.getCurrentPosition(
    ({ coords: { latitude, longitude } }) => {
      setCoordinates({ lat: latitude, lng: longitude });
      setLocationSource("geolocation");
      map.flyTo({ center: [longitude, latitude], speed: 1.5 }); // Smooth transition
    },
    (error) => {
      console.error("Geolocation error:", error);
      setCoordinates(fallbackCoordinates); // Fallback on error
      map.setCenter([fallbackCoordinates.lng, fallbackCoordinates.lat]);
    },
    { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 } // Optimize for speed
  );

  return map;
};

// Handle directions (unchanged)
const handleGetDirections = async (place, username, nearestStation) => {
  const { Latitude: latitude, Longitude: longitude, address } = place;
  await addVisitorAnalysis(place, username, nearestStation);
  const url =
    latitude && longitude
      ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
      : address
      ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
          address
        )}`
      : null;
  if (url) window.open(url, "_blank");
  else alert("Location information is not available.");
};

// Main Component (modified with device orientation permission)
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
  showLift,
  setShowLift,
}) {
  const [deviceHeading, setDeviceHeading] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [locationSource, setLocationSource] = useState("geolocation");
  const [stationData, setStationData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hasOrientationPermission, setHasOrientationPermission] = useState(false); // New state for permission
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const selfMarkerRef = useRef(null);
  const isDesktop = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const metroStations = {
    27: { name: "Aarey JVLR", gates: ["A1", "B1"], lifts: [] },
    26: { name: "SEEPZ", gates: ["A1", "A2", "B1", "B2"], lifts: ["A2"] },
    25: {
      name: "MIDC-Andheri",
      gates: ["A1", "A2", "B1", "B2"],
      lifts: ["B1"],
    },
    24: {
      name: "Marol Naka",
      gates: ["A1", "A2", "B1", "B2"],
      lifts: ["A1", "A2", "B1", "B2"],
    },
    23: { name: "CSMIA-T2", gates: ["A1", "A2", "B1"], lifts: ["A1"] },
    22: {
      name: "Sahar Road",
      gates: ["A1", "A2", "A3", "A4", "A5", "B1"],
      lifts: ["A1", "A3", "A5", "B1"],
    },
    21: { name: "CSMIA-T1", gates: ["A1", "B1"], lifts: ["A1", "B1"] },
    20: {
      name: "Santacruz Metro",
      gates: ["A1", "A2", "B1", "B2"],
      lifts: ["A1", "A2", "B1", "B2"],
    },
    19: {
      name: "Bandra Colony",
      gates: ["A1", "A2", "B1", "B2"],
      lifts: ["A2", "B1"],
    },
    18: {
      name: "Bandra-Kurla Complex",
      gates: ["A1", "A2", "A3", "A4", "A5", "B1"],
      lifts: ["A1", "A2", "A3", "A4", "B1"],
    },
  };

  const stationId = selectedPlace?.Station;
  const nearestGates = selectedPlace?.Nearest_Gates?.split(",").map((gate) =>
    gate.trim()
  );
  const hasLift =
    nearestGates &&
    metroStations[stationId]?.lifts.some((lift) => nearestGates.includes(lift));

  const debouncedAddBuffer = useRef(
    debounce((lng, lat) => addBufferCircle(lng, lat, 1000), 300)
  ).current;

  const addBufferCircle = (lng, lat, radius) => {
    if (!lat || isNaN(lat) || !lng || isNaN(lng)) return;
    const point = turf.point([lng, lat]);
    const buffer = turf.buffer(point, radius, { units: "meters" });

    const source = mapRef.current.getSource("self-marker-buffer");
    if (source) source.setData(buffer);
    else {
      mapRef.current.addSource("self-marker-buffer", {
        type: "geojson",
        data: buffer,
      });
      mapRef.current.addLayer({
        id: "self-marker-buffer-layer",
        type: "fill",
        source: "self-marker-buffer",
        paint: { "fill-color": "#c31a26", "fill-opacity": 0.2 },
      });
    }
  };

  // Request device orientation permission
  const requestOrientationPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      try {
        const permissionState = await DeviceOrientationEvent.requestPermission();
        if (permissionState === "granted") {
          setHasOrientationPermission(true);
          console.log("Orientation permission granted!");
        } else {
          console.log("Orientation permission denied.");
          alert("Permission denied. Please enable Motion & Orientation access in Settings.");
        }
      } catch (error) {
        console.error("Error requesting orientation permission:", error);
      }
    } else {
      // If the browser doesn't require explicit permission, assume it's available
      setHasOrientationPermission(true);
      console.log("No permission request needed for this browser.");
    }
  };

  useEffect(() => {
    if (!mapRef.current) {
      // Use fallback coordinates if initial coordinates are invalid or missing
      const fallbackCoordinates = { lat: 19.0760, lng: 72.8777 }; // Mumbai center
      const initialCoordinates = coordinates.lat && coordinates.lng && !isNaN(coordinates.lat) && !isNaN(coordinates.lng)
        ? coordinates
        : fallbackCoordinates;
  
      mapRef.current = initializeMap("map", initialCoordinates, setCoordinates, setLocationSource);
  
      mapRef.current.on("load", () => {
        // Predefine GeoJSON sources for faster layer addition
        mapRef.current.addSource("metro-line-source", { type: "geojson", data: stationGeoJSON });
        mapRef.current.addSource("station-box-source", { type: "geojson", data: stationBox });
        mapRef.current.addSource("entry-exit-source", { type: "geojson", data: entryExitBoxes });
  
        // Add layers using sources
        mapRef.current.addLayer({
          id: "metro-line",
          type: "line",
          source: "metro-line-source",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#02D8E9", "line-width": 5 },
        });
  
        mapRef.current.addLayer({
          id: "station-box",
          type: "fill",
          source: "station-box-source",
          paint: {
            "fill-color": [
              "case",
              ["==", ["get", "Name"], "Aarey Depot"],
              "rgb(178, 181, 186)",
              "rgb(38, 135, 129)",
            ],
            "fill-opacity": 0.9,
          },
        });
  
        mapRef.current.addLayer({
          id: "entry-exit-boxes",
          type: "fill",
          source: "entry-exit-source",
          paint: { "fill-color": "rgb(50, 91, 84)", "fill-opacity": 0.9 },
        });
  
        mapRef.current.addLayer({
          id: "entry-exit-labels",
          type: "symbol",
          source: "entry-exit-source",
          layout: {
            "text-field": ["get", "descriptio"],
            "text-size": 14,
            "text-anchor": "center",
            "text-offset": [0, 1.2],
            "text-allow-overlap": true,
            visibility: "none",
          },
          paint: {
            "text-color": "#FFFFFF",
            "text-halo-color": "#000000",
            "text-halo-width": 2,
          },
        });
  
        // Combine zoom event listeners into one for efficiency
        mapRef.current.on("zoom", () => {
          const zoom = mapRef.current.getZoom();
          mapRef.current.setLayoutProperty(
            "entry-exit-labels",
            "visibility",
            zoom > 16 ? "visible" : "none"
          );
          document.querySelectorAll(".marker-label").forEach((label) => {
            label.style.display = zoom > 16 ? "block" : "none";
          });
          document.querySelectorAll(".station-label").forEach((label) => {
            label.style.display = zoom > 12 ? "block" : "none";
          });
        });
  
        setMapLoaded(true);
      });
    }
  }, [setCoordinates, setLocationSource]); // Removed `coordinates` from deps to initialize only once

  // Update self marker and handle icon/popup updates (unchanged)
  const updateSelfMarker = () => {
    if (!coordinates || isNaN(coordinates.lat) || isNaN(coordinates.lng)) return;

    const { lng, lat } = coordinates;
    const isGeolocation = locationSource === "geolocation";
    const iconUrl = isGeolocation ? "arrow-icon.png" : "current-location-pin-map.png";

    if (!selfMarkerRef.current) {
      selfMarkerRef.current = createSelfMarker(
        iconUrl,
        [lng, lat],
        "#c31a26",
        isGeolocation ? "You are here" : "",
        true,
        mapRef.current,
        () => {
          const lngLat = selfMarkerRef.current.getLngLat();
          setCoordinates({ lat: lngLat.lat, lng: lngLat.lng });
          setLocationSource("drag");
          debouncedAddBuffer(lngLat.lng, lngLat.lat);
          setIsDragging(false);
        }
      );
      selfMarkerRef.current.on("dragstart", () => setIsDragging(true));
    } else {
      selfMarkerRef.current.setLngLat([lng, lat]);
      const markerIcon = selfMarkerRef.current.getElement().querySelector(".marker-circle-icon");
      if (markerIcon) {
        markerIcon.style.backgroundImage = `url(${iconUrl})`;
      }
      if (isGeolocation) {
        selfMarkerRef.current.setPopup(new tt.Popup({ offset: 30 }).setText("You are here"));
      } else {
        selfMarkerRef.current.setPopup(null);
      }
    }

    debouncedAddBuffer(lng, lat);
  };

  // Self marker update effect (unchanged except for dependency)
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !coordinates.lat || !coordinates.lng) return;
    updateSelfMarker();
  }, [coordinates, locationSource, mapLoaded]);

  // Request orientation permission on mount and handle orientation events
  useEffect(() => {
    // Request permission when the component mounts
    requestOrientationPermission();

    const handleDeviceOrientation = (event) => {
      if (!hasOrientationPermission) return; // Only proceed if permission is granted

      let heading;
      if (event.webkitCompassHeading !== undefined) {
        heading = event.webkitCompassHeading; // Safari-specific
      } else {
        heading = event.alpha !== null ? event.alpha : 0;
        if (event.beta !== null && event.gamma !== null) {
          heading = (360 - heading) % 360; // Adjust for standard compass heading
        }
      }
      setDeviceHeading(heading);
    };

    if (hasOrientationPermission) {
      window.addEventListener("deviceorientation", handleDeviceOrientation);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, [hasOrientationPermission]);

  // Rotation effect (unchanged)
  useEffect(() => {
    if (selfMarkerRef.current) {
      const markerIcon = selfMarkerRef.current.getElement().querySelector(".marker-circle-icon");
      if (markerIcon) {
        if (
          locationSource === "geolocation" &&
          deviceHeading !== null &&
          !isDragging
        ) {
          markerIcon.style.transform = `rotate(${deviceHeading + 45}deg)`;
        } else {
          markerIcon.style.transform = "rotate(45deg)";
        }
      }
    }
  }, [deviceHeading, locationSource, isDragging]);

  // Center on selected station effect (unchanged)
  useEffect(() => {
    if (centerThisStation && mapRef.current) {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      if (showLift) {
        fetch(entryExitBoxes)
          .then((response) => {
            if (!response.ok) throw new Error("Failed to fetch GeoJSON");
            return response.json();
          })
          .then((geojsonData) => {
            const liftGates = centerThisStation.Lift_Status.split(", ").map((gate) =>
              gate.trim()
            );
            const matchingFeatures = geojsonData.features.filter(
              (feature) =>
                feature.properties.id === centerThisStation.id &&
                liftGates.includes(feature.properties.descriptio)
            );
            matchingFeatures.forEach((feature) => {
              const coordinates = feature.geometry.coordinates[0][0];
              const uniqueCoordinates = coordinates.slice(0, -1);
              const topmostCoord = uniqueCoordinates.reduce((max, current) =>
                current[1] > max[1] ? current : max
              );
              const liftMarker = createMarker(
                `${process.env.PUBLIC_URL}/Lift_Status.svg`,
                [topmostCoord[0], topmostCoord[1]],
                "#c31a26",
                { Locality_Name: `Lift at ${feature.properties.descriptio}` },
                false,
                mapRef.current,
                setChildClicked,
                feature.properties.descriptio,
                setSelectedPlace,
                { Locality_Name: `` },
                setTopPlaceId
              );
              markersRef.current.push(liftMarker);
            });
          })
          .catch((error) => console.error("Error fetching GeoJSON:", error));
      }

      const lat = parseFloat(centerThisStation.Station_Latitude);
      const lng = parseFloat(centerThisStation.Station_Longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        mapRef.current.setCenter([lng, lat]);
        mapRef.current.zoomTo(17);
      }
    }

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [
    centerThisStation,
    setChildClicked,
    setSelectedPlace,
    setTopPlaceId,
    showLift,
    mapRef,
    entryExitBoxes,
  ]);

  // Fetch station data effect (unchanged)
  useEffect(() => {
    getStationData().then(setStationData);
  }, []);

  // Calculate nearest station effect (unchanged)
  useEffect(() => {
    if (!coordinates.lat || !coordinates.lng) return;

    const { lat, lng } = coordinates;
    const filteredStations = stationData
      .map((station) => ({
        ...station,
        distance: getDistance(
          { latitude: lat, longitude: lng },
          {
            latitude: station.Station_Latitude,
            longitude: station.Station_Longitude,
          }
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
      setSelectedStation(nearest.id);
    } else {
      setNearestStation(null);
      setStationsWithinRadius([]);
      setSelectedStation("no-station");
    }
  }, [
    coordinates,
    stationData,
    setNearestStation,
    setStationsWithinRadius,
    setSelectedStation,
  ]);

  // Update markers effect (unchanged)
  const removeMarkers = () => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
  };

  useEffect(() => {
    if (!mapRef.current || !coordinates.lat || !coordinates.lng) return;

    removeMarkers();
    markersRef.current = places
      .filter((place) => place.Type_of_Locality === type)
      .map((place, i) =>
        createMarker(
          `${place.SVG_Icon
            ? process.env.REACT_APP_BASE_URL + "assets/" + place.SVG_Icon
            : (!place.Sub_Type_of_Locality
              ? `location/` + place.Type_of_Locality
              : place.Sub_Type_of_Locality
            )
              .replace(/ /g, "_")
              .replace("(", "")
              .replace(")", "") + ".svg"
          }`,
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

    if (selfMarkerRef.current) {
      const { lng, lat } = coordinates;
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 13,
        speed: 2,
        curve: 1,
        easing: (t) => t,
      });
    }
  }, [
    places,
    type,
    stationData,
    setChildClicked,
    setSelectedPlace,
    setTopPlaceId,
    coordinates,
  ]);

  // Input and suggestion handlers (unchanged)
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

  // Render (modified to include permission button if needed)
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
                <svg
                  width="17"
                  height="16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-700"
                >
                  <path
                    d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                    stroke="currentColor"
                    strokeWidth="1.333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
              <button
                type="button"
                className="absolute right-3 -translate-y-1/2 top-1/2 p-0.5"
                onClick={handleReset}
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
                  />
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
          {/* Button to request permission if not granted */}
          {!hasOrientationPermission && (
            <Button
              onClick={requestOrientationPermission}
              style={{
                position: "absolute",
                top: "50px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 50,
                backgroundColor: "#212021",
                color: "white",
                borderRadius: "12px",
                padding: "5px 15px",
              }}
            >
              Enable Compass
            </Button>
          )}
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
                <Typography
                  gutterBottom
                  variant="h6"
                  style={{
                    fontWeight: "bold",
                    color: "#000000",
                    fontSize: "16px",
                    marginBottom: "8px",
                    fontFamily: "Inter",
                  }}
                >
                  {selectedPlace.Locality_Name}
                </Typography>
                <Typography
                  style={{
                    color: "#71717A",
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
                    color: "#2563eb",
                    marginTop: "6px",
                    fontWeight: "bold",
                    fontSize: "14px",
                    fontFamily: "Inter",
                    textTransform: "uppercase",
                    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)",
                    letterSpacing: "0.8px",
                  }}
                >
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
          <Box
            display="flex"
            justifyContent="center"
            style={{
              width: "100%",
              paddingBottom: "10px",
              backgroundColor: "white",
            }}
          >
            <Button
              endIcon={<Directions style={{ fontSize: 23 }} />}
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