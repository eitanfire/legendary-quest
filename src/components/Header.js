import { useState } from "react";
import {
  Container,
  Navbar,
  NavbarBrand,
  Collapse,
  NavbarToggler,
  Nav,
  NavItem,
} from "reactstrap";
import { NavLink } from "react-router-dom";
import vaporwaveTrees from "../app/assets/img/vaporwaveTrees.png";

const Header = () => {
  return (
    <Navbar dark color="primary" sticky="top" expand="md">
      <NavbarBrand className="ms-5" href="/">
        <img src={vaporwaveTrees} alt="Teach League Logo" className="float-start" />
        <h1 className="mt-1" style={{ color: "#00008B" }}>Teach League</h1>
      </NavbarBrand>
      <Nav className="ms-auto" navbar>
        <NavItem>
          <NavLink className="nav-link" to="/">
            <i className="fa fa-home fa-lg" /> Home
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className="nav-link" to="/directory">
            <i className="fa fa-list fa-lg" /> Directory
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className="nav-link" to="/about">
            <i className="fa fa-info fa-lg" /> About
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className="nav-link" to="/contact">
            <i className="fa fa-address-card fa-lg" /> Contact
          </NavLink>
        </NavItem>
      </Nav>
    </Navbar>
  );
};

export default Header;
