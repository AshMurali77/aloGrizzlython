import * as web3 from "@solana/web3.js";
import * as beet from "@metaplex-foundation/beet";
import { programID, addProof, MerkleTreeProof } from "./web3utils";

type ReplaceLeafInstructionArgs = {
  root: number[] /* size: 32 */;
  previousLeaf: number[] /* size: 32 */;
  newLeaf: number[] /* size: 32 */;
  index: number;
};

const replaceLeafStruct = new beet.BeetArgsStruct<
  ReplaceLeafInstructionArgs & {
    instructionDiscriminator: number;
  }
>(
  [
    ["instructionDiscriminator", beet.u8],
    ["root", beet.uniformFixedSizeArray(beet.u8, 32)],
    ["previousLeaf", beet.uniformFixedSizeArray(beet.u8, 32)],
    ["newLeaf", beet.uniformFixedSizeArray(beet.u8, 32)],
    ["index", beet.u32],
  ],
  "ReplaceLeafInstructionArgs"
);

//Required Accounts
type ReplaceLeafInstructionAccounts = {
  merkleTree: web3.PublicKey;
  authority: web3.PublicKey;
  anchorRemainingAccounts?: web3.AccountMeta[];
};

const replaceLeafInstructionDiscriminator = 2;

function createReplaceLeafInstruction(
  accounts: ReplaceLeafInstructionAccounts,
  args: ReplaceLeafInstructionArgs,
  programId = programID
) {
  const [data] = replaceLeafStruct.serialize({
    instructionDiscriminator: replaceLeafInstructionDiscriminator,
    ...args,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.merkleTree,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.authority,
      isWritable: false,
      isSigner: true,
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

export function createReplaceIx(
  merkleTree: web3.PublicKey,
  authority: web3.PublicKey,
  newLeaf: Buffer,
  proof: MerkleTreeProof
): web3.TransactionInstruction {
  return addProof(
    createReplaceLeafInstruction(
      {
        merkleTree,
        authority: authority,
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
