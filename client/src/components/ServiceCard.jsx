import React from "react";
import { Box, useTheme, Stack, Typography } from "@mui/material";
import { tokens } from "../theme";
import Image from "../assets/images/Dentist.jpeg"; // Import using relative path

const ServiceCard = ({ serviceName, serviceDescription }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorStyle =
    theme.palette.mode === "dark"
      ? `${colors.blueAccent[700]}`
      : "hsla(0,0%,82%,.3)";
  const shadowBorderColor = theme.palette.mode === "dark" ? "#868dfb" : "black";

  return (
    <Stack
      sx={{
        minWidth: "450px",
        maxWidth: "50vw",
        width: "40vw",
        height: "40vh",
        maxHeight: "90vh",
        backgroundColor: colorStyle,
        p: "3% 4% 4% 4%",
        boxShadow: `1px 1px 15px ${shadowBorderColor}`,
        borderRadius: "10px",
        ":hover": {
          transition: "all .3s ease-out",
          transform: "translateY(-10px)",
        },
        marginLeft: "3%",
        backgroundImage: `url(${Image})`,
      }}
    >
      <Box>
        <Stack display={"flex"} flexDirection={"column"} gap={3}>
          <Stack display={"flex"} flexDirection={"column"} gap={4}>
            <Typography variant="h2" fontWeight={"bold"}>
              {serviceName}
            </Typography>
            <Typography variant="h5" fontSize={"20px"}>
              {serviceDescription}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};

export default ServiceCard;
