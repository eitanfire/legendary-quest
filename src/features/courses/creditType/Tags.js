import React, { useState } from "react";
import "../../../Credit.css";
import { fetchCourses } from "../coursesSlice";
import { getClassCredit } from "./getClassCredit";
import { Col } from "reactstrap";
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

  return (
    <div className="container">
      {tags.map((tag, index) => (
        <div className={`tag ${getClassCredit(tag)}`} key={index}>
          <Credit course={tag} /> {/* Pass the tag as the course prop */}
        </div>
      ))}
      <input
        value={input}
        placeholder="Enter a tag"
        onKeyDown={onKeyDown}
        onChange={onChange}
        className={`credit ${getClassCredit(input)}`}
      />
    </div>
  );
};

export default Tags;
