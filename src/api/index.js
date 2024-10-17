import axios from 'axios';

const RADIUS_OF_EARTH_IN_METERS = 6371000; // approximate radius of the Earth in meters

export async function getPlacesData(type, sw, ne, coordinates) {
  try {
    // coordinates.lat = 18.91467177;
    // coordinates.lng = 72.817912;
    // const data = axios.get(process.env.BASE_URL + `/Places?limit=1000000`);
    // const response = await axios.get(`https://bytecodx.club/items/Places?limit=1000000`);
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}items/Places?limit=1000000`);
    const  data = response.data.data;
    // console.log(`Data:`, data);
    // const data = placeData;
    const filteredData = data.filter((place) => {
      const lat1 = coordinates.lat;
      const lon1 = coordinates.lng;
      const lat2 = place.Latitude;
      const lon2 = place.Longitude;

      const dLat = toRadians(lat2 - lat1);
      const dLon = toRadians(lon2 - lon1);
      const latRad1 = toRadians(lat1);
      const latRad2 = toRadians(lat2);

      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(latRad1) * Math.cos(latRad2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = RADIUS_OF_EARTH_IN_METERS * c;
      // console.log(`Distance:`, c, a, distance, lat1, lon1, lat2, lon2);

      return distance <= 500 || distance <= 1000; // adjust the radius here
    });
    // console.log(`Filtered places:`, filteredData);

    return filteredData;
  } catch (error) {
    console.log(error);
  }
}

function toRadians(deg) {
  return deg * (Math.PI / 180);
}

export async function getStationData() {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}items/Stations?limit=1000000`);
    const  data = response.data.data;
    // const data = stationData;
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function addVisitor(station,username) {
  try {
    // Increment the visitor count
    
    const stationData = await axios.get(`${process.env.REACT_APP_BASE_URL}items/Stations/${station.id}`);
    const Visitors_Count = parseInt(stationData.data.data.Visitors_Count) + 1;

    // Make a PUT request to update only the Visitors_Count for the specific station
    if(username != null){
    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}items/Visitor_Analysis/`, {
      "Username": username,
      "Station": station.id,
    });
    
    // Return the updated station data
    return response.data.data;
  }
  } catch (error) {
    console.log(error);
  }
}

export async function addVisitorAnalysis(place,username,station) {
  try {
    // Make a PUT request to update only the Visitors_Count for the specific station
    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}items/Visitor_Analysis/`, {
      "Username": username,
      "Station": station.id,
      "Place": place.id
    });

    // Return the updated station data
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
}
