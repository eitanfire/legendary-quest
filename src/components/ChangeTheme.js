import React, { useState, useEffect } from 'react';
import Header from './Header';
import "../../src/vaporWaveMode.css";

function Theme() {
  const [theme, setTheme] = useState("light");
  const toggleTheme = (Header) => {
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
    <span className={`App ${theme}`}>
      <button id="button" className="card-body" onClick={toggleTheme}>
        {theme === "light" ? (
          <i className="fa fa-lightbulb-o fa-lg" />
        ) : (
          <i className="darkBulb fa fa-lightbulb-o fa-lg" />
        )}
      </button>
    </span>
  );
}
export default Theme;