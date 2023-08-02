import React from "react";
import { Card, Button, Container } from "react-bootstrap";

export default function Movie(props) {
    return (
        <Card
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='outline'>
            <Card.Img
                objectFit='cover'
                maxW={{ base: '100%', sm: '200px' }}
                src={props.movie.poster}
                alt={props.movie.name} />
            <Container>
                <Card.Body>
                    <h1 size='md'>{props.movie.name}</h1>
                    <p py='2'>{props.movie.plot}</p>
                </Card.Body>
                <Card.Footer>
                    {props.movie.genres.map((genre) => (<Button size='md' variant='solid' colorScheme='teal'>{genre}</Button>))}
                </Card.Footer>
            </Container>
        </Card>
    );
}