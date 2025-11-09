import { Navbar, NavbarBrand } from "reactstrap";
import AvatarImg from "../app/assets/img/Avatar.png";

const Header = () => {
  return (
    <>
      <Navbar
        dark
        className="header-banner d-flex justify-content-between align-items-center"
        color="primary"
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
          <h1 className="title-sm d-none d-sm-block d-md-none">Teach League</h1>
          <h1 className="title-xs d-xs-block d-sm-none">Teach League</h1>
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
      <br></br>
    </>
  );
};

export default Header;
