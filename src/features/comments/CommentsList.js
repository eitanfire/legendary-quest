import { useSelector } from "react-redux";
import { Col, Row } from "reactstrap";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { selectCommentsByCourseId } from "./commentsSlice";
import Error from "../../components/Error";
import Loading from "../../components/Loading";
import {  } from "reactstrap";

const CommentsList = ({ courseId }) => {
  const comments = useSelector(selectCommentsByCourseId(courseId));

  const isLoading = useSelector((state) => state.comments.isLoading);
  const errMsg = useSelector((state) => state.comments.errMsg);

  if (isLoading) {
    return (
      <Row>
        <Loading />
      </Row>
    );
  }

  if (errMsg) {
    return (
      <Row>
        <Error errMsg={errMsg} />
      </Row>
    );
  }

  if (comments && comments.length > 0) {
    return (
      <Col md="5" className="m-1">
        <h4>Comments</h4>
        {comments.map((comment) => {
          return <Comment key={comment.id} comment={comment} />;
        })}
        <CommentForm courseId={courseId} />
      </Col>
    );
  }
  
  return (
    <Col md="5" className="m-1">
      There are no comments for this course yet.
    </Col>
  );
};

export default CommentsList;