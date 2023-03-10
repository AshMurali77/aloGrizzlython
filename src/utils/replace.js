import * as web3 from "@solana/web3.js";
import { programID, addProof } from "./web3utils";
import { Buffer } from "buffer";
import * as BufferLayout from "@solana/buffer-layout";
import { keccak_256 } from "js-sha3";

const layout = BufferLayout.struct([
  BufferLayout.u8("instruction"),
  BufferLayout.seq(BufferLayout.u8(), 32, "root"),
  BufferLayout.seq(BufferLayout.u8(), 32, "previousLeaf"),
  BufferLayout.seq(BufferLayout.u8(), 32, "newLeaf"),
  BufferLayout.u32("index"),
]);
//const appendInstructionDiscriminator = 1;
function createReplaceIx(localPubkey, merklePubkey, programId = programID) {
  console.log(
    "buffer",
    Buffer.from(
      keccak_256.digest(
        Buffer.concat([
          Buffer.from(localPubkey.toBase58()),
          Buffer.from(merklePubkey.toBase58()),
          Buffer.from(programID.toBase58()),
        ])
      )
    )
  );
  const data = Buffer.alloc(layout.span);
  layout.encode(
    {
      instruction: 2,
      root: Buffer.from(
        keccak_256.digest(
          Buffer.concat([
            Buffer.from(localPubkey.toBase58()),
            Buffer.from(merklePubkey.toBase58()),
            Buffer.from(programID.toBase58()),
          ])
        )
      ),
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

export default function createReplaceInstruction(
  merkleTree,
  localPubkey,
  newLeaf,
  proof
) {
  return addProof(
    createReplaceIx(
      {
        merkleTree,
        localPubkey,
      },
      {
        root: Array.from(proof.root),
        previousLeaf: Array.from(proof.leaf),
        newLeaf: Array.from(newLeaf),
        index: proof.leafIndex,
      }
    ),
    proof.proof
  );
}

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
