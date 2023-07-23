import { Card } from 'react-bootstrap';

export default function ActorCard(props) {
    const imgSrc = `https://image.tmdb.org/t/p/w500` + props.data.profile_path;
    return (
        <Card>
            <Card.Img variant="top" src={imgSrc} />
            <Card.Body>
                <Card.Title>{props.data.name}</Card.Title>
            </Card.Body>
        </Card>
    );
}