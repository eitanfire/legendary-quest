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
import UserLoginForm from "../features/user/UserLoginForm";
import logo from "../app/assets/img/tlLogo.jpeg";


const VaporWaveHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Navbar dark color="primary" sticky="top" expand="md">
      <NavbarBrand className="ms-5" href="/">
        <img 
          src={vaporwaveTrees}
          alt="Teach League Logo"
          className="vaporwaveTrees float-start"
        />
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
