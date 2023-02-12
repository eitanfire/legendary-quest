import useState from 'react';
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";

const CommentForm = ({courseId}) => 
[modalOpen, setModalOpen] = useState(false)
{
return (
  <>
    <Button outline onClick={() => setModalOpen(true)}>
      <i className="fa fa-pencil fa-lg" /> Add Comment
    </Button>
    <Modal isOpen={modalOpen}>
      <ModalHeader toggle={() => setModalOpen(false)}>Add Comment</ModalHeader>
      <ModalBody>course: {courseId}</ModalBody>
    </Modal>
  </>
);
}

export default CommentForm;;