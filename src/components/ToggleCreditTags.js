import { useState } from "react";

const ToggleCreditTags = ({ course }) => {
  const { id, credit } = course;

  const [creditTag, showCreditTag] = useState(false);
  const toggleTags = (CoursesList) => {
    if (creditTag === false) {
      showCreditTag(true);
    } else {
      showCreditTag(false);
    }
  };

  return (
    <div className={`App ${creditTag}`} onClick={toggleTags}>
      {creditTag === false ? {} : (credit = { credit, id })}
      <button>
        <i className="fa fa-lightbulb-o fa-lg" />
      </button>
    </div>
  );
};

// export default ToggleCreditTags;
