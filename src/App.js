import Actors from "./components/Actors";
import ActorCard from "./components/ActorCard";
import ActorCardPage from "./components/ActorCardPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  const actorData =
    { "adult": false, "gender": 2, "id": 15048, "known_for_department": "Acting", "name": "Robby Benson", "original_name": "Robby Benson", "popularity": 12.661, "profile_path": "/rYcDiM9LrStdlcb80N3WAR2CsHX.jpg" };

  return (
    <BrowserRouter>
      <Actors />
      <ActorCard data={actorData} />
      <Routes>
        <Route path="/actor/:id" element={<ActorCardPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;