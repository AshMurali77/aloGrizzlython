import * as React from "react";
// MUI Component Imports
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material/";
// MUI Icon Imports
import ArticleIcon from "@mui/icons-material/Article";
import SchoolIcon from "@mui/icons-material/School";
import SearchIcon from "@mui/icons-material/Search";
import { getPayer, programID } from "../utils/web3utils";
import createInitEmptyMerkleTreeInstruction from "../utils/initEmptyMerkleTree.js";
import * as web3 from "@solana/web3.js";
const drawerWidth = 256;

//establish connection
const connection = new web3.Connection(
  //"https://api.devnet.solana.com",
  "http://127.0.0.1:8899",
  "confirmed"
);
const merklePubkey = web3.Keypair.generate();
const localPubkey = web3.Keypair.generate();
const systemProgram = new web3.PublicKey("11111111111111111111111111111111");
const rentSysvar = new web3.PublicKey(
  "SysvarRent111111111111111111111111111111111"
);
async function airdrop() {
  console.log("aidropping now");
  const airdrop = await connection.requestAirdrop(
    localPubkey.publicKey,
    1000 * web3.LAMPORTS_PER_SOL
  );
  console.log(airdrop);
}
export default function Sidebar() {
  const handleClick = async () => {
    //const localPubkey = await getPayer();
    await connection
      .getBalance(localPubkey.publicKey)
      .then((balance) =>
        console.log(
          "signature",
          "::",
          localPubkey.publicKey.toBase58(),
          "balance: ",
          balance
        )
      );
    console.log(
      "connection",
      connection,
      "wallet",
      localPubkey.publicKey.toBase58()
    );
    let instruction = new web3.TransactionInstruction({
      keys: [
        {
          pubkey: localPubkey.publicKey,
          isWritable: false,
          isSigner: true,
        },
        {
          pubkey: merklePubkey.publicKey,
          isWritable: true,
          isSigner: true,
        },
        {
          pubkey: systemProgram,
          isWritable: false,
          isSigner: false,
        },
        {
          pubkey: rentSysvar,
          isWritable: false,
          isSigner: false,
        },
      ],
      programId: programID,
      data: createInitEmptyMerkleTreeInstruction(),
    });
    const instructions = [instruction];
    const {
      context: { slot: minContextSlot },
      value: { blockhash, lastValidBlockHeight },
    } = await connection.getLatestBlockhashAndContext();
    const message = new web3.TransactionMessage({
      payerKey: localPubkey.publicKey,
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message();
    const transaction = new web3.VersionedTransaction(message);
    transaction.sign([localPubkey, merklePubkey]);
    //const signature = await connection.sendTransaction(transaction);
    await connection
      .simulateTransaction(transaction)
      .then((res) => console.log("success :)", res.value.logs));
  };

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
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <Box sx={{ overflow: "auto", backgroundColor: "primary" }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ArticleIcon />
              </ListItemIcon>
              <ListItemText primary="Documents" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Academics" onClick={handleClick} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={airdrop}>
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary="College Search" />
            </ListItemButton>
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
    </Drawer>
  );
}
