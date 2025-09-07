import { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  FormGroup,
  Label,
  Col,
} from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { validateCommentForm } from "../../utils/validateCommentForm";
import { useDispatch } from "react-redux";

const CommentForm = ({ courseId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = (values) => {
    const comment = {
      courseId: parseInt(courseId),
      rating: values.rating,
      author: values.author,
      text: values.commentText,
      date: new Date(Date.now()).toISOString(),
    };

    console.log("comment", comment);
    // dispatch(postComment(comment));

    setCommentSubmitted(true);
    setModalOpen(false);
    setSuccessModalOpen(true);
  };

  const closeSuccessModal = () => {
    setSuccessModalOpen(false);
  };

  return (
    <>
      <Button outline onClick={() => setModalOpen(true)}>
        <i className="fa fa-pencil fa-lg" /> Add Comment
      </Button>
      <Modal isOpen={modalOpen}>
        <ModalHeader toggle={() => setModalOpen(false)}>
          Add Comment
        </ModalHeader>
        <ModalBody>
          {commentSubmitted && (
            <p className="text-success">Thank you for your comment!</p>
          )}
          <Formik
            initialValues={{
              rating: undefined,
              author: "",
              commentText: "",
            }}
            onSubmit={handleSubmit}
            validate={validateCommentForm}
          >
            <Form>
              <FormGroup>
                <Label htmlFor="rating">Rating</Label>
                <Field name="rating" as="select" className="form-control">
                  <option>Select...</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </Field>
                <ErrorMessage name="rating">
                  {(msg) => <p className="text-danger">{msg}</p>}
                </ErrorMessage>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="author">Your Name</Label>
                <Field
                  name="author"
                  placeholder="Your Name"
                  className="form-control"
                />
                <ErrorMessage name="author">
                  {(msg) => <p className="text-danger">{msg}</p>}
                </ErrorMessage>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="commentText">Comment</Label>
                <Field
                  name="commentText"
                  as="textarea"
                  rows="12"
                  className="form-control"
                />
              </FormGroup>
              <Col xs={{ size: 10, offset: 5 }}>
                <Button type="submit" color="primary">
                  Submit
                </Button>
              </Col>
            </Form>
          </Formik>
        </ModalBody>
      </Modal>
      <Modal isOpen={successModalOpen} toggle={closeSuccessModal}>
        <ModalHeader toggle={closeSuccessModal}>
          Comment Submitted Successfully!
        </ModalHeader>
        <ModalBody>
          <p className="text-success">Thank you for your comment!</p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={closeSuccessModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default CommentForm;
