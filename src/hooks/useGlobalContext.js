import { GlobalContext } from "../context/globalContext";
import { useContext } from "react";

export function useGlobalContext() {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error(
      "useGlobalContext() must be in the GlobalContextPRovider()"
    );
  }

  return context;
}
