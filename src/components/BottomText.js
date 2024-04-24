const BottomText = () => {
  const d = new Date();
  let year = d.getFullYear();
  return (
    <>
      <p className="site-footer text-center">
        © Teach League <span>{year}</span> ⎸{" "}
        <span style={{ fontStyle: "italic" }}>We</span>
        <span id="heart"> ❤️ </span>
        <span style={{ fontStyle: "italic" }}>Teachers!</span>
      </p>
      <div className="∞-learning">
        <div>Need something right now?</div>
        <div>
          ☜ Assign this for ∞ learning. You'll still need to find your own sub
          though.
        </div>
      </div>
    </>
  );
};

export default BottomText;
