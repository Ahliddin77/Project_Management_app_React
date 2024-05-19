import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCYC5OJvsof4e_YESSgeBfFGmVBDj-OxlQ",
  authDomain: "react-project-manager-4c409.firebaseapp.com",
  projectId: "react-project-manager-4c409",
  storageBucket: "react-project-manager-4c409.appspot.com",
  messagingSenderId: "1085544357509",
  appId: "1:1085544357509:web:668458d9f720308f3613ec",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// auth
export const auth = getAuth(app);
