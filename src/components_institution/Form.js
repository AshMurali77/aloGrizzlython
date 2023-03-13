import React, { useState } from "react";
import { Container, Button, Alert, Stack, Typography } from "@mui/material";
import { uploadFiles, getFileData } from "../utils/firebaseutils";

const Form = () => {
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    uploadFiles(e.target[0].files[0]);
    setSuccess(true);
  };

  const fileData = async (e) => {
    const data = await getFileData();
    console.log(data[0]);
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Typography variant="h1" color={"#000"}>
            ALO
          </Typography>

          <Button variant="outlined" component="label">
            Upload File
            <input type="file" hidden />
          </Button>
          {success ? (
            <Alert severity="success">File Successfully Submitted!</Alert>
          ) : (
            <Button type="submit" variant="contained">
              Submit
            </Button>
          )}
          <Button onClick={fileData} variant="contained">
            List Files
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default Form;
