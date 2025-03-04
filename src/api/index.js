import axios from "axios";

const RADIUS_OF_EARTH_IN_METERS = 6371000; // Earth's approximate radius in meters

// Function to convert degrees to radians
function toRadians(deg) {
  return deg * (Math.PI / 180);
}

// Function to calculate the Haversine distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const latRad1 = toRadians(lat1);
  const latRad2 = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(latRad1) * Math.cos(latRad2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return RADIUS_OF_EARTH_IN_METERS * c;
}

export async function getPlacesData(type, sw, ne, coordinates) {
  try {
    if (!coordinates?.lat || !coordinates?.lng) {
      throw new Error("Coordinates (lat, lng) are required.");
    }
    // console.log("url" , process.env.REACT_APP_BASE_URL)

    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}items/Places?limit=1000000`
    );
    const data = response.data?.data || [];

    const filteredData = data.filter((place) => {
      const distance = calculateDistance(
        coordinates.lat,
        coordinates.lng,
        place.Latitude,
        place.Longitude
      );
      return distance <= 1000; // Adjust radius if needed
    });

    return filteredData;
  } catch (error) {
    console.error("Error fetching places data:", error.message || error);
    return [];
  }
}

export async function getStationData() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}items/Stations?limit=1000000&sort=Display_Order`
    );
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching station data:", error.message || error);
    return [];
  }
}

export async function addVisitor(station, username) {
  // console.log("station", station , "username", username)
  try {
    if (!username || !station?.id) {
      throw new Error("Username and Station ID are required.");
    }

    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}items/Visitor_Analysis/`,
      {
        Username: username,
        Station: station.id,
      }
    );

    return response.data?.data;
  } catch (error) {
    console.error("Error adding visitor:", error.message || error);
  }
}

export async function addVisitorAnalysis(place, username, station) {
  try {
    if (!username || !station?.id || !place?.id) {
      throw new Error("Username, Station ID, and Place ID are required.");
    }

    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}items/Visitor_Analysis/`,
      {
        Username: username,
        Station: station.id,
        Place: place.id,
      }
    );

    return response.data?.data;
  } catch (error) {
    console.error("Error adding visitor analysis:", error.message || error);
  }
}
