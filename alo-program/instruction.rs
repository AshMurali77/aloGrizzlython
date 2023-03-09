use solana_program::{
    program_pack::{Pack,Sealed},
    program_error::ProgramError,
    msg,
};
use borsh::{
    BorshDeserialize,
    BorshSerialize,
    BorshSchema
};
use spl_concurrent_merkle_tree::{node::Node};

#[derive(Clone,Debug,BorshSerialize,BorshDeserialize,BorshSchema,PartialEq)]
pub enum ProgramInstruction {
    CreateTree,
    AddLeaf {
        #[allow(dead_code)]
        tree_address : [u8; 32]
    },
    ModifyLeaf {
        #[allow(dead_code)]
        tree_address : [u8; 32],
        #[allow(dead_code)]
        previous_leaf : Node,
        #[allow(dead_code)]
        new_leaf : Node,
        #[allow(dead_code)]
        node_index : u32,
    },
    AuthorizeView {
        #[allow(dead_code)]
        tree_address : [u8; 32],
        #[allow(dead_code)]
        node_index : u16
    },
}

impl Sealed for ProgramInstruction {}

impl Pack for ProgramInstruction {
    const LEN : usize = 81;

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let data = self.pack_into_vec();
        dst[..data.len()].copy_from_slice(&data)
    }

    fn unpack_from_slice(src: &[u8]) -> Result<Self, solana_program::program_error::ProgramError> {
        let mut mut_src = src;
        Self::deserialize(&mut mut_src).map_err(|err| {
            msg!(
                "Unable to deserialize wager instruction {}",
                err
            );
            ProgramError::InvalidInstructionData
        })
    }
}

impl ProgramInstruction {
    fn pack_into_vec (&self) -> Vec<u8> {
        self.try_to_vec().expect("try_to_vec")
    }
}