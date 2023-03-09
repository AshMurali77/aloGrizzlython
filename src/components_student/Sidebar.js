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
import createAppendInstruction from "../utils/append";
import * as web3 from "@solana/web3.js";
const drawerWidth = 256;

//establish connection
const connection = new web3.Connection(
  //"https://api.devnet.solana.com",
  "http://127.0.0.1:8899",
  "confirmed"
);
const merkleKeypair = web3.Keypair.generate();
const localKeypair = web3.Keypair.generate();
const systemProgram = new web3.PublicKey("11111111111111111111111111111111");
const rentSysvar = new web3.PublicKey(
  "SysvarRent111111111111111111111111111111111"
);
let rent = 0;
async function airdrop() {
  console.log("aidropping now");
  rent = await connection.getMinimumBalanceForRentExemption(828224);
  const airdrop = await connection.requestAirdrop(
    localKeypair.publicKey,
    rent + 1 * web3.LAMPORTS_PER_SOL
  );
  console.log(airdrop);
}
export default function Sidebar() {
  const handleInitClick = async () => {
    //const localKeypair = await getPayer();
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

    let instruction = new web3.TransactionInstruction({
      keys: [
        {
          pubkey: localKeypair.publicKey,
          isWritable: false,
          isSigner: true,
        },
        {
          pubkey: merkleKeypair.publicKey,
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
      .then((res) => console.log("success :)", res));
  };

  const handleReplaceClick = async () => {};
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
              <ListItemText primary="InitTree" onClick={handleInitClick} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={airdrop}>
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary="Airdrop" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleAppendClick}>
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary="Append" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleReplaceClick}>
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary="Replace" />
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
