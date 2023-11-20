export function makeCopyOfWarmups(warmups) {
  // Use a regular expression to replace "edit" with "copy" in the URL
  const modifiedURL = warmups.replace(/\/edit(.*)/, "/copy$1");
  return modifiedURL;
}

export function makeCopyOfExtra(extra) {
  const modifiedURL = extra.replace(/\/edit(.*)/, "/copy$1");
  return modifiedURL;
}

export function makeCopyOfCurriculum(curriculum) {
  const modifiedURL = curriculum.replace(/\/edit(.*)/, "/copy$1");
  return modifiedURL;
}

export function makeCopyOfDescription(description) {
  const modifiedURL = description.replace(/\/edit(.*)/, "/copy$1");
  return modifiedURL;
}