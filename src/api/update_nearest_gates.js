const axios = require("axios");
const poisWithNearestGates = require("../components/Map/pois_with_nearest_gates.js"); // Import the data

// Directus API configuration
const DIRECTUS_URL = "https://adminwayfinder.bhugolapps.com";
const API_TOKEN = "-Q60A773RpSuFmHxki1AyHisBVzzOy30"; // direct us API token
const COLLECTION_NAME = "Places"; // Collection name

// Function to update Nearest_Gates for a specific ID
const updateNearestGates = async (id, newNearestGates) => {
  try {
    const url = `${DIRECTUS_URL}/items/${COLLECTION_NAME}/${id}`;
    const headers = {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    };

    const payload = {
      Nearest_Gates: newNearestGates, // Update Nearest_Gates field
    };

    console.log("Request URL:", url);
    console.log("Request Headers:", headers);
    console.log("Request Payload:", payload);

    const response = await axios.patch(url, payload, { headers });
    console.log(`Updated ID ${id}:`, response.data);
  } catch (error) {
    console.error(
      `Error updating ID ${id}:`,
      error.response?.data || error.message
    );
  }
};

// Prepare update data
const updateData = poisWithNearestGates.map((poi) => ({
  id: poi.id, // ID of the record to update
  Nearest_Gates: poi.Nearest_Gates, // New Nearest_Gates value
}));

// Example usage
// const updateData = [
//   {
//     id: "974", // ID of the record to update
//     Nearest_Gates: "E1, E2", // New Nearest_Gates value
//   },
// ];

// Run updates
const runUpdates = async () => {
  for (const item of updateData) {
    await updateNearestGates(item.id, item.Nearest_Gates);
  }
};

// Execute the updates
runUpdates();
