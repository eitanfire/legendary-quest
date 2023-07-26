import React, { useState } from "react";
import "../../../Credit.css";
import { fetchCourses } from "../coursesSlice";
import { getClassCredit } from "./getClassCredit";
import Credit from "./Credit"; // Update the import statement

const Tags = () => {
  const { credit } = fetchCourses;
  const [input, setInput] = useState("");
  const [tags, setTags] = useState([]);

  const onChange = (e) => {
    setInput(e.target.value);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      const trimmedInput = input.trim();
      if (trimmedInput && !tags.includes(trimmedInput)) {
        setTags((prevState) => [...prevState, trimmedInput]);
        setInput("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags((prevState) => prevState.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="container">
      {tags.map((tag, index) => (
        <div className={`tag ${getClassCredit(tag)}`} key={index}>
          <Credit course={tag} />
          <button className="remove-button" onClick={() => removeTag(tag)}>
            X
          </button>
        </div>
      ))}
      <input
        value={input}
        placeholder="Search Courses"
        onKeyDown={onKeyDown}
        onChange={onChange}
        className={`credit ${getClassCredit(input)}`}
      />
    </div>
  );
};

export default Tags;
