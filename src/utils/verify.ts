import * as beet from "@metaplex-foundation/beet";
import * as web3 from "@solana/web3.js";
import { addProof, MerkleTreeProof, programID } from "./web3utils";

type VerifyLeafInstructionArgs = {
  root: number[] /* size: 32 */;
  leaf: number[] /* size: 32 */;
  index: number;
};

const verifyLeafStruct = new beet.BeetArgsStruct<
  VerifyLeafInstructionArgs & {
    instructionDiscriminator: number;
  }
>(
  [
    ["instructionDiscriminator", beet.u8],
    ["root", beet.uniformFixedSizeArray(beet.u8, 32)],
    ["leaf", beet.uniformFixedSizeArray(beet.u8, 32)],
    ["index", beet.u32],
  ],
  "VerifyLeafInstructionArgs"
);

type VerifyLeafInstructionAccounts = {
  merkleTree: web3.PublicKey;
  anchorRemainingAccounts?: web3.AccountMeta[];
};

const verifyLeafInstructionDiscriminator = 3;

/**
 * Creates a _VerifyLeaf_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program

 */
function createVerifyLeafInstruction(
  accounts: VerifyLeafInstructionAccounts,
  args: VerifyLeafInstructionArgs,
  programId = programID
) {
  const [data] = verifyLeafStruct.serialize({
    instructionDiscriminator: verifyLeafInstructionDiscriminator,
    ...args,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.merkleTree,
      isWritable: false,
      isSigner: false,
    },
  ];

  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  });
  return ix;
}

export function createVerifyLeafIx(
  merkleTree: web3.PublicKey,
  proof: MerkleTreeProof
): web3.TransactionInstruction {
  return addProof(
    createVerifyLeafInstruction(
      {
        merkleTree,
      },
      {
        root: Array.from(proof.root),
        leaf: Array.from(proof.leaf),
        index: proof.leafIndex,
      }
    ),
    proof.proof
  );
}
