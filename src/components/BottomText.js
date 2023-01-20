const BottomText = () => {
  const d = new Date();
  let year = d.getFullYear();
  return (
    <p className="App" id="Footer">
      © Teach League <span style={{ color: "orange" }}>{year}</span> ⎸{" "}
      <span style={{ fontStyle: "italic" }}>We</span><span id="heart"> ❤️ </span>
      <span style={{ fontStyle: "italic" }}>Teachers!</span>
    </p>
  );
};

export default BottomText;