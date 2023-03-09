import * as beet from "@metaplex-foundation/beet";
import * as web3 from "@solana/web3.js";
import { programID } from "./web3utils";
import { Buffer } from "buffer";
import * as BufferLayout from "@solana/buffer-layout";

/* const initEmptyMerkleTreeStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator;
}>(
  [["instructionDiscriminator", beet.u8]],
  "InitEmptyMerkleTreeInstructionArgs"
);
 */

const layout = BufferLayout.struct([BufferLayout.u8("instruction")]);
const initEmptyMerkleTreeInstructionDiscriminator = 0;

export default function createInitEmptyMerkleTreeInstruction(
  accounts,
  //args: InitEmptyMerkleTreeInstructionArgs,
  programId = programID
) {
  const data = Buffer.alloc(layout.span);
  layout.encode({ instruction: 0 }, data);

  return data;
}

/* export default function createInitEmptyMerkleTreeIx(
  feePayer: web3.PublicKey,
  merkleTree: web3.PublicKey,
  systemProgram: web3.PublicKey,
  rentSysvar: web3.PublicKey
): web3.TransactionInstruction {
  return createInitEmptyMerkleTreeInstruction({
    merkleTree,
    feePayer,
    systemProgram,
    rentSysvar,
    //authority: authority,
  });
} */
