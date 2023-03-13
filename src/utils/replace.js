import * as web3 from "@solana/web3.js";
import { programID, getProof} from "./web3utils";
import { Buffer } from "buffer";
import * as BufferLayout from "@solana/buffer-layout";
import { keccak_256 } from "js-sha3";

const layout = BufferLayout.struct([
  BufferLayout.u8("instruction"),
  BufferLayout.seq(BufferLayout.u8(), 32, "root"),
  BufferLayout.seq(BufferLayout.u8(), 32, "previousLeaf"),
  BufferLayout.seq(BufferLayout.u8(), 32, "newLeaf"),
  BufferLayout.seq(BufferLayout.seq(BufferLayout.u8(), 32, "proofNode"), 14, "proof"),
  BufferLayout.u32("index"),
]);
  //const appendInstructionDiscriminator = 1;

export default function createReplaceInstruction(localPubkey, merklePubkey, merkleTree, leafIndex, newLeaf, proof, programId = programID) {
  const data = Buffer.alloc(layout.span);
  const root = merkleTree.root;
  console.log(proof);
  layout.encode(
    {
      instruction: 2,
      root: root,
      previousLeaf : proof.leaf,
      newLeaf : newLeaf,
      proof: proof,
      index : leafIndex
    },
    data
  );

  const keys = [
    { pubkey: localPubkey, isWritable: false, isSigner: true },
    { pubkey: merklePubkey, isWritable: true, isSigner: true },
  ];

  const instruction = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  });
  return instruction;
}

/* export default function createReplaceInstruction(
  merkleTree,
  localPubkey,
  newLeaf,
) {
    createReplaceIx(
      {
        localPubkey,
        merkleTree,
      },
      {
        root: Buffer.from(proof.root),
        previousLeaf: Buffer.from(proof.leaf),
        newLeaf: Buffer.from(newLeaf),
        index: proof.leafIndex,
      }
    );
} */

/* export function addProof(
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
} */
