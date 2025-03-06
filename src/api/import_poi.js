const axios = require("axios");

// Directus API configuration
const DIRECTUS_URL = "https://adminwayfinder.bhugolapps.com/"; // Replace with your Directus instance URL
const API_TOKEN = "-Q60A773RpSuFmHxki1AyHisBVzzOy30"; // Replace with your Directus API token
const COLLECTION_NAME = "Test_Places"; // Replace with your collection name

// Your JSON data
const poiData = [
  {
    id: "974",
    Locality_N: "Nana Chowk",
    Type_of_Lo: "Commercial",
    status: "published",
    Sub_Type_o: null,
    sort: null,
    Latitude: 18.9615719,
    Longitude: 72.81318737,
    Station_St: "Grant Road Metro",
    Nearest_Gates: ["E1"],
  },
  {
    id: "1275",
    Locality_N: "Hallamrk Business Plazza",
    Type_of_Lo: "Commercial",
    status: "published",
    Sub_Type_o: null,
    sort: null,
    Latitude: 19.06048873,
    Longitude: 72.85191833,
    Station_St: "Bandra Colony",
    Nearest_Gates: ["B1"],
  },
];

// Function to import data
const importData = async () => {
  try {
    console.log("inside try");
    for (const poi of poiData) {
      const response = await axios.post(
        `${DIRECTUS_URL}/items/${COLLECTION_NAME}`,
        poi,
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`Imported POI: ${poi.Locality_N}`, response.data);
    }
  } catch (error) {
    console.error(
      "Error importing data:",
      error.response?.data || error.message
    );
  }
};

// Run the import
importData();
