import { useState, useEffect, useContext } from "react";
import { Container, Card, Button } from "react-bootstrap";
import TextColorContext from "../contexts/TextColor";

export default function Dog() {
    const [imageSrc, setImageSrc] = useState('');
    const [breed, setBreed] = useState('');
    const { textColor, setTextColor } = useContext(TextColorContext);

    async function handleClick() {
        const res = await fetch(`https://dog.ceo/api/breeds/image/random`);
        const data = await res.json();
        const breed = data.message.split("/")[4];
        const formattedBreed = breed
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        setImageSrc(data.message);
        setBreed(formattedBreed);
    }

    return (
        <Container>
            <Card className={textColor}>
                <Card.Header className="d-flex align-items-center justify-content-between">
                    <Card.Title>Random Dog Image</Card.Title>
                    <Button onClick={handleClick} className={textColor}>Random Image</Button>
                </Card.Header>
                <Card.Body className="d-flex justify-content-center">
                    <Card.Subtitle>{breed}</Card.Subtitle>
                </Card.Body>
                <Card.Footer>
                    <Card.Img src={imageSrc} />
                </Card.Footer>
            </Card>
        </Container>
    )
}