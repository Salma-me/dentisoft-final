import { mockDoctorData } from "../../data/mockData";
import React, { useState } from "react";
import { Box, Stack } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Header from "../../components/Header";
import DoctorCard from "../DoctorCard";

const AdminDoctors = () => {
  //handleDelete Yet to be Handled XD
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 4; // Number of items per page

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const [doctors, setDoctors] = useState(mockDoctorData);

  const handleDelete = React.useCallback(
    (id) => {
      setTimeout(() => {
        setDoctors((currentDoctors) =>
          currentDoctors.filter((doctor) => doctor.ID !== id)
        );
      });
    },
    [setDoctors]
  );

  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const paginate = (e, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 1800, behavior: "smooth" });
  };

  return (
    <Box m="30px">
      <Header title="Doctors" subtitle={"Manage The Clinic Doctors"} />
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
        {currentDoctors.map((doctor, index) => (
          <DoctorCard key={index} doctor={doctor} handleDelete={handleDelete} />
        ))}
      </Stack>{" "}
      <Stack mt={"100px"} alignItems={"center"}>
        {doctors.length > doctorsPerPage && (
          <Pagination
            color="standard"
            shape="rounded"
            defaultPage={1}
            count={Math.ceil(mockDoctorData.length / doctorsPerPage)}
            page={currentPage}
            onChange={paginate}
            size="large"
          />
        )}
      </Stack>
    </Box>
  );
};

export default AdminDoctors;
