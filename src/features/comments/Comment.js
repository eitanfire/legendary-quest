const Comment = ({ comment }) => {
  if (comment) {
    const { image, name, description } = comment;
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
export default Comment;
