export const getClassCredit = (credit) => {
  const creditClasses = credit.map((type) => {
    switch (type) {
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
        return "electiveCredit";
    }
  });

  return creditClasses;
};