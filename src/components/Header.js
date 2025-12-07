import { Navbar, NavbarBrand } from "reactstrap";
import AvatarImg from "../app/assets/img/favicon.ico";

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

          {/* Avatar Link to Personal Website */}
          <a
            href="https://eitans.website"
            target="_blank"
            rel="noopener noreferrer"
            className="me-4"
            style={{
              position: "relative",
              display: "inline-block",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <svg
              width="70"
              height="70"
              viewBox="0 0 70 70"
              style={{ display: "block" }}
            >
              <defs>
                {/* Circular path for text */}
                <path
                  id="circlePath"
                  d="M 35,35 m -28,0 a 28,28 0 1,1 56,0 a 28,28 0 1,1 -56,0"
                />

                {/* Clip path for circular avatar */}
                <clipPath id="avatarClip">
                  <circle cx="35" cy="35" r="12.5" />
                </clipPath>
              </defs>

              {/* Avatar image */}
              <image
                xlinkHref={AvatarImg}
                x="22.5"
                y="22.5"
                width="25"
                height="25"
                clipPath="url(#avatarClip)"
                style={{ cursor: "pointer" }}
              />

              {/* Curved text with stroke for better visibility */}
              <text
                fontSize="8"
                fontWeight="700"
                fill="white"
                stroke="#00B894"
                strokeWidth="0.5"
                letterSpacing="1.2"
                style={{
                  filter: 'drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.8))'
                }}
              >
                <textPath href="#circlePath" startOffset="23%">
                  connect with me
                </textPath>
              </text>
            </svg>
          </a>
        </div>
      </Navbar>
    </>
  );
};

export default Header;
