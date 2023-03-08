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
import createInitEmptyMerkleTreeIx from "../utils/initEmptyMerkleTree";
import * as web3 from "@solana/web3.js";
const drawerWidth = 256;

//establish connection
const connection = new web3.Connection("https://api.devnet.solana.com");
const merklePubkey = web3.Keypair.generate();
const localPubkey = web3.Keypair.generate();
const systemProgram = new web3.PublicKey("11111111111111111111111111111111");
connection.requestAirdrop(localPubkey.publicKey, 1000000);

export default function Sidebar() {
  const handleClick = async () => {
    console.log("connection", connection, "wallet", localPubkey.publicKey);

    const transaction = new web3.Transaction().add(
      createInitEmptyMerkleTreeIx(
        localPubkey.publicKey,
        merklePubkey.publicKey,
        systemProgram
      )
    );
    const {
      context: { slot: minContextSlot },
      value: { blockhash, lastValidBlockHeight },
    } = await connection.getLatestBlockhashAndContext();
    transaction.recentBlockhash = blockhash;
    const signature = await web3.sendAndConfirmTransaction(
      transaction,
      connection,
      { minContextSlot }
    );
    console.log("success :)");
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
            <ListItemButton>
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
