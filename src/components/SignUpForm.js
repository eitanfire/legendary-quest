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
import { firebaseConfig } from "../app/firebase.config";
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUpForm = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseConfig,
        values.email,
        values.password // Assume you have a password field in your form
      );
      console.log("User created:", userCredential.user);
      resetForm();
      toggleModal();
    } catch (error) {
      setError(error.message);
      console.error("Error creating user:", error);
    }
  };

  return (
    <div>
      <FormGroup row>
        <Col></Col>
        <Col>
          <Button
            className="sign-up-btn btn btn-primary btn-lg btn-block"
            role="button"
            type="button" // Changed type to button
            color="primary"
            onClick={toggleModal} // Moved onClick to here
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
              password: "", // Add a password field
              agree: true,
              contactType: "By Email",
              feedback: "",
            }}
            onSubmit={handleSubmit}
            validate={validateSignUpForm}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                {" "}
                {/* Added onSubmit handler */}
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
                  <Label htmlFor="email" md="2">
                    Email
                  </Label>
                  <Col md="10">
                    <Field
                      name="email"
                      placeholder="Email"
                      className="form-control"
                    />
                    <ErrorMessage name="email">
                      {(msg) => <p className="text-danger">{msg}</p>}
                    </ErrorMessage>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label htmlFor="password" md="2">
                    Password
                  </Label>
                  <Col md="10">
                    <Field
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="form-control"
                    />
                    <ErrorMessage name="password">
                      {(msg) => <p className="text-danger">{msg}</p>}
                    </ErrorMessage>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <NotificationForm />
                </FormGroup>
                {error && <p className="text-danger">{error}</p>}
                <FormGroup row>
                  <Col>
                    <Button type="submit" color="primary">
                      Register
                    </Button>
                  </Col>
                </FormGroup>
              </Form>
            )}
          </Formik>
        </ModalBody>
        <ModalFooter>
          <Col>
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
