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
import {
  systemProgram,
  rentSysvar,
  programID,
  merkleKeypair,
  localKeypair,
  connection,
  getProof,
  buildTransaction,
  appendToTree,
  buildTree,
  getLeavesFromFirebase,
} from "../utils/web3utils";
import createInitEmptyMerkleTreeInstruction from "../utils/initEmptyMerkleTree.js";
import createAppendInstruction from "../utils/append";
import createReplaceInstruction from "../utils/replace";
import * as web3 from "@solana/web3.js";
import { MerkleTree, hash } from "@solana/spl-account-compression";
import { keccak_256 } from "js-sha3";


let rent = 0;

export default function Sidebar({ drawerWidth }) {
  //access row data and load it into the rows
  React.useEffect(() => {
    const airdrop = async () => {
      console.log("aidropping now", localKeypair);
      rent = await connection.getMinimumBalanceForRentExemption(31744);
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
    let transaction = await buildTransaction(instructions);
    //const signature = await connection.sendTransaction(transaction);
    await connection.sendTransaction(transaction);
  };

  const handleAppendClick = async () => {
    let appendArray = [];
    let leaves = await getLeavesFromFirebase("students");
    leaves.map((leaf) => {
      console.log(leaf);
      appendArray.push(
        createAppendInstruction(
          localKeypair.publicKey,
          merkleKeypair.publicKey,
          leaf
        )
      );
    });
    
    const instructions = appendArray;
    let transaction = await buildTransaction(instructions);
    await connection
      .simulateTransaction(transaction)
      .then((res) => console.log("success :)", res.value));
    await connection.sendTransaction(transaction);
  };

  const handleReplaceClick = async () => {
    //let merkle = new MerkleTree(await getLeavesFromFirebase("students"));
    let merkle = await buildTree();
    let root = merkle.root;
    console.log(root);
    let index = 1;
    //let newLeaf = Buffer.from(keccak_256.digest("/*Buffer.concat(/*metadata)*/"));
    let leafData = keccak_256.digest(
      Buffer.concat([
        Buffer.from(localKeypair.publicKey.toBase58()),
        Buffer.from(merkleKeypair.publicKey.toBase58()),
        Buffer.from(programID.toBase58()),
      ])
    );
    //let computeInstruction = web3.ComputeBudgetProgram.setComputeUnitLimit({units: 500000})

    /* let appendInstruction = createAppendInstruction(
      localKeypair.publicKey,
      merkleKeypair.publicKey,
      leafData
    );
 */
    let previousLeaf = merkle.leaves[index].node;
    //console.log(previousLeaf);
    //let new_merkle = appendToTree(merkle, leafData, index);
    let proof = getProof(merkle, index);
    console.log(proof);
    let replaceInstruction = createReplaceInstruction(
      localKeypair.publicKey,
      merkleKeypair.publicKey,
      merkle.root,
      index,
      previousLeaf,
      leafData,
      proof
    );
    const instructions = [
      /*computeInstruction, appendInstruction, */ replaceInstruction,
    ];

    /* const {
      context: { slot: minContextSlot },
      value: { blockhash, lastValidBlockHeight },
    } = await connection.getLatestBlockhashAndContext(); */
    let transaction = await buildTransaction(instructions);
    //const signature = await connection.sendTransaction(transaction);
    await connection
      .simulateTransaction(transaction)
      .then((res) => console.log("success :)", res.value));
    await connection.sendTransaction(transaction);
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
