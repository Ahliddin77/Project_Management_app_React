// react imports
import { useEffect, useState } from "react";

// firebase imports
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";

function useCollection(collectionName, userQuery) {
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    let q;

    if (userQuery[2]) {
      q = query(collection(db, collectionName), where(...userQuery));
      onSnapshot(q, (querySnapshot) => {
        const tasks = [];
        querySnapshot.forEach((doc) => {
          tasks.push({ id: doc.id, ...doc.data() });
        });
        setProjects(tasks);
      });
    }
  }, [collectionName, userQuery[2]]);

  return { projects };
}

export { useCollection };
