import * as web3 from "@solana/web3.js";
import os from "os";
//import fs from "mz/fs";
import path from "path";
import yaml from "yaml";

//web3 program ID
const programAddress = "EWqDSAKQHh68KU3j1xt2GdpA98nY8C3MZtnCkot4xcSx";
export const programID = new web3.PublicKey(programAddress);

/**
 * Helper function that adds proof nodes to a TransactionInstruction
 * by adding extra keys to the transaction
 */
export function addProof(
  instruction: web3.TransactionInstruction,
  nodeProof: Buffer[]
): web3.TransactionInstruction {
  instruction.keys = instruction.keys.concat(
    nodeProof.map((node) => {
      return {
        pubkey: new web3.PublicKey(node),
        isSigner: false,
        isWritable: false,
      };
    })
  );
  return instruction;
}

export type MerkleTreeProof = {
  leafIndex: number;
  leaf: Buffer;
  proof: Buffer[];
  root: Buffer;
};
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
