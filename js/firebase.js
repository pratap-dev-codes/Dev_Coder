
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDMs_fQN_-DGGZiysES8wjpbgd2nWpEsaE",
  authDomain: "khudkamao-official.firebaseapp.com",
  projectId: "khudkamao-official",
  storageBucket: "khudkamao-official.appspot.com",
  messagingSenderId: "786162192164",
  appId: "1:786162192164:web:ece61c3f2c005760be6db1",
  measurementId: "G-FVL1JFDCPZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

async function uploadProfilePicture(uid, file) {
  const storageRef = ref(storage, `profile_pictures/${uid}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

export { auth, db, storage, uploadProfilePicture };
