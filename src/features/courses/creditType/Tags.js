import React, { useState } from "react";
import Credit from "../../../Credit.css";
import { fetchCourses } from "../coursesSlice";

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

  return (
    <div className="container">
      {tags.map((tag, index) => (
        <div className={`tag ${tag}Credit`} key={index}>
          {tag}
        </div>
      ))}
      <input
        value={input}
        placeholder="Enter a tag"
        onKeyDown={onKeyDown}
        onChange={onChange}
        className={`credit ${input}Credit`}
      />
    </div>
  );
};

export default Tags;
