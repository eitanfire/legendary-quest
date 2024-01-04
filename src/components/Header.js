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

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Navbar
        dark
        className="header-banner"
        color="primary"
        // sticky="top"
        expand="md"
      >
        <NavbarBrand className="ms-4" href="/">
          <object
            type="image/svg+xml"
            data="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkJbls8I0IRZB5uK7OrsdgbjJDDrJty7BXLQ&usqp=CAU"
            className="teach-league-logo"
          >
            Logo
          </object>
          <h1 className="title-xxl d-none d-xxl-block">Teach League</h1>
          <h1 className="title-xl d-none d-xl-block d-xxl-none">
            Teach League
          </h1>
          <h1 className="title-md-l d-none d-md-block d-xl-none">
            Teach League
          </h1>
          <h1 className="title-sm d-none d-sm-block d-md-none">
            Teach League
          </h1>
          <h1 className="title-xs d-xs-block d-sm-none">Teach League</h1>
        </NavbarBrand>
        <NavbarToggler
          className="navbar"
          onClick={() => setMenuOpen(!menuOpen)}
        />
        <Collapse isOpen={menuOpen} navbar>
          <Nav className="ms-auto mt-4 " navbar>
            <NavItem className="nav-item">
              <NavLink className="nav-link" to="/">
                <i className="fa fa-coffee" /> Lounge
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to="/directory">
                <i className="fa fa-archive fa-lg" aria-hidden="true" />{" "}
                Resources
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to="/rant">
                <i className="fa fa-solid fa-bullhorn" /> Rant
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to="/takes">
                <i className="fa fa-solid fa-fire" /> Takes
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to="/connect">
                <i className="fa far fa-comments" /> Connect
              </NavLink>
            </NavItem>
            {/* <NavItem>
              <NavLink className="nav-link" to="/watch">
                <i className="fa far fa-comments" /> Watch
              </NavLink>
            </NavItem> */}
          </Nav>
          <UserLoginForm />
        </Collapse>
      </Navbar>
      <br></br>
    </>
  );
};

export default Header;
