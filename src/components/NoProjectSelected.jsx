import { useState, useEffect, useRef } from "react";
import noProjectImage from "../assets/no-projects.png";
import Button from "./Button";
import RandomQuote from "./RandomQuotes";

export default function NoProjectSelected({ onStartAddProject }) {
  const [showQuote, setShowQuote] = useState(false);
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const hasFetchedQuote = useRef(false);

  const fetchQuote = async () => {
    try {
      const response = await fetch("https://api.quotable.io/random");
      if (!response.ok) {
        throw new Error("Failed to fetch quote");
      }
      const data = await response.json();
      setQuote(data.content);
      setAuthor(data.author);
    } catch (error) {
      console.error("Error fetching the quote: ", error);
    }
  };

  useEffect(() => {
    if (!hasFetchedQuote.current) {
      fetchQuote();
      hasFetchedQuote.current = true;
    }
  }, []);

  return (
    <div className="mt-24 text-center w-2/3">
      {showQuote ? (
        <RandomQuote onBack={() => setShowQuote(false)} />
      ) : (
        <>
          <img
            src={noProjectImage}
            alt="empty task list"
            className="w-16 h-16 object-contain mx-auto"
          />
          <h2 className="text-xl font-bold text-stone-500 my-4">
            No Project Selected
          </h2>
          <p className="text-stone-400 mb-4">
            Select a project or get started with a new one
          </p>
          <p className="mt-8">
            <Button onClick={onStartAddProject}>Create new project</Button>
          </p>
          <p className="mt-8">
            <Button onClick={() => setShowQuote(true)}>Get more Quotes</Button>
          </p>
          <div className="w-200 h-48 mx-auto flex justify-center items-center">
            <p className="text-3xl italic mt-8 font-serif">{quote}</p>
          </div>
          <h5 className="mt-6 text-lg font-bold">- {author}</h5>
        </>
      )}
    </div>
  );
}
