use borsh::{BorshSerialize, BorshDeserialize, BorshSchema};
use solana_program::{
    program_pack::{Pack, Sealed},
    msg,
    program_error::ProgramError,
};

//use spl_concurrent_merkle_tree::concurrent_merkle_tree::ConcurrentMerkleTree;

#[derive(Clone, Debug, BorshSerialize, BorshDeserialize, BorshSchema, PartialEq)]
pub enum TreeState {
    Uninitialized,
    ConcurrentMerkleTree,
}

pub type Node = [u8;32];

#[derive(Clone, Debug, BorshSerialize, BorshDeserialize, BorshSchema, PartialEq)]
pub struct RightmostProof {
    pub proof : [Node; 24],
    pub leaf : Node,
    pub index : u32,
}

#[derive(Clone, Copy, Debug, BorshSerialize, BorshDeserialize, BorshSchema, PartialEq)]
pub struct Changelog {
    pub root : Node,    
    pub path : [Node; 24],
    pub index : u32,
}
impl Default for Changelog {
    fn default() -> Self {
        Self { root: [0;32], path: [[0;32]; 24], index: 0 }
    }
}

#[derive(Clone, Debug, BorshSerialize, BorshDeserialize, BorshSchema, PartialEq)]
pub struct DocTree {
    pub root : Node,
    pub rightmost_proof : RightmostProof,
    pub change_logs : [Changelog; 1024],
    pub authority : [u8; 32],
}

impl Sealed for DocTree {}

impl Pack for DocTree {
    const LEN : usize = 824164;

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let data = self.try_to_vec().unwrap();
        dst[..data.len()].copy_from_slice(&data);
    }

    fn unpack_from_slice(src: &[u8]) -> Result<Self, solana_program::program_error::ProgramError> {
        let mut mut_src = src;
        Self::deserialize(&mut mut_src).map_err(|err| {
            msg!(
                "Unable to deserialize Document Tree Account {}",
                err
            );
            ProgramError::InvalidInstructionData
        })
    }

}
/* impl Sealed for TreeState {}

impl Pack for TreeState {
    const LEN : usize = 1920;

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
} */

