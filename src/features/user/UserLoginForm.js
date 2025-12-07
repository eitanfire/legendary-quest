import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser, selectCurrentUser } from "./userSlice";
import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Button,
} from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import defaultAvatar from "../../app/assets/img/favicon.ico"; // Import default avatar image
import { validateUserLoginForm } from "../../utils/validateUserLoginForm";
import { Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const UserLoginForm = () => {
  const auth = getAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginError, setLoginError] = useState(null); // State to store login error
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const handleLogin = async (values) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.username,
        values.password
      );
      const user = userCredential.user;
      // Dispatch action to set current user
      dispatch(setCurrentUser(user));
      setLoginModalOpen(false);
    } catch (error) {
      // Handle login error
      setLoginError(
        "No account was found with the credentials you provided. Try again or create a new account."
      );
      console.error("Login error:", error.message);
    }
  };

  return (
    <>
      <span className="navbar-text ml-auto">
        {currentUser ? (
          <div className="avatar">
            <img
              src={currentUser.avatar || defaultAvatar} // Use default avatar if currentUser.avatar is not available
              alt={"user"}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        ) : (
          <Button
            onClick={() => setLoginModalOpen(true)}
            color="primary"
            className="login-btn"
          >
            <i className="fa fa-sign-in fa-lg" /> Login
          </Button>
        )}
      </span>
      <Modal isOpen={loginModalOpen}>
        <ModalHeader toggle={() => setLoginModalOpen(false)}>Login</ModalHeader>
        <ModalBody>
          <Formik
            initialValues={{ username: "", password: "" }}
            onSubmit={handleLogin}
            validate={validateUserLoginForm}
          >
            {(formik) => (
              <Form>
                {loginError && formik.submitCount > 0 && (
                  <p className="text-danger">{loginError}</p>
                )}
                <FormGroup>
                  <Label htmlFor="username">
                    Username
                    <Field
                      id="username"
                      name="username"
                      placeholder="Username"
                      className="form-control"
                    />
                    <ErrorMessage name="username">
                      {(msg) => <p className="text-danger">{msg}</p>}
                    </ErrorMessage>
                  </Label>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="password">
                    Password
                    <Field
                      id="password"
                      name="password"
                      placeholder="Password"
                      className="form-control"
                    />
                    <ErrorMessage name="password">
                      {(msg) => <p className="text-danger">{msg}</p>}
                    </ErrorMessage>
                  </Label>
                </FormGroup>
                <Button type="submit" color="primary">
                  Login
                </Button>
                &nbsp;&nbsp;&nbsp;
                <Link
                  to="/account"
                  className=""
                  type="submit"
                  color="primary"
                  onClick={() => setLoginModalOpen(false)}
                >
                  Create Account
                </Link>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </Modal>
    </>
  );
};

export default UserLoginForm;
