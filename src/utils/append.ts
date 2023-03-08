import * as web3 from "@solana/web3.js";
import * as beet from "@metaplex-foundation/beet";
import { programID } from "./web3utils";

//Append a leaf to the merkle tree
type AppendInstructionArgs = {
  leaf: number[];
};

type AppendInstructionAccounts = {
  merkleTree: web3.PublicKey;
  authority: web3.PublicKey;
  anchorRemainingAccounts?: web3.AccountMeta[];
};

const appendStruct = new beet.BeetArgsStruct<
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

const appendInstructionDiscriminator = 1;

function createAppendInstruction(
  accounts: AppendInstructionAccounts,
  args: AppendInstructionArgs,
  programId = programID
) {
  const [data] = appendStruct.serialize({
    instructionDiscriminator: appendInstructionDiscriminator,
    ...args,
  });
  const keys = [
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

export function createAppendIx(
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
}
