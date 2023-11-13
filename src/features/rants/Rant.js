const Rant = ({ rant }) => {
  if (rant) {
    const { id, name, image, link, featured, description } = rant;
    return (
      <>
        <img className="rant-img" src={image} alt={name} style={{ width: "150px" }}></img>
        <div className="m-4">
          <h5 className="fw-bold">{name}</h5>
          {description}
        </div>
      </>
    );
    return null;
  }
};
export default Rant;
