import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
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
  const [tags, setTags] = useState([]);

  const handleCreditTagClick = (creditTag) => {
    // Toggle the credit tag in the list
    setTags((prevTags) =>
      prevTags.includes(creditTag)
        ? prevTags.filter((tag) => tag !== creditTag)
        : [...prevTags, creditTag]
    );
  };

  const getTagClass = (creditTag) => {
    // Return the appropriate class based on whether the tag is active
    return (
      getClassCredit(creditTag) + (tags.includes(creditTag) ? " active" : "")
    );
  };

  const creditTags = [
    "Government",
    "World History",
    "US History",
    "Geography",
    "Language Arts",
  ];

  return (
    <div className="container">
      <Row className="m-4">
        {creditTags.map((creditTag, index) => (
          <Col key={index}>
            <label className={`credit-tag ${getTagClass(creditTag)}`}>
              {creditTag}
              <input
                type="checkbox"
                checked={tags.includes(creditTag)}
                onChange={() => handleCreditTagClick(creditTag)}
              />
            </label>
          </Col>
        ))}
      </Row>
      {tags.map((tag) => (
        <CoursesList key={tag} selector={getSelector(tag)} />
      ))}
    </div>
  );
};

const CoursesList = ({ selector }) => {
  const { freeItem, isLoading, errMsg } = useSelector(selector);

  return (
    <div>
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
    </div>
  );
};

const getSelector = (tag) => {
  // Return the appropriate selector based on the tag
  switch (tag) {
    case "Government":
      return selectGovernmentCourses;
    case "World History":
      return selectWorldHistoryCourses;
    case "US History":
      return selectUSHistoryCourses;
    case "Geography":
      return selectGeographyCourses;
    case "Mandatory":
      return selectMandatoryCourses;
    case "Language Arts":
      return selectLanguageArtsCourses;
    default:
      return null;
  }
};

export default Tags;
