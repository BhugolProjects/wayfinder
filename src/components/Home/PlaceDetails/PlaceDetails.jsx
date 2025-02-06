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

  const handleCopyPhoneNumber = () => {
    navigator.clipboard
      .writeText(place.phone)
      .then(() => {
        console.log("Phone number copied to clipboard:", place.phone);
      })
      .catch((err) => {
        console.error("Failed to copy the phone number:", err);
      });
  };

  return (
    <Card
      style={{ backgroundColor: cardcolor, borderRadius: "5%", margin: "1vh" }}
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
          style={
            {
              // width: "200px", // Match the width of the content from the second code
              // paddingLeft: "5px",
              // paddingRight: "5px",
            }
          }
        >
          <CardContent style={{ flexGrow: 1, padding: 5 }}>
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
                color: "#65a30d", // Lime green to match the second code
                marginTop: "6px",
                fontWeight: "500", // Medium font weight for emphasis
                fontSize: "14px",
                fontFamily: "Inter",
              }}
            >
              Nearest Gates: {place.Nearest_Gates}
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
