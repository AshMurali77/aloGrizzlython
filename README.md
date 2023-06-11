# ALO - Solana Student Record Dashboard

ALO is a project developed during the Solana Grizzlython, a hackathon focused on building applications on the Solana blockchain. ALO is a student record dashboard that enables students and educational institutions to upload, transfer, and delete student records securely. The project combines the power of React, Rust, the Solana account compression program, the Solana web3js library, Firebase Storage, and Cloud Firestore to provide a seamless and decentralized educational record management solution.

## Features

- **Student Record Management**: ALO allows students and institutions to manage student records efficiently. Users can upload, transfer, and delete records seamlessly through the user-friendly dashboard.

- **Solana Blockchain Integration**: ALO's backend is built using rust and the frontend leverages the Solana web3js library to interact with the Solana blockchain. This integration enables on-chain storage of educational records, providing immutability and transparency.

- **Firebase Storage**: ALO utilizes Firebase Storage to securely store the uploaded student record files. This ensures that the records are accessible and protected from unauthorized access.

- **Cloud Firestore**: The student data associated with each record is stored in Cloud Firestore, a flexible and scalable NoSQL database provided by Firebase. This allows for efficient retrieval and management of student information.

- **Solana Account Compression Library**: ALO implements the Solana account compression library to synchronize changes made to the student record information in Firebase with the on-chain data. This integration ensures that the educational records remain consistent and up-to-date on the Solana blockchain.

## Technologies Used

- React: ALO's frontend is built using React and Material UI, providing sleek styling and functionality to the project.

- Solana web3js Library: ALO utilizes the Solana web3js library to interact with the Solana blockchain. This library provides an interface for sending transactions, querying on-chain data, and managing accounts on the Solana network.

- Firebase Storage: ALO leverages Firebase Storage to store the uploaded student record files securely. Firebase Storage provides easy-to-use APIs for uploading and managing files in the cloud.

- Cloud Firestore: ALO uses Cloud Firestore, a flexible and scalable NoSQL database, to store the student data associated with each record. Cloud Firestore allows for efficient querying and retrieval of student information.

- Solana Account Compression Library: ALO implements the Solana account compression library to synchronize changes between the Firebase records and the on-chain data. This library optimizes the storage and transmission of the educational records by implementing concurrent merkle trees to sync on and off chain state. 

## Installation

To run the client-side of ALO locally (not including the Solana program), follow these steps:

1. Clone the repository: `git clone https://github.com/your/repo.git`.
2. Navigate to the project directory: `cd ALO`.
3. Install the dependencies: `npm install`.
4. Set up your Firebase project and obtain the necessary credentials.
5. Update the Firebase configuration in the code to match your project credentials.
6. Build and run the project: `npm start`.
7. Access the application at `http://localhost:3000` in your web browser.


## Usage

Once the ALO application is running, you can access the student record dashboard in your web browser. The dashboard provides a user-friendly interface for managing student records.

- **Upload**: Click on the "Upload" button to add a new student record. Fill in the required details and attach the relevant file. The record will be securely stored in Firebase Storage, and the associated data will be saved in Cloud Firestore.

- **Transfer**: Transfer student records from one institution to another by selecting the desired records and specifying the recipient institution. ALO will update the on-chain information and sync the changes with Firebase.

- **Delete**: Remove student records from the dashboard by Clicking the Delete Button. 

## Contact

For any inquiries or feedback, please contact ashmurali77@gmail.com -- I'd love to chat!
