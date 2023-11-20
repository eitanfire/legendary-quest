const Take = ({ take }) => {
  if (take) {
    const { image, name, description } = take;
    return (
      <>
        <img src={image} alt={name} style={{ width: "150px" }}></img>
        <div className="m-4">
          <h5 className="fw-bold">{name}</h5>
          {description}
        </div>
      </>
    );
    return null;
  }
};
export default Take;
