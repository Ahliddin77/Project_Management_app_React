import React, { useState, useEffect, useRef } from "react";

function RandomQuote({ onBack }) {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [tags, setTags] = useState([]);
  const hasFetchedQuote = useRef(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("https://api.quotable.io/tags");
        if (!response.ok) {
          throw new Error("Failed to fetch tags");
        }
        const data = await response.json();

        // Extract tag names from the object values
        const tagNames = Object.values(data).map((tag) => tag.name);
        setTags(tagNames);
      } catch (error) {
        console.error("Error fetching tags: ", error);
      }
    };
    fetchTags();

    // Fetch a quote when the component mounts
    if (selectedTag) {
      fetchQuote();
    }
  }, [selectedTag]);

  useEffect(() => {
    // Fetch a quote when the component mounts
    if (!hasFetchedQuote.current) {
      fetchQuote();
      hasFetchedQuote.current = true;
    }
  }, [selectedTag]);

  const fetchQuote = async () => {
    try {
      const response = await fetch(
        `https://api.quotable.io/random?tags=${selectedTag}`
      );
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

  return (
    <div className="text-center pl-10">
      <button
        onClick={onBack}
        className="absolute top-0 right-0 mt-16 mr-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
      >
        Back
      </button>
      <div className="w-200 h-48 mx-auto flex justify-center items-center">
        <p className="text-3xl italic mt-8 font-serif">{quote}</p>
      </div>
      <h5 className="mt-6 text-lg font-bold">- {author}</h5>
      <div className="flex justify-center mt-8">
        <button
          onClick={fetchQuote}
          className="px-6 py-3 mr-4 bg-black text-white rounded-lg hover:bg-gray-900"
        >
          Get Another Quote
        </button>
        <div className="selected-tag py-3 px-4 bg-gray-200 text-gray-800 rounded-lg">
          Selected Tag: {selectedTag ? `#${selectedTag}` : "None"}
        </div>
      </div>
      <div className="tag-buttons mt-8">
        {tags.slice(0, tags.length - 1).map((tag, index) => (
          <button
            key={index}
            className="text-xs tag-button px-2 py-1 border border-gray-400 rounded-lg focus:outline-none mr-1 mb-1"
            onClick={() => setSelectedTag(tag)}
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
}

export default RandomQuote;
