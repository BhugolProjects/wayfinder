const fs = require("fs");
const turf = require("@turf/turf");

// Load POIs and gates data
const poisData = JSON.parse(fs.readFileSync("POI.geojson")); // Replace with your POIs file
const gatesGeoJSON = JSON.parse(fs.readFileSync("Entry_Exits_Polygon.geojson")); // Replace with your gates file

// Extract the `features` array from the GeoJSON object
const pois = poisData.features;

// Function to calculate the centroid of a polygon
const calculateCentroid = (coordinates) => {
  const numPoints = coordinates.length;
  let centroidX = 0;
  let centroidY = 0;

  for (const [x, y] of coordinates) {
    centroidX += x;
    centroidY += y;
  }

  centroidX /= numPoints;
  centroidY /= numPoints;

  return [centroidX, centroidY];
};

// Function to find the nearest gate(s)
const findNearestGates = (poiCoordinates, gatesGeoJSON, maxGates = 1) => {
  if (!poiCoordinates || !gatesGeoJSON) return null;

  const poiPoint = turf.point([poiCoordinates.lng, poiCoordinates.lat]);
  const gatesWithDistances = [];

  gatesGeoJSON.features.forEach((gate) => {
    // Extract the polygon coordinates
    const polygonCoordinates = gate.geometry.coordinates[0][0]; // Assuming MultiPolygon
    const centroid = calculateCentroid(polygonCoordinates);

    // Create a Turf point for the gate's centroid
    const gatePoint = turf.point(centroid);

    // Calculate the distance between the POI and the gate's centroid
    const distance = turf.distance(poiPoint, gatePoint, {
      units: "kilometers",
    });

    gatesWithDistances.push({ gate, distance });
  });

  // Sort gates by distance and return the nearest `maxGates`
  gatesWithDistances.sort((a, b) => a.distance - b.distance);
  return gatesWithDistances.slice(0, maxGates).map((item) => item.gate);
};

// Precompute nearest gates for all POIs
const poisWithNearestGates = pois.map((poi) => {
  // Extract coordinates from the POI's geometry
  const poiCoordinates = {
    lng: poi.geometry.coordinates[0], // Longitude
    lat: poi.geometry.coordinates[1], // Latitude
  };

  // Find the nearest gates
  const nearestGates = findNearestGates(poiCoordinates, gatesGeoJSON, 1); // Change `1` to `n` for multiple gates

  // Convert the nearest gates to a string (if maxGates is 1)
  const nearestGateString =
    nearestGates.length > 0 ? nearestGates[0].properties.descriptio : null;

  return {
    ...poi.properties, // Include all properties of the POI
    Nearest_Gates: nearestGateString,
  };
});

// Save the updated POIs with nearest gates
fs.writeFileSync(
  "pois_with_nearest_gates.json",
  JSON.stringify(poisWithNearestGates, null, 2)
);
console.log("Precomputed nearest gates for all POIs!");
