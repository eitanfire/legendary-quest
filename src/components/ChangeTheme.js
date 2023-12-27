import React, { useState, useEffect } from "react";
import Header from "./Header";
import VaporWaveHeader from "./VaporWaveHeader";
import "../../src/vaporWaveMode.css";
import { Row, Col } from "reactstrap";

function Theme() {
  const storedTheme = localStorage.getItem("theme");
  const [theme, setTheme] = useState(storedTheme || "light");

  const toggleTheme = () => {
    // Toggle the theme
    if (theme === "light") {
      setTheme("vaporWave");
    } else {
      setTheme("light");
    }
  };

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme); // Store the theme in local storage
  }, [theme]);

  return (
    <Row>
      <Col id="bulbBanner" className={`App ${theme}`} onClick={toggleTheme}>
        <div>
          {theme === "light" ? (
            <>
              <button id="button">
                <i className="fa fa-lightbulb-o fa-lg fa-spin" />
              </button>
            </>
          ) : (
            <>
              <button id="button">
                <i className="darkBulb fa fa-lightbulb-o fa-lg fa-spin" />
              </button>
            </>
          )}
        </div>
      </Col>
      <span className={`App ${theme}`}>
        {theme === "light" ? <Header /> : <VaporWaveHeader />}
      </span>
      <span className={`App ${theme}`}>
        {theme === "light" ? (
          <>
            <span className="shine">Let your teaching shine</span>
          </>
        ) : (
          <>
            <span className="flick">Flick the lights on Oppression</span>
          </>
        )}
      </span>
    </Row>
  );
}

export default Theme;
