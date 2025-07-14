import React, { useEffect, useRef } from "react";
const GoogleShare = ({ url }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (window.gapi && window.gapi.sharetoclassroom) {
        clearInterval(intervalId);
        window.gapi.sharetoclassroom.go(containerRef.current, {
          size: 64,
          theme: "classic", // Set the theme to 'classic' for the classic icon
          url: "https://docs.google.com/document/d/1dbdDA3tfZp5NugzgwWx2FdOfh7b3U2xHxGbILYKIliA/://docs.google.com/document/d/1dbdDA3tfZp5NugzgwWx2FdOfh7b3U2xHxGbILYKIliA/rl",
          itemtype: "assignment",
          title: "Warm-Up Questions",
          body: "Come to class on time and aim to write at least five (5) sentences or a sketchnote. You may respond to the question, to another prompt of your choice, journal about how it’s going or what you’re grateful for, or add to your own story.",
        });
      }
    }, 100);
  }, [url]);

  return (
    <div ref={containerRef} style={{ cursor: "pointer" }}>
      Share to Google Classroom
    </div>
  );
};

export default GoogleShare;
