export function makeCopyOfWarmups(warmups) {
  // Use a regular expression to replace "edit" with "copy" in the URL
  const modifiedURL = warmups.replace(/\/edit(.*)/, "/copy$1");
  return modifiedURL;
}

export function makeCopyOfExtra(extra) {
  // Use a regular expression to replace "edit" with "copy" in the URL
  const modifiedURL = extra.replace(/\/edit(.*)/, "/copy$1");
  return modifiedURL;
}

export function makeCopyOfCurriculum(curriculum) {
  // Use a regular expression to replace "edit" with "copy" in the URL
  const modifiedURL = curriculum.replace(/\/edit(.*)/, "/copy$1");
  return modifiedURL;
}