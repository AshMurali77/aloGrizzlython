import * as web3 from "@solana/web3.js";

//web3 program ID
const programAddress = "DPttkPnetqu7RwauG7H5rYDHgHVsMibkLjFsMnmLekt6";
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
