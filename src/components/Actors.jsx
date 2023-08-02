import { useState, useContext } from 'react';
import { Container, Form, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TextColorContext from '../contexts/TextColor';

export default function Actors() {
  const [actors, setActors] = useState([]);
  const navigate = useNavigate();
  const { textColor, setTextColor } = useContext(TextColorContext);

  const handleInput = async (newSearchText) => {
    const res = await fetch(`https://api.themoviedb.org/3/search/person?api_key=53d2ee2137cf3228aefae083c8158855&query=${newSearchText}`);
    const data = await res.json();
    setActors(data.results);
  }

  return (
    <Container>
      <Form.Control
        type="text"
        placeholder="Search Actors"
        onChange={(e) => handleInput(e.target.value)}
        className={textColor} />
      <ListGroup className={textColor}>
        {actors.map((actor) => (
          <ListGroup.Item
          onClick={()=> navigate('/actor/'+ actor.id)}
          className={textColor}>{actor.name}</ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}