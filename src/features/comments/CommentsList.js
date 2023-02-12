import CommentForm from './CommentForm';
import { Col } from "reactstrap";
import { COMMENTS } from "../../app/shared/COMMENTS";
import Comment from "./Comment";
import { selectAllComments } from "./commentsSlice";

const CommentsList = () => {
  const comments = selectAllComments();
  return (
    <Col className="mt-4">
      {COMMENTS.map((take) => {
        return (
          <div className="d-flex mb-5" key={take.id}>
            <Comment comment={comment} />
          </div>
        );
      })}
      <CommentForm courseId={courseId} />
    </Col>
  );
};

export default CommentsList;