//use borsh::BorshDeserialize;
use solana_program::{
    pubkey::Pubkey,
    account_info::{next_account_info, AccountInfo},
    program_pack::Pack,
    entrypoint::ProgramResult,
    msg, 
    keccak::hashv,
    /* program::invoke,
    system_instruction,
    sysvar::Sysvar,
    rent::Rent, */
    //program::invoke_signed,
};


use spl_concurrent_merkle_tree::{
    concurrent_merkle_tree::ConcurrentMerkleTree,
};

use crate::instruction::ProgramInstruction;


pub fn process_instruction (
    program_id : &Pubkey,
    accounts : &[AccountInfo],
    instruction_data : &[u8]
) -> ProgramResult {

    msg!("Running program");

    let instruction = ProgramInstruction::unpack_from_slice(instruction_data)?;
    let account_info_iter = &mut accounts.iter();

    match instruction {
        ProgramInstruction::CreateTree => {
            msg!("Program Instruction: CreateTree");
            let _funder_info = next_account_info(account_info_iter)?;
            let merkle_info = next_account_info(account_info_iter)?;
            //let system_program_info = next_account_info(account_info_iter)?;
            //let rent_sysvar_info = next_account_info(account_info_iter)?;
            //let rent = &Rent::from_account_info(rent_sysvar_info)?;

            /* invoke(
                &system_instruction::create_account(
                    funder_info.key, 
                    merkle_info.key, 
                    1.max(rent.minimum_balance(size_of::<ConcurrentMerkleTree<24, 1024>>())), 
                    size_of::<ConcurrentMerkleTree<24, 1024>>().try_into().unwrap(), 
                    program_id), 
                &[
                    funder_info.clone(),
                    merkle_info.clone(),
                    system_program_info.clone(),
                ])?;
 */
            let mut merkle_bytes = merkle_info.try_borrow_mut_data().unwrap();
            let merkle = bytemuck::try_from_bytes_mut::<ConcurrentMerkleTree<24,1024>>(&mut merkle_bytes).unwrap();
            let _root = merkle.initialize().unwrap();

            msg!("{:?}", merkle.get_root());

            let (logged_bytes, _) = merkle_bytes.split_at(64);
            msg!("New Tree Data: {:?}", logged_bytes);

            //merkle.append(hashv(&[&[1,2,3]]).to_bytes()).unwrap(); 

            //merkle.set_leaf(root, EMPTY, hashv(&[&[1,2,3]]).to_bytes(), , 1);

        },
        ProgramInstruction::AddLeaf {tree_address } => {
            msg!("Program Instruction: AddLeaf");
            let _funder_info = next_account_info(account_info_iter)?;
            let merkle_info = next_account_info(account_info_iter)?;
            //let system_program_info = next_account_info(account_info_iter)?;

            let mut merkle_bytes = merkle_info.try_borrow_mut_data().unwrap();
            let merkle = bytemuck::try_from_bytes_mut::<ConcurrentMerkleTree<24,1024>>(&mut merkle_bytes).unwrap();

            msg!("{:?}", merkle.get_root());

            if merkle.is_initialized() {
                merkle.append(tree_address).unwrap();
                msg!("Changelog: {:?}", merkle.get_change_log());
                msg!("Rightmost Proof: {:?}", merkle.rightmost_proof);
            }
            //msg!("Data After Append: {:?}", merkle_bytes[]);

            
        },
        ProgramInstruction::ModifyLeaf { tree_address, previous_leaf, new_leaf, node_index } => {
            msg!("Program Instruction: AddLeaf");
            let _funder_info = next_account_info(account_info_iter)?;
            let merkle_info = next_account_info(account_info_iter)?;

            let mut merkle_bytes = merkle_info.try_borrow_mut_data().unwrap();
            let merkle = bytemuck::try_from_bytes_mut::<ConcurrentMerkleTree<24,1024>>(&mut merkle_bytes).unwrap();

            //merkle.set_leaf(tree_address, previous_leaf, new_leaf, proof, node_index);



        },
        ProgramInstruction::AuthorizeView { tree_address, node_index } => todo!(),
    }
    /* let funder_info = next_account_info(account_info_iter)?;
    let merkle_info = next_account_info(account_info_iter)?;

    let mut merkle : ConcurrentMerkleTree<24, 1024> = ConcurrentMerkleTree::new();
    let initial_node = merkle.initialize().unwrap_or_else(|error| {
        //temp result handling
        return hashv(&[&[1,2,3], &[error as u8]]).to_bytes();
    }); */


    

    Ok(())
}