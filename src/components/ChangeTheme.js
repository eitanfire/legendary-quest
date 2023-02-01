import React, { useState, useEffect } from 'react';
import "../../src/vaporWaveMode.css";
function Theme() {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("vaporWave");
    } else {
      setTheme("light");
    }
  };
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);
  return (
    <div className={`App ${theme}`}>
     <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
export default Theme;