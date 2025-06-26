import React, { useState } from "react";

const ContactInfo = () => {
  const [isEmailVisible, setEmailVisible] = useState(false);

  const handleMagnifyingGlassClick = (event) => {
    event.preventDefault(); // Prevent the default behavior of the click event
    setEmailVisible(true);
  };

  const handleCopyClick = (event) => {
    event.preventDefault(); // Prevent the default behavior of the click event

    const emailInput = document.getElementById("emailInput");
    const email = emailInput.textContent.trim(); // Get the text content of the span and trim any whitespace
    navigator.clipboard.writeText(email); // Copy the trimmed email to the clipboard
    setEmailVisible(false);
    localStorage.setItem("copiedEmail", email);
    alert("Email address copied!");
  };

  return (
    <div>
      <a href="mailto:teachleagueabc@gmail.com">
        <i className="fa fa-envelope-o"></i> Email
      </a>{" "}
      <a href="#" onClick={handleMagnifyingGlassClick}>
        <i className="fa fa-search">&nbsp;</i>
      </a>{" "}
      {isEmailVisible && (
        <span
          id="emailInput"
          style={{ cursor: "pointer" }}
          onClick={handleCopyClick}
        >
          teachleagueabc@gmail.com
        </span>
      )}
    </div>
  );
};

export default ContactInfo;
