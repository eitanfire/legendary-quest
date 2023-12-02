// Tags.js
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "reactstrap";
import {
  selectGovernmentCourses,
  selectWorldHistoryCourses,
  selectUSHistoryCourses,
  selectGeographyCourses,
  selectMandatoryCourses,
  selectLanguageArtsCourses,
  selectElectiveCourses,
  selectAllCourses,
} from "../coursesSlice";
import { getClassCredit } from "./getClassCredit";
import CourseCard from "../CourseCard";
import LoadMoreCourses from "../LoadMoreCourses"; // Import LoadMoreCourses
import Credit from './Credit'

const Tags = () => {
  const [selectedTag, setSelectedTag] = useState("All courses");

  const handleCreditTagClick = (creditTag) => {
    setSelectedTag(creditTag === selectedTag ? "All courses" : creditTag);
  };

  const getTagClass = (creditTag) => {
    return (
      getClassCredit(creditTag) +
      (selectedTag === creditTag ? " active" : " disabled")
    );
  };

  const creditTags = [
    "All courses", // Added "All courses" option
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

      {selectedTag === "All courses" && (
        <CoursesList
          selector={getAllCoursesSelector()}
          renderLoadMore={true} // Render LoadMoreCourses for "All courses"
        />
      )}
      {selectedTag !== "All courses" && selectedTag !== null && (
        <CoursesList selector={getSelector(selectedTag)} />
      )}
    </div>
  );
};

const CoursesList = ({ selector, renderLoadMore }) => {
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

      {renderLoadMore && <LoadMoreCourses />}
    </div>
  );
};

const getSelector = (tag) => {
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

const getAllCoursesSelector = () => {
  // Return the selector for all courses
  return selectElectiveCourses; // Adjust this based on your actual data structure
};

export default Tags;
