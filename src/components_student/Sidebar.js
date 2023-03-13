import * as React from "react";
// MUI Component Imports
import { blue } from "@mui/material/colors";
import {
  Box,
  Divider,
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Button,
} from "@mui/material/";
// MUI Icon Imports
import { Assessment } from "@mui/icons-material";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import ArticleIcon from "@mui/icons-material/Article";
import SchoolIcon from "@mui/icons-material/School";
import SearchIcon from "@mui/icons-material/Search";
import { systemProgram, rentSysvar, programID } from "../utils/web3utils";
import createInitEmptyMerkleTreeInstruction from "../utils/initEmptyMerkleTree.js";
import createAppendInstruction from "../utils/append";
import createReplaceInstruction from "../utils/replace";
import * as web3 from "@solana/web3.js";

//establish connection
const connection = new web3.Connection(
  //"https://api.devnet.solana.com",
  "http://127.0.0.1:8899",
  "confirmed"
);
const merkleKeypair = web3.Keypair.generate();
const localKeypair = web3.Keypair.generate();
let rent = 0;

export default function Sidebar({ drawerWidth }) {
  //access row data and load it into the rows
  React.useEffect(() => {
    const airdrop = async () => {
      console.log("aidropping now");
      rent = await connection.getMinimumBalanceForRentExemption(828224);
      const airdrop = await connection.requestAirdrop(
        localKeypair.publicKey,
        rent + 1 * web3.LAMPORTS_PER_SOL
      );
      console.log(airdrop);
    };
    airdrop();
  }, []);

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

    let createAccountTransaction = new web3.Transaction().add(
      web3.SystemProgram.createAccount({
        fromPubkey: localKeypair.publicKey,
        newAccountPubkey: merkleKeypair.publicKey,
        lamports: rent,
        space: 828224,
        programId: programID,
      })
    );

    await web3.sendAndConfirmTransaction(connection, createAccountTransaction, [
      localKeypair,
      merkleKeypair,
    ]);

    let instruction = createInitEmptyMerkleTreeInstruction(
      localKeypair.publicKey,
      merkleKeypair.publicKey,
      systemProgram,
      rentSysvar
    );
    const instructions = [instruction];
    const {
      context: { slot: minContextSlot },
      value: { blockhash, lastValidBlockHeight },
    } = await connection.getLatestBlockhashAndContext();
    const message = new web3.TransactionMessage({
      payerKey: localKeypair.publicKey,
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message();
    const transaction = new web3.VersionedTransaction(message);
    transaction.sign([localKeypair, merkleKeypair]);
    //const signature = await connection.sendTransaction(transaction);
    await connection
      .simulateTransaction(transaction)
      .then((res) => console.log("success :)", res.value.logs));
  };

  const handleAppendClick = async () => {
    let instruction = createAppendInstruction(
      localKeypair.publicKey,
      merkleKeypair.publicKey
    );
    const instructions = [instruction];
    const {
      context: { slot: minContextSlot },
      value: { blockhash, lastValidBlockHeight },
    } = await connection.getLatestBlockhashAndContext();
    const message = new web3.TransactionMessage({
      payerKey: localKeypair.publicKey,
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message();
    const transaction = new web3.VersionedTransaction(message);
    transaction.sign([localKeypair, merkleKeypair]);
    //const signature = await connection.sendTransaction(transaction);
    await connection
      .simulateTransaction(transaction)
      .then((res) => console.log("success :)", res.value.logs));
  };

  const handleReplaceClick = async () => {
    let instruction = createReplaceInstruction(
      localKeypair.publicKey,
      merkleKeypair.publicKey
    );
    const instructions = [instruction];
    const {
      context: { slot: minContextSlot },
      value: { blockhash, lastValidBlockHeight },
    } = await connection.getLatestBlockhashAndContext();
    const message = new web3.TransactionMessage({
      payerKey: localKeypair.publicKey,
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message();
    const transaction = new web3.VersionedTransaction(message);
    transaction.sign([localKeypair, merkleKeypair]);
    //const signature = await connection.sendTransaction(transaction);
    await connection
      .simulateTransaction(transaction)
      .then((res) => console.log("success :)", res));
  };

  //Link to support form
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
            <Button color="inherit" startIcon={<ArticleIcon />}>
              Documents
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
          <ListItem>
            <Button
              color="inherit"
              onClick={handleAppendClick}
              startIcon={<SearchIcon />}
            >
              Append
            </Button>
          </ListItem>
          <ListItem>
            <Button
              color="inherit"
              onClick={handleReplaceClick}
              startIcon={<SearchIcon />}
            >
              Replace
            </Button>
          </ListItem>
        </List>
        <Divider />

        {/*         <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <UploadIcon />
              </ListItemIcon>
              <ListItemText primary="Upload Documents" />
            </ListItemButton>
          </ListItem>
        </List> */}
      </Box>
      <Box position="absolute" bottom={"5%"}>
        <List sx={{ color: "#fff" }}>
          <ListItem>
            <Button
              color="inherit"
              onClick={handleSupportClick}
              startIcon={<ContactSupportIcon />}
            >
              Support
            </Button>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
