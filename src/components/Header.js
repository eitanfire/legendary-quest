import { Navbar, NavbarBrand } from "reactstrap";
import AvatarImg from "../app/assets/img/favicon.ico";
import UserLoginForm from "../features/user/UserLoginForm";

const Header = () => {
  return (
    <>
      <Navbar
        className="header-banner"
        style={{
          backgroundColor: "#00B894",
          padding: "2rem 0",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        }}
        expand="md"
      >
        <div
          className="container-fluid d-flex justify-content-between align-items-center"
          style={{ padding: "0 3rem" }}
        >
          {/* Logo on the left */}
          <a
            href="/"
            className="d-flex align-items-center"
            style={{ textDecoration: "none" }}
          >
            <img
              src={require("../app/assets/img/TLLogo.svg").default}
              alt="Teach League Logo"
              className="teach-league-logo-3d"
              style={{
                width: "120px",
                height: "60px",
                marginRight: "2rem",
                filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
              }}
            />
            {/* Title */}
            <h1
              style={{
                margin: 0,
                color: "white",
                fontSize: "4.5rem",
                fontWeight: "900",
                letterSpacing: "-0.04em",
              }}
            >
              Teach League
            </h1>
          </a>

          <div className="d-flex align-items-center gap-3">
            {/* User Login */}
            <UserLoginForm />

            
          </div>
        </div>
      </Navbar>
    </>
  );
};

export default Header;
