import { Navbar, NavbarBrand } from "reactstrap";
import AvatarImg from "../app/assets/img/vapor-wave-statue.jpg";

const VaporWaveHeader = () => {
  return (
    <Navbar dark color="primary" sticky="top" expand="md" className="d-flex justify-content-between align-items-center">
      <NavbarBrand className="ms-4" href="/">
        <object
          type="image/svg+xml"
          data="https://garden.spoonflower.com/c/14309517/p/f/m/oKwbAQnUmPMTMWdEJSLEby7ZD7EsUDjwaV9Zk6Ua8HFhN5XbsSLFzBw/Stay%20Golden%20Miami.jpg"
          className="teach-league-logo vaporwave-logo"
        >
          Logo
        </object>
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
        </h1>
      </NavbarBrand>

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
    </Navbar>
  );
};

export default VaporWaveHeader;
