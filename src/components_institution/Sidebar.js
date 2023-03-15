// MUI Component Imports
import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  Toolbar,
  Typography,
} from "@mui/material/";
// MUI Component Imports
// MUI Icon Imports
import { Assessment, ContactSupport } from "@mui/icons-material";
import ArticleIcon from "@mui/icons-material/Article";
import SchoolIcon from "@mui/icons-material/School";
import * as web3 from "@solana/web3.js";
import { useLocation } from "react-router-dom";
import createInitEmptyMerkleTreeInstruction from "../utils/initEmptyMerkleTree.js";
import {
  buildTransaction,
  connection,
  localKeypair,
  merkleKeypairOne,
  merkleKeypairTwo,
  institutionOneKeypair,
  institutionTwoKeypair,
  programID,
  rentSysvar,
  systemProgram,
} from "../utils/web3utils";

let rent = 0;

export default function Sidebar(props) {
  const location = useLocation().pathname;
  const merkleKeypair =
    location == "institution-one" || location == "student"
      ? merkleKeypairOne
      : merkleKeypairTwo;

  const handleInitClick = async () => {
    //const localKeypair = await getPayer();
    console.log("init rent", rent);
    await connection
      .getBalance(localKeypair.publicKey)
      .then((balance) =>
        console.log(
          "signature",
          "::",
          localKeypair.publicKey.toBase58(),
          "balance: ",
          balance
        )
      );
    console.log(
      "connection",
      connection,
      "wallet",
      localKeypair.publicKey.toBase58(),
      "merkle",
      merkleKeypair.publicKey.toBase58()
    );

    let createAccountInstruction = web3.SystemProgram.createAccount({
      fromPubkey: localKeypair.publicKey,
      newAccountPubkey: merkleKeypair.publicKey,
      lamports: rent,
      space: 31744,
      programId: programID,
    });

    /* let createAccountTransaction = new web3.Transaction().add(
      createAccountInstruction
    );

    await web3.sendAndConfirmTransaction(connection, createAccountTransaction, [
      localKeypair,
      merkleKeypair,
    ]); */

    let instruction = createInitEmptyMerkleTreeInstruction(
      localKeypair.publicKey,
      merkleKeypair.publicKey,
      systemProgram,
      rentSysvar
    );
    const instructions = [createAccountInstruction, instruction];
    let transaction = await buildTransaction(instructions, location);
    //const signature = await connection.sendTransaction(transaction);
    await connection.sendTransaction(transaction);
  };
  const drawerWidth = props.drawerWidth;
  const handleSupportClick = () => {};
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      PaperProps={{
        sx: {
          backgroundColor: "#004777",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar paddingLeft={0} marginLeft={0}>
        <Box display={"inline-flex"} fontSize={40}>
          <Assessment fontSize={"inherit"} sx={{ color: "#fff" }} />
          <Typography variant="h5" paddingTop={1} noWrap color="#fff">
            ALO
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <Box sx={{ overflow: "auto" }}>
        <List sx={{ color: "#fff" }}>
          <ListItem>
            <Button
              color="inherit"
              onClick={() => props.setView("students")}
              startIcon={<ArticleIcon />}
            >
              Students
            </Button>
          </ListItem>
          <ListItem>
            <Button
              color="inherit"
              onClick={() => props.setView("files")}
              startIcon={<SchoolIcon />}
            >
              Records
            </Button>
          </ListItem>
          <ListItem>
            <Button
              color="inherit"
              onClick={handleInitClick}
              startIcon={<SchoolIcon />}
            >
              InitTree
            </Button>
          </ListItem>
        </List>
        <Divider />
      </Box>
      <Box position="absolute" bottom={"5%"}>
        <List sx={{ color: "#fff" }}>
          <ListItem>
            <Button
              color="inherit"
              onClick={handleSupportClick}
              startIcon={<ContactSupport />}
            >
              Support
            </Button>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
