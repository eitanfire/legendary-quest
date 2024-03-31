import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Col,
} from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { validateSignUpForm } from "../utils/validateSignUpForm";
import NotificationForm from "./NotificationForm";

const SignUpForm = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const handleCopyClick = () => {
    const emailInput = document.getElementById("emailInput");
    emailInput.select();
    document.execCommand("copy");
    emailInput.setSelectionRange(0, 0);
  };

  const handleSubmit = (values, { resetForm }) => {
    console.log("form values:", values);
    console.log("in JSON format:", JSON.stringify(values));
    resetForm();
    toggleModal();
  };

  return (
    <div>
      <FormGroup row>
        <Col></Col>
        <Col
        // md={{ size: 10, offset: 2 }}
        >
          <Button
            className="btn btn-primary btn-lg btn-block"
            role="button"
            type="submit"
            color="primary"
            onClick={toggleModal}
          >
            Sign Up
          </Button>
        </Col>
      </FormGroup>
      <Modal
        className="register-message"
        isOpen={isModalOpen}
        toggle={toggleModal}
      >
        <ModalHeader toggle={toggleModal}>Create an Account</ModalHeader>
        <ModalBody>
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              phoneNum: "",
              email: "",
              agree: true,
              contactType: "By Email",
              feedback: "",
            }}
            onSubmit={handleSubmit}
            validate={validateSignUpForm}
          >
            {({ handleSubmit }) => (
              <Form>
                <FormGroup row>
                  <Label htmlFor="firstName" md="2">
                    First Name
                  </Label>
                  <Col md="10">
                    <Field
                      name="firstName"
                      placeholder="First Name"
                      className="form-control"
                    />
                    <ErrorMessage name="firstName">
                      {(msg) => <p className="text-danger">{msg}</p>}
                    </ErrorMessage>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label htmlFor="lastName" md="2">
                    Last Name
                  </Label>
                  <Col md="10">
                    <Field
                      name="lastName"
                      placeholder="Last Name"
                      className="form-control"
                    />
                    <ErrorMessage name="lastName">
                      {(msg) => <p className="text-danger">{msg}</p>}
                    </ErrorMessage>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <NotificationForm />
                </FormGroup>
                <FormGroup row>
                  <Col md={{ size: 10, offset: 2 }}>
                    <Button type="submit" color="primary" onClick={toggleModal}>
                      Register
                    </Button>
                  </Col>
                </FormGroup>
              </Form>
            )}
          </Formik>
        </ModalBody>
        {/* <ModalBody>
          I'm not collecting registration info quite yet. If you like what I'm
          doing with this MVP, get in touch:{" "}
          <input
            type="text"
            value="eitanfire@gmail.com"
            id="emailInput"
            readOnly
          />
          <button className="btn btn-link" onClick={handleCopyClick}>
            <i className="fa fa-copy" />
          </button>
          <a
            href="mailto:eitanfire@gmail.com"
            target="_blank"
            rel="noreferrer"
          ></a>
        </ModalBody> */}
        <ModalFooter>
          <Col xs={{ size: 11, offset: 5 }}>
            <Button color="primary" onClick={toggleModal}>
              Close
            </Button>
          </Col>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default SignUpForm;
