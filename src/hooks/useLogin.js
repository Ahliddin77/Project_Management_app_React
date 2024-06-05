import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useState } from "react";
import { useGlobalContext } from "./useGlobalContext";
import toast from "react-hot-toast";

function useLogin() {
  const { dispatch } = useGlobalContext();
  const [user, setUser] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const loginWithEmail = async (email, password) => {
    setIsPending(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      dispatch({ type: "LOGIN", payload: user });
      setUser(user);
      setIsPending(false);
    } catch (error) {
      console.log(error.message);
      setIsPending(false);
      toast.error(error.message);
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    setIsPending(true);
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      // firebase own recomendation
      GoogleAuthProvider.credentialFromResult(user);
      dispatch({ type: "LOGIN", payload: user });
      setUser(user);
      setIsPending(false);
    } catch (error) {
      GoogleAuthProvider.credentialFromError(error);
      const errorMessage = error.message;
      console.log(errorMessage);
      toast.error(errorMessage);
      setIsPending(false);
    }
  };

  return { loginWithGoogle, loginWithEmail, isPending };
}

export { useLogin };
