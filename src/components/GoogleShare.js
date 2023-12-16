import React, { useEffect, useRef } from "react";

const GoogleShare = ({ url }) => {
  const containerRef = useRef(null);

useEffect(() => {
  const intervalId = setInterval(() => {
    console.log("Checking for window.gapi.sharetoclassroom...");
    if (window.gapi && window.gapi.sharetoclassroom) {
      clearInterval(intervalId);
      console.log("window.gapi.sharetoclassroom is available!");
      window.gapi.sharetoclassroom.go(containerRef.current, {
        size: 64,
        theme: "classic",
        topic: "Warm-Up Questions",
        url: url,
        itemtype: "assignment",
        title: "Warm-Up Questions",
        body: "Come to class on time and aim to write at least five (5) sentences or a sketchnote. You may respond to the question, to another prompt of your choice, journal about how it’s going or what you’re grateful for, or add to your own story.",
      });
    }
  }, 100);
}, [url]);


  return (
    <div ref={containerRef} onClick={() => {}} style={{ cursor: "pointer" }}>
      Share to Google Classroom
    </div>
  );
};

export default GoogleShare;
