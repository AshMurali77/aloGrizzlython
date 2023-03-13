import { Box, Typography, Button, Modal } from "@mui/material";
import React from "react";
import SendIcon from "@mui/icons-material/Send";
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
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Do a Minting Thing
            </Typography>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default StudentView;
