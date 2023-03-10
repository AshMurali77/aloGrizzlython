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
      metadata.customMetadata = { testing: "leaf" };
      const download = await getDownloadURL(item);
      console.log(download);
      file_data.push(metadata);
      download_data.push(download);
    })
  );
  console.log(file_data);
  return [file_data, download_data];
};

//Update custom metadata
export const updateFileData = async () => {};

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
