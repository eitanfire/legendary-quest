import { Container } from "reactstrap";
import SubHeader from "../components/SubHeader";

const MovieDayPage = ({ item }) => {
    const { youtube, extrayoutube, extrayoutube1 } = item;
  return (
    <Container>
      <SubHeader current="watch" />
      <h1>Movie Day</h1>
      <p>Playlists to help bring the content to life</p>
      {youtube}
      {extrayoutube}
      {extrayoutube1}
    </Container>
  );
};

export default MovieDayPage;
