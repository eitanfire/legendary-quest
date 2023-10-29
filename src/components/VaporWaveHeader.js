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
import vaporwaveTrees from "../app/assets/img/vaporwaveTrees.png";
import logo from "../app/assets/img/TLLogo.svg";
import UserLoginForm from "../features/user/UserLoginForm";
import vaporwavestatue from "../app/assets/img/tlLogo.jpeg";
// import vaporwavestatue from "../app/assets/img/vapor-wave-statue.jpg";

const VaporWaveHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  
  return (
    <Navbar dark color="primary" sticky="top" expand="md">
      <NavbarBrand className="ms-5" href="/">
        <object
          type="image/svg+xml"
          data="https://garden.spoonflower.com/c/14309517/p/f/m/oKwbAQnUmPMTMWdEJSLEby7ZD7EsUDjwaV9Zk6Ua8HFhN5XbsSLFzBw/Stay%20Golden%20Miami.jpg"
          className="vaporwaveTrees"
        >
          Logo
        </object>
        {/* <img
          // src={vaporwaveTrees}
          src={logo}
          alt="Teach League Logo"
          className="vaporwaveTrees float-start"
        /> */}
        <h1 className="title">Teach League</h1>
      </NavbarBrand>
      <NavbarToggler onClick={() => setMenuOpen(!menuOpen)} />

      <Collapse isOpen={menuOpen} navbar>
        <Nav className="ms-auto mt-4 " navbar>
          <NavItem>
            <NavLink className="nav-link" to="/">
              <i className="fa fa-coffee" /> Lounge
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="nav-link" to="/directory">
              <i className="fa fa-archive fa-lg" aria-hidden="true" /> Resources
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="nav-link" to="/rant">
              <i className="fa fa-solid fa-bullhorn" /> Rant
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="nav-link" to="/connect">
              <i className="fa far fa-comments" /> Connect
            </NavLink>
          </NavItem>
        </Nav>
        <UserLoginForm />
      </Collapse>
    </Navbar>
  );
};

export default VaporWaveHeader;
