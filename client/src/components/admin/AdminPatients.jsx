import React, { useState } from "react";
import { Box, Stack } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { mockPatientData } from "../../data/mockData";
import Header from "../../components/Header";
import Card from "../PatientCardAdmin";

const AdminPatients = () => {
  //handleDelete Yet to be Handled XD
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 6; // Number of patients per page

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const [patients, setPatients] = React.useState(mockPatientData);

  const handleDelete = React.useCallback(
    (id) => {
      setTimeout(() => {
        setPatients((mockPatientData) =>
          mockPatientData.filter((patient) => patient.id !== id)
        );
      });
    },
    [setPatients]
  );
  const currentPatients = patients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  const paginate = (e, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 1800, behavior: "smooth" });
  };

  return (
    <Box m="30px">
      <Header title="Patients" />
      <Stack
        gap={4}
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {currentPatients.map((patient, index) => (
          <Card key={index} patient={patient} handleDelete={handleDelete} />
        ))}
      </Stack>{" "}
      <Stack mt={"100px"} alignItems={"center"}>
        {patients.length > patientsPerPage && (
          <Pagination
            color="standard"
            shape="rounded"
            defaultPage={1}
            count={Math.ceil(mockPatientData.length / patientsPerPage)}
            page={currentPage}
            onChange={paginate}
            size="large"
          />
        )}
      </Stack>
    </Box>
  );
};

export default AdminPatients;
