import * as beet from "@metaplex-foundation/beet";
import * as web3 from "@solana/web3.js";
import { programID } from "./web3utils";

const initEmptyMerkleTreeStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number;
}>(
  [["instructionDiscriminator", beet.u8]],
  "InitEmptyMerkleTreeInstructionArgs"
);

type InitEmptyMerkleTreeInstructionAccounts = {
  merkleTree: web3.PublicKey;
  feePayer: web3.PublicKey;
  systemProgram: web3.PublicKey;
  rentSysvar: web3.PublicKey;
};

const initEmptyMerkleTreeInstructionDiscriminator = 0;

function createInitEmptyMerkleTreeInstruction(
  accounts: InitEmptyMerkleTreeInstructionAccounts,
  //args: InitEmptyMerkleTreeInstructionArgs,
  programId = programID
) {
  const [data] = initEmptyMerkleTreeStruct.serialize({
    instructionDiscriminator: initEmptyMerkleTreeInstructionDiscriminator,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.feePayer,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: accounts.merkleTree,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.systemProgram,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.rentSysvar,
      isWritable: false,
      isSigner: false,
    },
  ];

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  });
  return ix;
}

export default function createInitEmptyMerkleTreeIx(
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
}
