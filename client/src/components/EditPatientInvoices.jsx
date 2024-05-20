import { Box, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme";
import { mockDataInvoices } from "../data/mockData";

const EditPatientInvoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "invoiceID", headerName: "Billing ID" },
    {
      field: "date",
      type: "Date",
      headerName: "Date",
      flex: 1,
    },
    {
      field: "cost",
      headerName: "Total Cost",
      flex: 1,
    },

    {
      field: "doctorName",
      headerName: "Doctor Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "discount",
      headerName: "Insurance Coverage",
      flex: 1,
    },
    {
      field: "total",
      headerName: "Total After Insurance",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          sx={{
            backgroundColor: params.row.status === "Paid" ? "green" : "red",
          }}
          onClick={() => {
            params.row.status === "Paid"
              ? (params.row.status = "UnPaid")
              : (params.row.status = "Paid");
          }}
        >
          {params.row.status}
        </Button>
      ),
    },
  ];

  return (
    <Box m="20px">
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
        <DataGrid rows={mockDataInvoices} columns={columns} />
      </Box>
    </Box>
  );
};

export default EditPatientInvoices;
