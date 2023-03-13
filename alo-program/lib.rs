mod entrypoint;
pub mod processor;
pub mod instruction;
//pub mod state;

solana_program::declare_id!("4XS8Hp1sUMUKYZJDPNM9ZivQqS5pjPyx2BGMzAYJxppZ");


#[cfg(test)]
mod tests {
    use spl_concurrent_merkle_tree::concurrent_merkle_tree::ConcurrentMerkleTree;
    use std::mem::size_of;
    use solana_program::{keccak::hashv,sysvar::rent::Rent,};
    //use crate::state::{DocTree, Changelog, RightmostProof};


    #[test]
    pub fn it_works() {
        let mut merkle : ConcurrentMerkleTree<24,1024> = ConcurrentMerkleTree::new();
        let size = size_of::<ConcurrentMerkleTree<24,1024>>();
        let rent = Rent::default();
        let root = merkle.initialize().unwrap();
        let new_node = merkle.append(hashv(&[&[1,2,3,4,5]]).to_bytes()).unwrap();

        /*let rightmost_proof_struct = RightmostProof {proof : merkle.rightmost_proof.proof, leaf : merkle.rightmost_proof.leaf, index : merkle.rightmost_proof.index};
        let mut changelog_array = [Changelog::default(); 1024];
        changelog_array[0] = Changelog {root : merkle.get_change_log().root, path : merkle.get_change_log().path, index : merkle.get_change_log().index};
        let tree_struct = DocTree {root : root ,rightmost_proof : rightmost_proof_struct, change_logs : changelog_array, authority : id().to_bytes()};
        */
        println!("Merkle Tree Size: {:?}", size);
        println!("Merkle Tree Rent: {:?}", rent.minimum_balance(size));
        println!("Merkle Tree Initial Root: {:?}", root);
        println!("Root from tree: {:?}", merkle.get_root());
        println!();
        println!();
        println!("Appended Node: {:?}", new_node);
        println!();
        println!();
        println!("Changelog: {:?}", merkle.get_change_log());
        println!();
        println!();
        println!("Node Proof: {:?}", merkle.rightmost_proof);

    }
}
