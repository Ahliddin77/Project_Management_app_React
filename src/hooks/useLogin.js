import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
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
    } catch (error) {
      console.log(error.message);
      setIsPending(false);
      toast.error(errorMessage);
    }
  };

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        const user = result.user;
        dispatch({ type: "LOGIN", payload: user });
        setUser(user);
      })
      .catch((error) => {
        const errorMessage = error.message;
        const credential = GoogleAuthProvider.credentialFromError(error);
        alert(errorMessage);
      });
  };

  return { loginWithGoogle, user };
}

export default useLogin;
