import React, { useState } from "react";
import { useSelector } from "react-redux"; // Import useSelector from react-redux
import "../../../Credit.css";
import {
  fetchCourses,
  selectGovernmentCourses,
  selectWorldHistoryCourses,
  selectUSHistoryCourses,
  selectGeographyCourses,
  selectMandatoryCourses,
  selectLanguageArtsCourses,
} from "../coursesSlice";
import { getClassCredit } from "./getClassCredit";
import Credit from "./Credit";
import CourseCard from "../CourseCard";
import { Row, Col } from "reactstrap";

const Tags = () => {
  // const { credit } = fetchCourses();
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

      {/* Display courses based on the selected tags */}
      {tags.map((tag) => {
        switch (tag) {
          case "Government":
            return <CoursesList key={tag} selector={selectGovernmentCourses} />;
          case "World History":
            return (
              <CoursesList key={tag} selector={selectWorldHistoryCourses} />
            );
          case "US History":
            return <CoursesList key={tag} selector={selectUSHistoryCourses} />;
          case "Geography":
            return <CoursesList key={tag} selector={selectGeographyCourses} />;
          case "Mandatory":
            return <CoursesList key={tag} selector={selectMandatoryCourses} />;
          case "Language Arts":
            return (
              <CoursesList key={tag} selector={selectLanguageArtsCourses} />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

// Extracted component to display courses based on the selector
const CoursesList = ({ selector }) => {
  const { freeItem, isLoading, errMsg } = useSelector(selector);

  return (
    <div>
      {/* Display courses based on the selector */}
      {isLoading ? (
        <p>Loading...</p>
      ) : errMsg ? (
        <p>Error: {errMsg}</p>
      ) : (
        <Row>
          {freeItem.map((course, id) => (
            <Col md="5" className="m-4" key={id}>
              <CourseCard course={course}>{course}</CourseCard>
            </Col>
          ))}
        </Row>
      )}
      ;
    </div>
  );
    {
    }
};

export default Tags;
