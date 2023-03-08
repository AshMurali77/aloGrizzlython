// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDytsvcpigQflPy6L7bQgr-tpx91gw8FgU",
  authDomain: "aloblockchain.firebaseapp.com",
  projectId: "aloblockchain",
  storageBucket: "aloblockchain.appspot.com",
  messagingSenderId: "337218658216",
  appId: "1:337218658216:web:7ab6da747d5d87d578079d",
};

// Use this to initialize the firebase App
const firebaseApp = initializeApp(firebaseConfig);

// Use this for storage
const storage = getStorage(firebaseApp);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(firebaseApp);

export { firebaseApp, storage, db };
