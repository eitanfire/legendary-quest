const BottomText = () => {
  const d = new Date();
  let year = d.getFullYear();
  return (
    <p className="site-footer text-center">
      © Teach League <span style={{ color: "orange" }}>{year}</span> ⎸{" "}
      <span style={{ fontStyle: "italic" }}>We</span>
      <span id="heart"> ❤️ </span>
      <span style={{ fontStyle: "italic" }}>Teachers!</span>
    </p>
  );
};

export default BottomText;
