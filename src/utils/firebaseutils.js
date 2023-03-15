import {
  ref,
  getDownloadURL,
  listAll,
  list,
  getMetadata,
  updateMetadata,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
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
export const uploadFiles = async (file, origin, student, index) => {
  let metadata = {};
  console.log("student", student);
  if (!file) return;
  let folder =
    origin == "students"
      ? "students"
      : origin == "files"
      ? "files"
      : "institution-two";
  const storageRef = ref(storage, `${folder}/${file.name}`);
  const [file_data, download_data, all_file_data, all_download_data] =
    await getFileData(folder);
  if (student.id != -1) {
    metadata = {
      customMetadata: {
        student_id: student.id,
        index: index || all_file_data.length,
      },
    };
  } else {
    metadata = {
      customMetadata: {
        student_id: student.id,
        index: index || all_file_data.length,
        leaf: String.fromCharCode.apply(String, Buffer.alloc(32, 0)),
      },
    };
  }

  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  student.id != -1 &&
    uploadTask.then(() => {
      updateFileData(uploadTask.snapshot.metadata.fullPath);
    });
  return folder;
};

//replace student in storage
export const replaceFile = async (replacementFile, origin, student) => {
  let storageRef = "";
  let folder = origin == "students" ? "students" : "institution-two";
  const [file_data] = await getFileData(origin);
  file_data.map(async (file) => {
    if (student.id == file.customMetadata.student_id) {
      const index = file.customMetadata.index;
      await uploadFiles(replacementFile, folder, student, index);
      storageRef = ref(storage, file.fullPath);
      await deleteObject(storageRef)
        .then(() => {
          console.log("file deleted successfully");
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  });
};

//add student to db/modify if student already exists
export const addStudentData = (file, origin) => {
  const reader = new FileReader();
  let values = {};

  reader.onload = async (e) => {
    const contents = e.target.result;

    const lines = contents.split("\n").filter((line) => line.trim() !== "");

    for (let i = 0; i < lines.length; i += 2) {
      const header = lines[i].trim();
      const value = lines[i + 1].trim();

      switch (header) {
        case "Institution":
          values.institution = value;
          break;
        case "Classification":
          values.classification = value;
          break;
        case "credits":
          values.credits = parseInt(value);
          break;
        case "First Name":
          values.firstName = value;
          break;
        case "ID":
          values.id = value;
          break;
        case "Last Name":
          values.lastName = value;
          break;
        case "Major":
          values.major = value;
          break;
        default:
          break;
      }
    }

    console.log(values);
    await setDoc(doc(db, origin, values.id), {
      Institution: values.institution,
      classification: values.classification,
      credits: values.credits,
      firstName: values.firstName,
      id: values.id,
      lastName: values.lastName,
      major: values.major,
    });
  };

  reader.readAsText(file);
  return values;
};

//delete student from storage and db
export const deleteStudent = async (origin, id) => {
  let storageRef = "";
  //delete from db
  await deleteDoc(doc(db, origin, id));
  //delete from firebase storage
  const [file_data] = await getFileData(origin);
  file_data.map(async (file) => {
    if (id == file.customMetadata.student_id) {
      const index = file.customMetadata.index;
      const newFile = new File([""], `dead${index}.txt`, {
        type: "text/plain",
      });
      await uploadFiles(newFile, origin, { id: "-1" }, index);
      storageRef = ref(storage, file.fullPath);
      await deleteObject(storageRef)
        .then(() => {
          console.log("file deleted successfully");
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  });
};

//Fetch files from storage
export const getFileData = async (origin) => {
  let all_file_data = [];
  let all_download_data = [];
  let file_data = [];
  let download_data = [];
  const storageRef = ref(storage, `${origin}/`);
  const files = await listAll(storageRef);
  await Promise.all(
    files.items.map(async (item) => {
      const metadata = await getMetadata(item);
      const download = await getDownloadURL(item);
      /*       metadata.customMetadata = {
        leaf: String.fromCharCode(
          ...keccak_256.digest(
            Buffer.concat([
              Buffer.from(metadata.name),
              Buffer.from(download),
              Buffer.from(origin),
            ])
          )
        ),
      }; */
      //console.log(download);
      if (metadata.name.substring(0, 4) != "dead") {
        file_data.push(metadata);
        download_data.push(download);
      }
      all_file_data.push(metadata);
      all_download_data.push(download);
    })
  );
  console.log("file data", file_data);
  return [file_data, download_data, all_file_data, all_download_data];
};

//Fetch a specific student's files form storage
export const getStudentFileData = async (id) => {
  let file_data = [];
  let download_data = [];
  const storageRef = ref(storage, `students/`);
  const files = await listAll(storageRef);
  await Promise.all(
    files.items.map(async (item) => {
      const metadata = await getMetadata(item);
      const download = await getDownloadURL(item);
      if (metadata.customMetadata.student_id == id) {
        file_data.push(metadata);
        download_data.push(download);
      }
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
