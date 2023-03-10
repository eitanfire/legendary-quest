import React, { useState, useEffect } from 'react';
import Header from './Header';
import VaporWaveHeader from './VaporWaveHeader';
import "../../src/vaporWaveMode.css";
import { Row, Col } from 'reactstrap';
// import "../../src/courseTheme.css";

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
    <Row>
      <Col Id="bulbBanner" className={`App ${theme}`} onClick={toggleTheme}>
        <div>
          {theme === "light" ? (
            <>
              <button id="button">
                <i className="fa fa-lightbulb-o fa-lg" />
              </button>
            </>
          ) : (
            <button id="button">
              <i className="darkBulb fa fa-lightbulb-o fa-lg" />
            </button>
          )}
        </div>
      </Col>
      <span className={`App ${theme}`}>
        {theme === "light" ? <Header /> : <VaporWaveHeader />}
      </span>
      <span className={`App ${theme}`}>
        {theme === "light" ? (
          <span className="title">Flick the lights on oppression</span>
        ) : (
          ""
        )}
      </span>
    </Row>
  );
}
export default Theme;