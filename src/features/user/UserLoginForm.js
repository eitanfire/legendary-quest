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
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth } from "../../app/firebase.config";

const UserLoginForm = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginError, setLoginError] = useState(null); // State to store login error
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const handleLogin = async (values) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      // Extract only serializable properties from Firebase User
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
      };

      // Dispatch action to set current user
      dispatch(setCurrentUser(userData));
      setLoginModalOpen(false);
    } catch (error) {
      // Handle login error
      setLoginError(
        "No account was found with the credentials you provided. Try again or create a new account."
      );
      console.error("Login error:", error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Request Google Drive read-only access for lesson planning
      provider.addScope('https://www.googleapis.com/auth/drive.readonly');

      // Use redirect instead of popup to avoid COOP issues
      await signInWithRedirect(auth, provider);
      // Note: The page will redirect, so code after this won't run
      // The result is handled by the useEffect hook above
    } catch (error) {
      setLoginError(
        "Google sign-in failed. Please try again or use email/password."
      );
      console.error("Google login error:", error.message);
    }
  };

  return (
    <>
      <span className="navbar-text ml-auto">
        {currentUser ? (
          <div className="avatar">
            <img
              src={currentUser.photoURL || defaultAvatar} // Use Google profile photo if available
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
            initialValues={{ email: "", password: "" }}
            onSubmit={handleLogin}
            validate={validateUserLoginForm}
          >
            {(formik) => (
              <Form>
                {loginError && formik.submitCount > 0 && (
                  <p className="text-danger">{loginError}</p>
                )}
                <FormGroup>
                  <Label htmlFor="email">
                    Email
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Email address"
                      className="form-control"
                    />
                    <ErrorMessage name="email">
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
          <div className="text-center my-3">
            <hr />
            <small className="text-muted">or</small>
            <hr />
          </div>
          <Button
            color="light"
            className="w-100 d-flex align-items-center justify-content-center"
            onClick={handleGoogleLogin}
            style={{ border: '1px solid #ddd' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: '8px' }}>
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Sign in with Google (enables Drive search)
          </Button>
        </ModalBody>
      </Modal>
    </>
  );
};

export default UserLoginForm;
