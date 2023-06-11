import { COURSES } from "../../../app/shared/COURSES";
import React, { useState } from "react";

const Tags = () => {
  const { credit } = COURSES;
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
        <div className="tag" key={index}>
          {tag}
        </div>
      ))}
      <input
        value={input}
        placeholder="Enter a tag"
        onKeyDown={onKeyDown}
        onChange={onChange}
      />
    </div>
  );
};

export default Tags;