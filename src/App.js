import Actors from "./components/Actors";
import ActorCard from "./components/ActorCard";
import { Container } from "react-bootstrap";

function App() {

  const actorData =
    { "adult": false, "gender": 2, "id": 15048, "known_for_department": "Acting", "name": "Robby Benson", "original_name": "Robby Benson", "popularity": 12.661, "profile_path": "/rYcDiM9LrStdlcb80N3WAR2CsHX.jpg" };

  return (
    <Container>
      <Actors />
      <ActorCard data={actorData} />
    </Container>
  );
}

export default App;