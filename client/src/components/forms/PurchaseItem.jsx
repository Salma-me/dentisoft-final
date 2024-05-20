import React from "react";
import { Box, Button, TextField } from "@mui/material";

import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";

const PurchaseItem = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const equipmentSchema = yup.object().shape({
    quantity: yup.number().positive("Quantity must be a positive number"),
    purchaseDate: yup.date(),
    cost: yup.number().positive("Cost must be a positive number"),
  });

  const initialValues = {
    quantity: "",
    purchaseDate: "",
    cost: "",
  };

  const handleFormSubmit = (values) => {
    console.log(values);
    // Add logic to save the equipment item to the database or perform other actions
  };

  return (
    <Box m="20px">
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
                sx={{ gridColumn: "span 2" }}
                fullWidth
                variant="filled"
                label="Quantity"
                type="number"
                name="quantity"
                value={values.quantity}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.quantity && !!errors.quantity}
                helperText={touched.quantity && errors.quantity}
              />
              <TextField
                sx={{ gridColumn: "span 2" }}
                fullWidth
                variant="filled"
                label="Cost"
                type="number"
                name="cost"
                value={values.cost}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.cost && !!errors.cost}
                helperText={touched.cost && errors.cost}
              />
              <TextField
                sx={{ gridColumn: "span 4" }}
                fullWidth
                variant="filled"
                label="Purchase Date"
                type="date"
                name="purchaseDate"
                value={values.purchaseDate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.purchaseDate && !!errors.purchaseDate}
                helperText={touched.purchaseDate && errors.purchaseDate}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                size="large"
              >
                Add
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default PurchaseItem;
