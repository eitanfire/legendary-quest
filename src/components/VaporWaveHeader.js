import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  Collapse,
  NavbarToggler,
  Nav,
  NavItem,
} from "reactstrap";
import { NavLink } from "react-router-dom";
import UserLoginForm from "../features/user/UserLoginForm";

const VaporWaveHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Navbar dark color="primary" sticky="top" expand="md">
      <NavbarBrand className="ms-4" href="/">
        <object
          type="image/svg+xml"
          data="https://garden.spoonflower.com/c/14309517/p/f/m/oKwbAQnUmPMTMWdEJSLEby7ZD7EsUDjwaV9Zk6Ua8HFhN5XbsSLFzBw/Stay%20Golden%20Miami.jpg"
          className="teach-league-logo vaporwave-logo"
        >
          Logo
        </object>
        {/* <object
          type="image/svg+xml"
          data="https://garden.spoonflower.com/c/14309517/p/f/m/oKwbAQnUmPMTMWdEJSLEby7ZD7EsUDjwaV9Zk6Ua8HFhN5XbsSLFzBw/Stay%20Golden%20Miami.jpg"
          className="vaporwave-logo-xs-sm d-xs-block d-md-none"
        >
          Logo
        </object> */}
        <h1 className="vaporwave-title title-xxl d-none d-xxl-block">
          Teach League
        </h1>
        <h1 className="vaporwave-title title-xl d-none d-xl-block d-xxl-none">
          Teach League
        </h1>
        <h1 className="vaporwave-title title-md-l d-none d-md-block d-xl-none">
          Teach League
        </h1>
        <h1 className="vaporwave-title title-sm d-none d-sm-block d-md-none">
          Teach League
        </h1>
        <h1 className="vaporwave-title title-xs d-xs-block d-sm-none">
          Teach League
        </h1>{" "}
      </NavbarBrand>
      <NavbarToggler
        className="navbar-toggler"
        onClick={() => setMenuOpen(!menuOpen)}
      />

      <Collapse isOpen={menuOpen} navbar>
        <Nav className="ms-auto mt-4 " navbar>
          <NavItem className="nav-item">
            <NavLink className="nav-link" to="/">
              <i className="fa fa-coffee fa-lg" /> Lounge
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="nav-link" to="/directory">
              <i className="fa fa-archive fa-lg" aria-hidden="true" /> Resources
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="nav-link" to="/rant">
              <i className="fa fa-solid fa-bullhorn fa-lg" /> Rant
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="nav-link" to="/takes">
              <i className="fa fa-solid fa-fire fa-lg" /> Takes
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="nav-link" to="/newsletter">
              <i className="fa far fa-comments fa-lg" /> Newsletter
            </NavLink>
          </NavItem>
        </Nav>
        <UserLoginForm />
      </Collapse>
    </Navbar>
  );
};

export default VaporWaveHeader;
