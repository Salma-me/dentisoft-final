import React from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockAdminAppointments } from "../../data/mockData";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import Header from "../../components/Header";
import AppointmentPopUp from "../AppointmentPopUp";

const AdminAppointments = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = React.useState(mockAdminAppointments);

  const deleteUser = React.useCallback(
    (id) => {
      setTimeout(() => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      });
    },
    [setRows]
  );
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "patientName",
      headerName: "Patient Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "gender",
      headerName: "Gender",
    },
    {
      field: "date",
      type: "Date",
      headerName: "Date",
      flex: 1,
    },
    {
      field: "time",
      type: "Time",
      headerName: "Time",
      flex: 1,
    },
    {
      field: "mobile",
      type: "Number",
      headerName: "Mobile Number",
      flex: 1,
    },
    {
      field: "doctorName",
      type: "Name",
      headerName: "Doctor Name",
      flex: 1,
    },
    {
      field: "injuryCondition",
      headerName: "Condition/Reason",
      flex: 1,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      getActions: (params) => [
        <GridActionsCellItem
          icon={
            <IconButton aria-label="delete" color="error" size="large">
              <CancelIcon />
            </IconButton>
          }
          label="Delete"
          onClick={() => deleteUser(params.id)}
        />,
        <AppointmentPopUp />,
      ],
    },
  ];

  return (
    <Box m="20px">
      <Header title="Appointments" subtitle={"Manage Appointments"} />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .css-78c6dr-MuiToolbar-root-MuiTablePagination-toolbar": {
            minWidth: "300px",
            overflow: "hidden",
          },
        }}
      >
        <DataGrid checkboxSelection rows={rows} columns={columns} />
      </Box>
    </Box>
  );
};

export default AdminAppointments;
