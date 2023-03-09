import * as web3 from "@solana/web3.js";
import { programID } from "./web3utils";
import { Buffer } from "buffer";
import * as BufferLayout from "@solana/buffer-layout";
import { keccak_256 } from "js-sha3";
/* const appendStruct = new beet.BeetArgsStruct<
  AppendInstructionArgs & {
    instructionDiscriminator: number;
  }
>(
  [
    ["instructionDiscriminator", beet.u8],
    ["leaf", beet.uniformFixedSizeArray(beet.u8, 32)],
  ],
  "AppendInstructionArgs"
);
 */
const layout = BufferLayout.struct([
  BufferLayout.u8("instruction"),
  BufferLayout.seq(BufferLayout.u8(), 32, "leaf"),
]);
//const appendInstructionDiscriminator = 1;

export default function createAppendInstruction(
  localPubkey,
  merklePubkey,
  programId = programID
) {
  const data = Buffer.alloc(layout.span);
  layout.encode(
    { instruction: 1, leaf: keccak_256(localPubkey, merklePubkey, programID) },
    data
  );

  const keys = [
    { pubkey: localPubkey, isWritable: false, isSigner: true },
    { pubkey: merklePubkey, isWritable: true, isSigner: false },
  ];

  const instruction = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  });
  return instruction;
}

/* export function CreateAppendIx(
  merkleTree: web3.PublicKey,
  authority: web3.PublicKey,
  newLeaf: Buffer | ArrayLike<number>
): web3.TransactionInstruction {
  return createAppendInstruction(
    {
      merkleTree,
      authority: authority,
    },
    {
      leaf: Array.from(newLeaf),
    }
  );
} */
