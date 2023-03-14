import {
  ref,
  getDownloadURL,
  listAll,
  list,
  getMetadata,
  updateMetadata,
  uploadBytesResumable,
} from "firebase/storage";
import { collection, getDocs, query, where } from "firebase/firestore";
import { storage, db } from "../firebase";
import { Buffer } from "buffer";
import { keccak_256 } from "js-sha3";
import { merkleKeypair, localKeypair } from "./web3utils";

//Fetch relevant metadata for a file
export const getFileMetadata = async (storageRef) => {
  const download = await getDownloadURL(storageRef);
  const metadata = await getMetadata(storageRef);
  return {
    download,
    name: metadata.name,
    creator: "students",
    authority: "files",
    index: metadata.customMetadata.index,
  };
};

//Create leaf as custom metadata for a file
export const createLeaf = async (storageRef) => {
  const { download, name, creator, authority, index } = await getFileMetadata(
    storageRef
  );
  console.log(download, name, creator, authority, index);
  const data_hash = String.fromCharCode(
    ...keccak_256.digest(
      Buffer.concat([
        Buffer.from(download),
        Buffer.from(name),
        Buffer.from(creator),
        Buffer.from(authority),
        Buffer.from(index),
      ])
    )
  );
  const leaf = String.fromCharCode(
    ...keccak_256.digest(
      Buffer.concat([
        Buffer.from(data_hash),
        Buffer.from(merkleKeypair.publicKey.toBase58()),
        Buffer.from(localKeypair.publicKey.toBase58()),
        //Add student keypair
      ])
    )
  );
  return leaf;
};

//Upload file to storage
export const uploadFiles = async (file, origin, student) => {
  if (!file) return;
  let folder =
    origin == "students"
      ? "students"
      : origin == "files"
      ? "files"
      : "institution-two";
  const storageRef = ref(storage, `${folder}/${file.name}`);
  const [file_data] = await getFileData(folder);
  const metadata = {
    customMetadata: {
      student_id: student.id,
      index: file_data.length,
    },
  };
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  uploadTask.then(() => {
    updateFileData(uploadTask.snapshot.metadata.fullPath);
  });
};

//Fetch files from storage
export const getFileData = async (origin) => {
  let file_data = [];
  let download_data = [];
  const storageRef = ref(storage, `${origin}/`);
  const files = await listAll(storageRef);
  await Promise.all(
    files.items.map(async (item) => {
      const metadata = await getMetadata(item);
      const download = await getDownloadURL(item);
      metadata.customMetadata = {
        leaf: String.fromCharCode(
          ...keccak_256.digest(
            Buffer.concat([
              Buffer.from(metadata.name),
              Buffer.from(download),
              Buffer.from(origin),
            ])
          )
        ),
      };
      //console.log(download);
      file_data.push(metadata);
      download_data.push(download);
    })
  );
  console.log("file data", file_data);
  return [file_data, download_data];
};

//Update custom metadata
export const updateFileData = async (path) => {
  let newMetadata = {};
  const origin = path;
  const storageRef = ref(storage, `${origin}`);
  const file = await listAll(storageRef);
  console.log(file);
  const download = await getDownloadURL(storageRef);
  const metadata = await getMetadata(storageRef);
  const leaf = await createLeaf(storageRef);

  newMetadata = {
    customMetadata: {
      leaf: leaf,
    },
  };
  console.log("new metadata", newMetadata);
  // Update the metadata property
  await updateMetadata(storageRef, newMetadata)
    .then((metadata) => {
      console.log("metadata", metadata);
    })
    .catch((error) => {
      console.log("error", error);
    });
};

//Fetch students from cloud db
export const getStudentData = async (origin) => {
  let student_data = [];
  const students = await getDocs(collection(db, origin));
  students.forEach((doc) => {
    student_data.push(doc.data());
  });
  return student_data;
};
