import { Navbar, NavbarBrand } from "reactstrap";
import AvatarImg from "../app/assets/img/Avatar.png";

const Header = () => {
  return (
    <>
      <Navbar
        className="header-banner"
        style={{
          backgroundColor: '#00B894',
          padding: '2rem 0',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
        }}
        expand="md"
      >
        <div className="container-fluid d-flex justify-content-between align-items-center" style={{ padding: '0 3rem' }}>
          {/* Logo on the left */}
          <a href="/" className="d-flex align-items-center" style={{ textDecoration: 'none' }}>
            <img
              src={require("../app/assets/img/TLLogo.svg").default}
              alt="Teach League Logo"
              className="teach-league-logo-3d"
              style={{
                width: '120px',
                height: '60px',
                marginRight: '2rem',
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
              }}
            />
            {/* Title */}
            <h1
              style={{
                margin: 0,
                color: 'white',
                fontSize: '4.5rem',
                fontWeight: '900',
                letterSpacing: '-0.04em'
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
            style={{ transition: 'transform 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img
              src={AvatarImg}
              alt="Eitan's Avatar"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: '2px solid white',
                cursor: 'pointer'
              }}
            />
          </a>
        </div>
      </Navbar>
    </>
  );
};

export default Header;
