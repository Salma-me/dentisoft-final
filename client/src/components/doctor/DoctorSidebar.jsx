import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, Stack } from "@mui/material";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import SickOutlinedIcon from "@mui/icons-material/SickOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import MyProfilePic from "../../assets/images/profile.png";

import { Item } from "../../utils/SiderbarItem";

const DoctorSidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const colorStyle = theme.palette.mode === "dark" ? "#868dfb" : "red";

  return (
    <Sidebar
      rootStyles={{
        ".ps-sidebar-container": {
          backgroundColor: `${colors.primary[400]}`,
          minHeight: "100vh",
        },
      }}
      collapsed={isCollapsed}
    >
      <Menu
        iconShape="square"
        rootStyles={{
          ".ps-menu-button:hover": {
            backgroundColor: "transparent !important",
            color: `${colorStyle} !important`,
          },
        }}
      >
        {/* LOGO AND MENU ICON */}
        <MenuItem
          onClick={() => setIsCollapsed(!isCollapsed)}
          icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
          style={{
            margin: "10px 0 20px 0",
            color: colors.grey[100],
          }}
        >
          {!isCollapsed && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                <MenuOutlinedIcon />
              </IconButton>
            </Box>
          )}
        </MenuItem>

        {!isCollapsed && (
          <Box
            mb="25px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection={"column"}
          >
            <img
              src={MyProfilePic}
              alt="MS"
              width={"100px"}
              style={{
                borderRadius: "50%",
              }}
            />
            <Box textAlign="center">
              <Typography
                variant="h4"
                color={colors.grey[100]}
                fontWeight="bold"
                sx={{ m: "10px 0 0 0" }}
              >
                Muhammad Sami
              </Typography>
              <Typography
                variant="h5"
                color={colors.greenAccent[500]}
                mb={"5%"}
              >
                Doctor
              </Typography>
            </Box>
          </Box>
        )}

        <Stack gap={2} paddingLeft={isCollapsed ? undefined : "5%"}>
          <NavLink to={"doctorDashboard"}>
            <Item
              title="Dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </NavLink>
          <NavLink to={"doctorAppointments"}>
            <Item
              title="Appointments"
              icon={<FactCheckOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </NavLink>
          <NavLink to={"doctorPatients"}>
            <Item
              title="Patients"
              icon={<SickOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </NavLink>
          <NavLink to="../Login">
            <Item
              title="Logout"
              icon={<LogoutIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </NavLink>
        </Stack>
      </Menu>
    </Sidebar>
  );
};

export default DoctorSidebar;
