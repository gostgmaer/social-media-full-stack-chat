export const containerId = process.env.NEXT_PUBLIC_CONTAINER
export const tableId = process.env.NEXT_PUBLIC_TABLE
export const contactTable = "contacts"
export const mongourl = process.env.MONGODB_URI
export const baseurl = process.env.NEXT_PUBLIC_BASE_URL
export const secret = process.env.NEXT_PUBLIC_SECRET
export const appId = process.env.NEXT_PUBLIC_APP_ID
export const contactContiner = process.env.NEXT_PUBLIC_CONTAINER_CONTACT
export const projectContainer = process.env.NEXT_PUBLIC_CONTAINER_PROJECT
export const resumeContainer = process.env.NEXT_PUBLIC_CONTAINER_RESUME
export const propertyContainer = process.env.NEXT_PUBLIC_CONTAINER_PROPERTY
export const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY


import { initializeApp,getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import 'firebase/auth';
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
export const config = {
  apiKey: "AIzaSyA4YJGuYX1gH2Alg46ELUmFZoSECD8g7ik",
  authDomain: "development-382105.firebaseapp.com",
  projectId: "development-382105",
  storageBucket: "development-382105.appspot.com",
  messagingSenderId: "234636235499",
  appId: "1:234636235499:web:8060d54ef9ee9ac0bce4ae",
  databaseURL:
    "https://development-382105-default-rtdb.asia-southeast1.firebasedatabase.app",

};

export const app = initializeApp(config);

export const firebaseConfig = () => {
  const databaseApp = initializeApp(config);
  return getDatabase(databaseApp)
};

// export default firebaseConfig;


export const firebase_app = getApps().length === 0 ? initializeApp(config) : getApps()[0];

export const firebaseStorage = getStorage(app)
export const firebaseDatabaseConn = getStorage(app)