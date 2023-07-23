import { Button, Label, Col, FormGroup } from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { validateSignUpForm } from "../utils/validateSignUpForm";
import NotificationForm from "./NotificationForm";

const SignUpForm = () => {
  const contactType = (Field, "contactType");

  const handleSubmit = (values, { resetForm }) => {
    console.log("form values:", values);
    console.log("in JSON format:", JSON.stringify(values));
    resetForm();
  };

  return (
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
        {/* <FormGroup row>
          <Label htmlFor="email" md="2">
            Email
          </Label>
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
        </FormGroup> */}
        <FormGroup row>
          {/* <Label check md={{ size: 5, offset: 2 }}>
            <Field name="agree" type="checkbox" className="form-check-input" />
            {"  "}
            Receive a monthly update
          </Label> */}
          <NotificationForm />

          {/* <Col md="5">
            <Field name="contactType" as="select" className="form-control">
              <option>By Email</option>
              <option>By Text</option>
            </Field>
          </Col> */}
          {/* {contactType === "By Text" && ( */}
          {/* <FormGroup row>
              <Label htmlFor="phoneNum" md="2">
                Phone Number
              </Label>
              <Col md="10">
                <Field
                  name="phoneNum"
                  placeholder="Text me!"
                  className="form-control"
                />
                <ErrorMessage name="phoneNum">
                  {(msg) => <p className="text-danger">{msg}</p>}
                </ErrorMessage>
              </Col>
            </FormGroup> */}
          {/* )} */}
        </FormGroup>
        <FormGroup row>
          <Col md={{ size: 10, offset: 2 }}>
            <Button type="submit" color="primary">
              Register
            </Button>
          </Col>
        </FormGroup>
      </Form>
    </Formik>
  );
};

export default SignUpForm;
