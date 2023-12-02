import React, { useState } from "react";
import { Credit } from "./Credit";
import { useSelector } from "react-redux";
import { Row, Col } from "reactstrap";
import {
  selectGovernmentCourses,
  selectWorldHistoryCourses,
  selectUSHistoryCourses,
  selectGeographyCourses,
  selectMandatoryCourses,
  selectLanguageArtsCourses,
} from "../coursesSlice";
import { getClassCredit } from "./getClassCredit";
import CourseCard from "../CourseCard";

const Tags = () => {
  const [selectedTag, setSelectedTag] = useState(null);

  const handleCreditTagClick = (creditTag) => {
    // Set the selected tag
    setSelectedTag(creditTag);
  };

  const getTagClass = (creditTag) => {
    // Return the appropriate class based on whether the tag is active
    return (
      getClassCredit(creditTag) + (selectedTag === creditTag ? " active" : "")
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
                type="radio"
                name="creditTag"
                checked={selectedTag === creditTag}
                onChange={() => handleCreditTagClick(creditTag)}
              />
            </label>
          </Col>
        ))}
      </Row>

      {selectedTag && <CoursesList selector={getSelector(selectedTag)} />}
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
