import { Box, Typography, Button, Modal } from "@mui/material";
import React from "react";
import Form from "./Form";
import StudentDataTable from "./StudentDataTable";
//web3 function imports
//import { mintTranscript, modifyTranscript, burnTranscript } from "";

const StudentView = (props) => {
  //drawer width to pass down to student table
  const drawerWidth = props.drawerWidth;
  //for mint modal display
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleMint = () => {
    setModalOpen(true);
    //mintTranscript();
  };
  //Record Burn
  const handleBurnRecord = (e) => {
    //burnTranscript();
  };

  return (
    <Box height={"100%"}>
      <Box height={"80%"}>
        <StudentDataTable setModalOpen={setModalOpen} drawerWidth />
      </Box>
      <Box height={"20%"}>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Form />
        </Modal>
      </Box>
    </Box>
  );
};

export default StudentView;
