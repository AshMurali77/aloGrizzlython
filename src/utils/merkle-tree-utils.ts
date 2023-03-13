import { MerkleTree, MerkleTreeProof } from "@solana/spl-account-compression";

function buildMerkleTree () : MerkleTree {
    let merkle = new MerkleTree(getLeavesFromFirebase());
    return merkle
}

function getLeavesFromFirebase () {
    return []
}

function supplyProof (merkle : MerkleTree, index : number) : MerkleTreeProof {
    return merkle.getProof(index);
}

function updateLeaf (merkle : MerkleTree, newLeaf : Buffer, index? : number) {
    if (index) {
        merkle.updateLeaf(index, newLeaf);
    }
    merkle.leaves.push()
}