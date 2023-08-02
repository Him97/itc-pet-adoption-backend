import Actors from "./components/Actors";
import ActorCard from "./components/ActorCard";
import ActorCardPage from "./components/ActorCardPage";
import Dog from "./components/Dog";
import MovieList from './components/Movie'
import TextColorContext from "./contexts/TextColor";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container, Nav, Navbar, Form } from "react-bootstrap";
import { useState } from "react";

function App() {
  const [textColor, setTextColor] = useState('text-black');

  return (
    <TextColorContext.Provider value={{ textColor, setTextColor }}>
      <BrowserRouter>
        <Navbar bg="dark" data-bs-theme="dark">
          <Container>
            <Navbar.Brand href="home">TMDB</Navbar.Brand>
            <Nav>
              <Nav.Link href="movie">Movies</Nav.Link>
              <Nav.Link href="dog">Dogs</Nav.Link>
              <Nav.Link href="actor">Actors</Nav.Link>
            </Nav>
            <Form.Select onChange={(e) => setTextColor(e.target.value)}>
              <option>Select Text Color</option>
              <option value="text-black">Black</option>
              <option value="text-white">White</option>
              <option value="text-success">Green</option>
              <option value="text-danger">Red</option>
              <option value="text-warning">Yellow</option>
              <option value="text-primary">Blue</option>
            </Form.Select>
          </Container>
        </Navbar>

        <Routes>
          <Route path="/" element={<Navbar.Brand href="home">TMDB</Navbar.Brand>} />
          <Route path="/actor/:id" element={<ActorCardPage />} />
          <Route path="/actor" element={<Actors />} />
          <Route path="/dog" element={<Dog />} />
          <Route path="/movie" element={<MovieList />} />
        </Routes>
      </BrowserRouter>
    </TextColorContext.Provider>
  );
}

export default App;