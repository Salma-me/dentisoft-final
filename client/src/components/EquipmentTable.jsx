import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme";
import { mockDataPurchases } from "../data/mockData";

const EquipmentTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    {
      field: "purchaseID",
      headerName: "Purchase ID",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "purchaseDate",
      type: "Purchase Date",
      headerName: "Date",
      flex: 1,
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
    },
    {
      field: "quantityPurchased",
      headerName: "Quantity Purchased",
      flex: 1,
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
        <DataGrid rows={mockDataPurchases} columns={columns} />
      </Box>
    </Box>
  );
};

export default EquipmentTable;
