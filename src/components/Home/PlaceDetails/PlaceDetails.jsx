import React from "react";

import PhoneIcon from "@mui/icons-material/Phone";
import NearMeIcon from "@mui/icons-material/NearMe";
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

function PlaceDetails({ place, selected, refProp, cardcolor }) {
  if (selected)
    refProp?.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleGetDirections = () => {
    const latitude = place.Latitude;
    const longitude = place.Longitude;
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
      <Box display="flex" justifyContent="space-between">
        <CardMedia
          style={{
            width: "33.33%", // 1/3 of the card width
            margin: 15,
            borderRadius: 5,
            objectFit: "cover", // Ensures the image maintains its aspect ratio
          }}
          image={
            place.Image
              ? `${process.env.REACT_APP_BASE_URL + "assets/" + place.Image}`
              : "https://plus.unsplash.com/premium_photo-1686090448301-4c453ee74718?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          title={place.Locality_Name}
        />

        <CardContent style={{ flexGrow: 1, width: "66.67%" }}>
          {" "}
          {/* 2/3 of the card width */}
          <Typography
            gutterBottom
            variant="h5"
            style={{
              fontWeight: "bold",
              lineHeight: "24px",
              fontFamily: "Inter",
            }}
          >
            {place.Locality_Name}
          </Typography>
          <Box display="flex" alignItems="center">
            {place?.cuisine?.slice(0, 2).map((cuisine, index) => (
              <React.Fragment key={cuisine.name}>
                <Typography style={{ fontWeight: "semibold" }}>
                  {cuisine.name}
                </Typography>

                {index < place.cuisine.slice(0, 2).length - 1 && (
                  <Typography style={{ margin: "0 4px", fontWeight: "heavy" }}>
                    •
                  </Typography>
                )}
              </React.Fragment>
            ))}
          </Box>
          <Box display="flex" alignItems="center" justifyItems="center">
            <Typography
              gutterBottom
              variant="subtitle1"
              style={{
                color: "#808080",
                marginRight: "8px",
                lineHeight: "28px",
                fontFamily: "Inter",
              }}
            >
              {place.Type_of_Locality}{" "}
              {place.Sub_Type_of_Locality
                ? `- ${place.Sub_Type_of_Locality}`
                : ""}
            </Typography>
          </Box>
          <Box display="flex">
            <Typography
              gutterBottom
              variant="subtitle1"
              style={{ color: "green", marginTop: "-8px", fontFamily: "Inter" }}
            >
              Nearest Gates: {place.Nearest_Gates}
            </Typography>
          </Box>
          <CardActions>
            <Button
              endIcon={
                <NearMeIcon style={{ fontSize: 16, fontFamily: "Inter" }} />
              }
              color="primary"
              onClick={handleGetDirections}
              style={{
                backgroundColor: "rgba(0, 145, 183, 1)",
                color: "white",
                borderRadius: "5px",
                textTransform: "none",
                paddingLeft: "10px",
                paddingRight: "10px",
                margin: "-10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Inter",
                width: "100%",
              }}
            >
              Directions
            </Button>
          </CardActions>
        </CardContent>
      </Box>
    </Card>
  );
}

export default PlaceDetails;
