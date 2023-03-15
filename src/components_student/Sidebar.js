import * as React from "react";
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
// MUI Icon Imports
import { Assessment } from "@mui/icons-material";
import ArticleIcon from "@mui/icons-material/Article";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import SearchIcon from "@mui/icons-material/Search";
import * as web3 from "@solana/web3.js";
import { keccak_256 } from "js-sha3";
import { useLocation } from "react-router-dom";
import createAppendInstruction from "../utils/append";
import createReplaceInstruction from "../utils/replace";
import {
  buildTransaction,
  buildTree,
  connection,
  getLeavesFromFirebase,
  getProof,
  localKeypair,
  merkleKeypairOne,
  merkleKeypairTwo,
  institutionOneKeypair,
  institutionTwoKeypair,
  programID,
} from "../utils/web3utils";
let rent = 0;

export default function Sidebar({ drawerWidth }) {
  const location = useLocation().pathname;
  const merkleKeypair =
    location == "institution-one" || location == "student"
      ? merkleKeypairOne
      : merkleKeypairTwo;
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
    let transaction = await buildTransaction(instructions, location);
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
    let transaction = await buildTransaction(instructions, location);
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
