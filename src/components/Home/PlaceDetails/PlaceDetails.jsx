import React from "react";

import PhoneIcon from "@mui/icons-material/Phone";
import DirectionsIcon from "@mui/icons-material/Directions";
import LanguageIcon from "@mui/icons-material/Language";

import Rating from "@mui/lab/Rating";
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";
import AccessibleIcon from "@mui/icons-material/Accessible";
import { addVisitorAnalysis } from "../../../api";

function PlaceDetails({
  place,
  selected,
  refProp,
  cardcolor,
  nearestStation,
  selectedStation,
  username,
}) {
  const metroStations = {
    27: {
      name: "Aarey JVLR",
      gates: ["A1", "B1"],
      lifts: [],
    },
    26: {
      name: "SEEPZ",
      gates: ["A1", "A2", "B1", "B2"],
      lifts: ["A2"],
    },
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
    23: {
      name: "CSMIA-T2",
      gates: ["A1", "A2", "B1"],
      lifts: ["A1"],
    },
    22: {
      name: "Sahar Road",
      gates: ["A1", "A2", "A3", "A4", "A5", "B1"],
      lifts: ["A1", "A3", "A5", "B1"],
    },
    21: {
      name: "CSMIA-T1",
      gates: ["A1", "B1"],
      lifts: ["A1", "B1"],
    },
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

  // Get station ID from selectedPlace (POI) and gate to display weather the nearest gate has lift or not
  const stationId = place?.Station;
  const nearestGates = place?.Nearest_Gates
    ? place.Nearest_Gates.split(",").map((gate) => gate.trim())
    : []; // Ensure it's always an array

  if (selected)
    refProp?.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleGetDirections = async (place, username, nearestStation) => {
    const latitude = place.Latitude;
    const longitude = place.Longitude;
    await addVisitorAnalysis(place, username, nearestStation);
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

  return (
    <Card
      style={{
        backgroundColor: cardcolor,
        borderRadius: "20px",
        marginTop: "15px",
        padding: "5px 0",
        border: "2px solid rgba(95, 197, 255, 1)",
        boxShadow: "0px 2px 10px 0px rgba(35, 35, 35, 0.1)",
      }}
    >
      <Box
        display="flex"
        style={{ width: "100%" }}
        flexDirection="row"
        alignItems="center"
      >
        {/* Image on the left */}
        <CardMedia
          style={{
            width: "104px", // Fixed width as in the second code
            height: "104px", // Ensure the image height adapts to the content
            objectFit: "cover", // Use object-cover to ensure the image scales properly
            borderRadius: "12px", // Rounded corners similar to the second code
            marginLeft: "10px", // Add some space between the image and content
            marginTop: "10px", // Add some space at the top
            padding: 5,
          }}
          component="img" // Explicitly set it as an img component
          image={
            place.Image
              ? `${process.env.REACT_APP_BASE_URL + "assets/" + place.Image}`
              : "https://plus.unsplash.com/premium_photo-1686090448301-4c453ee74718?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          title={place.Locality_Name}
        />

        {/* Content on the right */}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          style={{
            // width: "200px", // Match the width of the content from the second code
            paddingLeft: "10px",
            // paddingRight: "5px",
          }}
        >
          <CardContent style={{ flexGrow: 1, padding: 5 }}>
            <Typography
              gutterBottom
              variant="h6" // Changed to smaller font size as in the second code
              style={{
                fontWeight: "bold",
                color: "#000000", // Black color for text
                fontSize: "15px", // Match the text size from the second code
                marginBottom: "8px",
                fontFamily: "Inter",
              }}
            >
              {place.Locality_Name}
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
              {place.Type_of_Locality}{" "}
              {place.Sub_Type_of_Locality
                ? `- ${place.Sub_Type_of_Locality}`
                : ""}
            </Typography>
            <Typography
              style={{
                color: "#2563eb", // Darker shade of lime green for better contrast
                marginTop: "6px",
                fontWeight: "bold", // Bold for stronger emphasis
                fontSize: "14px", // Slightly larger font size
                fontFamily: "Inter",
                textTransform: "uppercase", // Uppercase for better visibility
                textShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)", // Subtle shadow for better readability
                letterSpacing: "0.8px", // Slight letter spacing for clarity
              }}
            >
              Nearest Gates:{" "}
              {nearestGates.length > 0
                ? nearestGates.map((gate, index) => (
                    <span
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1px",
                      }}
                    >
                      {gate}
                      {metroStations[stationId]?.lifts?.includes(gate) && (
                        <AccessibleIcon
                          sx={{ fontSize: "16px", color: "rgb(232, 23, 23)" }}
                        />
                      )}
                    </span>
                  ))
                : "No nearest gates available"}
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
          // backgroundColor: cardcolor,
        }}
      >
        <Button
          endIcon={<DirectionsIcon style={{ fontSize: 23 }} />}
          color="primary"
          onClick={() => handleGetDirections(place, username, nearestStation)}
          style={{
            marginTop: 5,
            backgroundColor: "#212021",
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
  );
}

export default PlaceDetails;
