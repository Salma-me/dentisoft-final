import React from "react";
import { Box, useTheme, Stack, Typography, Button } from "@mui/material";
import { tokens } from "../theme";
import NumbersIcon from "@mui/icons-material/Numbers";
import FactoryIcon from "@mui/icons-material/Factory";
import GroupsIcon from "@mui/icons-material/Groups";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import DeleteIcon from "@mui/icons-material/Delete";
import EditItemPopUp from "./EditItemPopUp";
import RemoveIcon from "@mui/icons-material/Remove";
import PurchaseItemPopUp from "./PurchaseItemPopUp";
import ItemHistoryPopUp from "./ItemHistoryPopUp";

const ItemCard = ({ item, handleDelete }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorStyle =
    theme.palette.mode === "dark"
      ? `${colors.blueAccent[700]}`
      : "hsla(0,0%,82%,.3)";
  const shadowBorderColor = theme.palette.mode === "dark" ? "#868dfb" : "black";

  return (
    <Box
      sx={{
        minWidth: "450px",
        maxWidth: "30vw",
        width: "25vw",
        height: "80vh",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: colorStyle,
        p: "3% 4% 4% 4%",
        boxShadow: `1px 1px 15px ${shadowBorderColor}`,
        borderRadius: "10px",
        ":hover": {
          transition: "all .3s ease-out",
          transform: "translateY(-10px)",
        },
      }}
    >
      <Stack direction="column" alignItems="center" spacing={2} mb={4}>
        <img
          src={require(`../assets/items/${item.Image}`)}
          alt="Profile"
          style={{
            width: "25rem",
            height: "30vh",
            boxShadow: `1px 1px 20px ${shadowBorderColor}`,
            borderRadius: "10px",
          }}
        />
      </Stack>
      <Stack spacing={2} mb={4}>
        <Typography variant="h4" fontWeight={"bold"}>
          {item.ItemName}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            display: "flex",
            alignItems: "start",
            height: "6vh",
          }}
        >
          {item.Description}
        </Typography>
        <Stack flexDirection={"row"} gap={2}>
          <NumbersIcon />
          <Typography variant="h4"> {item.ItemID}</Typography>
        </Stack>
        <Stack flexDirection={"row"} gap={2}>
          <WarehouseIcon />
          <Typography sx={{ display: "flex", alignItems: "start" }}>
            Quantity: {item.ItemQuantity}
          </Typography>
        </Stack>
      </Stack>
      <Stack spacing={2} mb={4}>
        <Stack flexDirection={"row"} gap={2}>
          <LocalAtmIcon />
          <Typography>Cost: {item.ItemPrice}</Typography>
        </Stack>
        <Stack flexDirection={"row"} gap={2}>
          <GroupsIcon />
          <Typography sx={{ display: "flex", alignItems: "start" }}>
            Supplier: {item.Supplier}
          </Typography>
        </Stack>
        <Stack flexDirection={"row"} gap={2}>
          <FactoryIcon /> Manufacturer: {item.Manufacturer}
          <Typography
            sx={{ display: "flex", alignItems: "start" }}
          ></Typography>
        </Stack>
      </Stack>
      <Stack mt={"-3%"}>
        <Stack display={"flex"} flexDirection={"row"} gap={2}>
          <Button
            startIcon={<DeleteIcon />}
            color="error"
            variant="contained"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50px",
              pr: "2%",
            }}
            onClick={() => {
              handleDelete(item.ItemID);
            }}
          ></Button>
          <Button
            startIcon={<RemoveIcon />}
            color="error"
            variant="contained"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50px",
              pr: "2%",
            }}
            onClick={() => {
              //Quantity--
            }}
          ></Button>
          <PurchaseItemPopUp />
          <EditItemPopUp />
          <ItemHistoryPopUp />
        </Stack>
      </Stack>
    </Box>
  );
};

export default ItemCard;
