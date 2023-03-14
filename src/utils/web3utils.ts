import * as web3 from "@solana/web3.js";
import os from "os";
//import fs from "mz/fs";
import path from "path";
import yaml from "yaml";
import { keccak_256 } from "js-sha3";
import { Buffer } from "buffer";
import { MerkleTree, MerkleTreeProof } from "@solana/spl-account-compression";
import { ref, listAll, getMetadata } from "firebase/storage";
import { storage } from "../firebase";

//web3 program ID, solana program
const programAddress = "9AAixeznnJ7kQCxgHQ2dJr5j9S1m8S9dkc1BZRuModBT";
export const merkleKeypair = web3.Keypair.generate();
export const localKeypair = web3.Keypair.generate();
export const programID = new web3.PublicKey(programAddress);
export const systemProgram = new web3.PublicKey(
  "11111111111111111111111111111111"
);
export const rentSysvar = new web3.PublicKey(
  "SysvarRent111111111111111111111111111111111"
);


export async function buildTree () {
  let leaf_buffers = await getLeavesFromFirebase("files");
  return MerkleTree.sparseMerkleTreeFromLeaves(leaf_buffers, 14);
}

export function buildEmptyTree () {
  let leaves : Buffer[] = []
  for (let i = 0; i < (24); i++) {
    leaves.push(Buffer.from(Array(32).fill(0)))
  }
  console.log(leaves);
  return MerkleTree.sparseMerkleTreeFromLeaves(leaves, 14);
}

export function appendToTree (merkle : MerkleTree, leaf_data : number[]) {
  merkle.updateLeaf(1, Buffer.from(leaf_data));
  return merkle;
}

export function getProof (merkle : MerkleTree, leafIndex : number) {
  //let merkle = await buildTree();
  console.log(merkle.getProof(leafIndex));
  return merkle.getProof(leafIndex);
}

/* 
export async function getConfig(): Promise<any> {
  // Path to Solana CLI config file
  const CONFIG_FILE_PATH = path.resolve(
    os.homedir(),
    ".config",
    "solana",
    "cli",
    "config.yml"
  );
  const configYml = await fs.readFile(CONFIG_FILE_PATH, { encoding: "utf8" });
  return yaml.parse(configYml);
}

export async function getPayer(): Promise<web3.Keypair> {
  try {
    const config = await getConfig();
    if (!config.keypair_path) throw new Error("Missing keypair path");
    return await createKeypairFromFile(config.keypair_path);
  } catch (err) {
    console.warn(
      "Failed to create keypair from CLI config file, falling back to new random keypair"
    );
    return web3.Keypair.generate();
  }
}


export async function createKeypairFromFile(
  filePath: string
): Promise<web3.Keypair> {
  const secretKeyString = await fs.readFile(filePath, { encoding: "utf8" });
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  return web3.Keypair.fromSecretKey(secretKey);
}
 */

export async function establishConnection(): Promise<void> {
  const rpcUrl = "https://api.devnet.solana.com";
  const connection = new web3.Connection(rpcUrl, "confirmed");
  const version = await connection.getVersion();
  console.log("Connection to cluster established:", rpcUrl, version);
}

/* //hash function
export function hashv(...pubkeys: web3.PublicKey): Buffer {
  const keys = pubkeys.map((pubkey) => {
    Buffer.from(pubkey.toBase58());
  });
  return Buffer.from(keccak_256.digest(Buffer.concat([keys[0]])));
}
 */


//gets all leaf metadata and parse it into an array of buffers
export const getLeavesFromFirebase = async (origin: string) => {
  let leaf_data: Buffer[] = [];
  const storageRef = ref(storage, `${origin}/`);
  const files = await listAll(storageRef);
  await Promise.all(
    files.items.map(async (item) => {
      const metadata = await getMetadata(item);
      if (metadata.customMetadata) {
        console.log(
          "name",
          metadata.name,
          "leaf",
          metadata.customMetadata.leaf.length,
          "leaf buffer",
          Buffer.from(metadata.customMetadata.leaf, "ascii")
        );
        leaf_data.push(Buffer.from(metadata.customMetadata.leaf, "ascii"));
      }
    })
  );
  console.log("leaf data", leaf_data);
  return leaf_data;
};
