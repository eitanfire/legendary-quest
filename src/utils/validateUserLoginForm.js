export const validateUserLoginForm = (values) => {
  const errors = {};
  // if (!values.login) {
  //   errors.login = "No account was found with the credentials you provided. Try again or create a new account.";
  // }
  if (!values.username) {
    errors.username = "Required";
  } else if (values.username.length < 6) {
    errors.username = "Must be at least 6 characters.";
  } else if (values.username.length > 40) {
    errors.username = "Must be 40 characters or less";
  }

  if (!values.password) {
    errors.password = "Required";
  } else if (values.password.length < 8) {
    errors.password = "Must be at least 8 characters.";
  }

  return errors;
};
