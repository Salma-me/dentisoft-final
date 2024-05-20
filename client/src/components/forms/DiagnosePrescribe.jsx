import React from "react";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";

const DiagnosePrescribe = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const diagnosisSchema = yup.object().shape({
    affectedArea: yup.string().required("Affected area is required"),
    diagnosis: yup.string().required("Diagnosis is required"),
    description: yup.string().required("Description is required"),
    medications: yup.string().required("Medication is required"),
  });

  const initialValues = {
    affectedArea: "",
    diagnosis: "",
    description: "",
    medications: "",
  };

  const handleFormSubmit = (values) => {
    console.log(values);
    // Add logic to save the diagnosis data
  };

  return (
    <Box m="20px">
      <Formik
        initialValues={initialValues}
        validationSchema={diagnosisSchema}
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
                fullWidth
                select
                variant="filled"
                label="Affected Area"
                name="affectedArea"
                value={values.affectedArea}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.affectedArea && !!errors.affectedArea}
                helperText={touched.affectedArea && errors.affectedArea}
                sx={{ gridColumn: "span 4" }}
              >
                <MenuItem value="Maxillary Anterior">
                  Maxillary Anterior
                </MenuItem>
                <MenuItem value="Mandibular Molars">Mandibular Molars</MenuItem>
                {/* Add more affected areas as needed */}
              </TextField>
              <TextField
                fullWidth
                select
                variant="filled"
                label="Diagnosis"
                name="diagnosis"
                value={values.diagnosis}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.diagnosis && !!errors.diagnosis}
                helperText={touched.diagnosis && errors.diagnosis}
                sx={{ gridColumn: "span 4" }}
              >
                <MenuItem value="Dental Caries">
                  Dental Caries (Cavity)
                </MenuItem>
                <MenuItem value="Gingivitis">Gingivitis</MenuItem>
                {/* Add more diagnosis options as needed */}
              </TextField>
              <TextField
                fullWidth
                variant="filled"
                multiline
                rows={4}
                label="Description"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                placeholder="Write Drugs and separate them by a comma, for example:
                Penicillin,Ibuprofen,Amoxicillin... and so on"
                multiline
                rows={4}
                label="Medications"
                name="medications"
                value={values.medications}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.medications && !!errors.medications}
                helperText={touched.medications && errors.medications}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                size="large"
              >
                Save Diagnosis
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default DiagnosePrescribe;
