import { COMMENTS } from "../../app/shared/COMMENTS";

export const selectAllComments = () => {
  return COMMENTS;
};

export const selectFeaturedComment = () => {
  return COMMENTS.find((comment) => comment.featured);
};

export const selectCommentsByCourseId = (courseId) => {
  return COMMENTS.filter((comment) => comment.courseId === parseInt(courseId));
};