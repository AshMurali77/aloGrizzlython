import * as web3 from "@solana/web3.js";
import { keccak256 } from "js-sha3";

//Called by Home institution to authorize view access on document to receiving institution
export function checkToken(studentKey, schoolKey, authToken, docId) {
  return (authToken = keccak256(docId, studentKey));
}

//Called by receiving institution to then check against home institution
export function receiveToken(authToken, docID, studentKey, schoolKey) {
  checkToken();
}

//Called by student to request view access for external institution on record
export function requestToken(docID) {
  console.log(docID);
  //Web 3 call to on chain contract
}
