import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ActorCard from "./ActorCard";
import { useEffect, useState } from "react";

export default function ActorCardPage(props) {

    const { id } = useParams();
    const [actor, setActor] = useState({});
    
    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/person/${id}?api_key=53d2ee2137cf3228aefae083c8158855`)
        .then((res) => res.json())
        .then((data) => {
            setActor(data);
        })
    },[])

    return (
        <Container>
            <ActorCard data={actor} />
        </Container>
    )
}