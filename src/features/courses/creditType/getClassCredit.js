export const getClassCredit = (type) => {
  switch (type) {
    case "All Courses":
      return "allCoursesCredit";
    case "World History":
      return "worldHistoryCredit";
    case "US History":
      return "uSHistoryCredit";
    case "Geography":
      return "geographyCredit";
    case "Government":
      return "governmentCredit";
    case "Mandatory":
      return "mandatoryCredit";
    case "Language Arts":
      return "lACredit";
    default:
      return "Elective";
  }
};
