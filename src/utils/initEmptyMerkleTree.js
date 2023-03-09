import * as web3 from "@solana/web3.js";
import { programID } from "./web3utils";
import { Buffer } from "buffer";
import * as BufferLayout from "@solana/buffer-layout";

const layout = BufferLayout.struct([BufferLayout.u8("instruction")]);

export default function createInitEmptyMerkleTreeInstruction(
  localPubkey,
  merklePubkey,
  systemProgram,
  rentSysvar,
  programId = programID
) {
  const data = Buffer.alloc(layout.span);
  layout.encode({ instruction: 0 }, data);
  const keys = [
    {
      pubkey: localPubkey,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: merklePubkey,
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
  ];
  const instruction = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  });
  return instruction;
}
