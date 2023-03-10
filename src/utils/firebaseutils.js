import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  listAll,
  getMetadata,
  updateMetadata,
} from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";
import { storage, db } from "../firebase";
import { Buffer } from "buffer";
import { keccak_256 } from "js-sha3";
//Upload file to storage
export const uploadFiles = (file) => {
  if (!file) return;
  const storageRef = ref(storage, `files/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",

    (error) => console.log(error),
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log("File available at", downloadURL);
      });
    }
  );
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
        leaf: Buffer.from(
          keccak_256.digest(
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
  const storageRef = ref(storage, `${path}/`);
  // Create file metadata with property to modify
  const newMetadata = {
    customMetadata: { leaf: "new leaf" },
  };

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
export const getStudentData = async () => {
  let student_data = [];
  const students = await getDocs(collection(db, "students"));
  students.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    student_data.push(doc.data());
  });
  console.log(student_data);
  return student_data;
};
