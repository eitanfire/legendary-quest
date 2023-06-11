import { COURSES } from "../../../app/shared/COURSES";
import { useState, onKeyDown } from "react";

const Tags = () => {
  const { credit } = COURSES;
  const [input, setInput] = useState("");
  const [tags, setTags] = useState([]);
  const onChange = (e) => {
    const { value } = e.target;
    setInput(value);
    const onKeyDown = (e) => {
      const { key } = e;
      const trimmedInput = input.trim();

      if (key === "," && trimmedInput.length && !tags.includes(trimmedInput)) {
        e.preventDefault();
        setTags((prevState) => [...prevState, trimmedInput]);
        setInput("");
      }
    };
  };

  return (
    <div className="container">
      {tags.map((credit) => (
        <div className="tag">{credit}</div>
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
