import React, { useState } from "react";
import { Button, Label, Col, FormGroup } from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { validateSignUpForm } from "../utils/validateSignUpForm";

function NotificationForm() {
  const [notificationMethod, setNotificationMethod] = useState(""); // State variable to hold the user's selected notification method

  return (
    <div>
      <h3>Stay in Touch</h3>
      <Label check md={{ size: 5, offset: 2 }}>
        <Field name="agree" type="checkbox" className="form-check-input" />
        {"  "}
        Receive a monthly update
      </Label>
      <div>
        <label>
          <input
            type="radio"
            value="email"
            checked={notificationMethod === "email"}
            onChange={() => setNotificationMethod("email")}
          />
          By Email
        </label>
      </div>

      <div>
        <label>
          <input
            type="radio"
            value="text"
            checked={notificationMethod === "text"}
            onChange={() => setNotificationMethod("text")}
          />
          By Text
        </label>
      </div>
      {notificationMethod === "email" && (
        <div>
          <FormGroup row>
            {/* <Label htmlFor="email" md="2">
            </Label> */}
            <Col md="10">
              <Field
                name="email"
                placeholder="Email"
                type="email"
                className="form-control"
              />
              <ErrorMessage name="email">
                {(msg) => <p className="text-danger">{msg}</p>}
              </ErrorMessage>
            </Col>
          </FormGroup>
        </div>
      )}

      {notificationMethod === "text" && (
        <FormGroup row>
          {/* <Label htmlFor="phoneNum" md="2"></Label> */}
          <Col md="10">
            <Field
              name="phoneNum"
              placeholder="Phone Number"
              className="form-control"
            />
            <ErrorMessage name="phoneNum">
              {(msg) => <p className="text-danger">{msg}</p>}
            </ErrorMessage>
          </Col>
        </FormGroup>
      )}
    </div>
  );
}

export default NotificationForm;
