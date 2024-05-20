import React from "react";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import useMediaQuery from "@mui/material/useMediaQuery";

const AddEquipmentForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const equipmentSchema = yup.object().shape({
    consultationCost: yup.string(),
    examinationCost: yup.string(),
    surgeryCost: yup.string(),
  });

  const initialValues = {
    consultationCost: "",
    examinationCost: "",
    surgeryCost: "",
  };

  const handleFormSubmit = (values) => {
    console.log(values);
    // Add logic to save the equipment item to the database or perform other actions
  };

  return (
    <Box m="20px">
      <Header title="Services" subtitle={"Set the Clinic Services Costs"} />

      <Formik
        initialValues={initialValues}
        validationSchema={equipmentSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                sx={{ gridColumn: "span 4" }}
                fullWidth
                variant="filled"
                label="Examination Cost"
                name="examinationCost"
                value={values.examinationCost}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.examinationCost && !!errors.examinationCost}
                helperText={touched.examinationCost && errors.examinationCost}
              />
              <TextField
                sx={{ gridColumn: "span 4" }}
                fullWidth
                variant="filled"
                label="Consultation Cost"
                name="consultationCost"
                value={values.consultationCost}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.consultationCost && !!errors.consultationCost}
                helperText={touched.consultationCost && errors.consultationCost}
              />
              <TextField
                sx={{ gridColumn: "span 4" }}
                fullWidth
                variant="filled"
                label="Surgery Cost"
                name="surgeryCost"
                value={values.surgeryCost}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.surgeryCost && !!errors.surgeryCost}
                helperText={touched.surgeryCost && errors.surgeryCost}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                size="large"
              >
                Confirm
              </Button>{" "}
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AddEquipmentForm;
