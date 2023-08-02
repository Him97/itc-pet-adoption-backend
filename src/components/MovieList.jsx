import React, { useEffect, useState } from "react";
import Movie from "./Movie";
import { Container } from "react-bootstrap";


const initialMovies = [{
    "id": "1",
    "name": "Forrest Gump",
    "runtime": 142,
    "year": 1994,
    "plot": "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.",
    "genres": ["Drama", "Comedy"],
    "poster": "https://upload.wikimedia.org/wikipedia/en/6/67/Forrest_Gump_poster.jpg",
    "imdb": "https://www.imdb.com/title/tt0109830/"
},

{
    "id": "2",
    "name": "Fight Club",
    "runtime": 139,
    "year": 1999,
    "plot": "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
    "genres": ["Drama"],
    "poster": "https://cinemadetective.com/wp-content/uploads/2020/04/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg"
}
];

export default function MovieList(props) {
    const [movies, setMovies] = useState(initialMovies);
    const [filterComedy, setFilterComedy] = useState(false)
    const [filterByName, setFilterByName] = useState('')
    const [inputError, setInputError] = useState(false);

    function handleChange(e) {
        setFilterByName(e.target.value);
        const searchResults = initialMovies.filter((movie) =>
            movie.name.toLowerCase().includes(filterByName.toLowerCase())
        );
        setMovies(searchResults);
    }

    const handleClick = () => {
        if (filterComedy === true) {
            setMovies(initialMovies);
            setFilterComedy(false);
        } else {
            setMovies(movies.filter((movie) => movie.genres.includes("Comedy")));
            setFilterComedy(true);
        }
    }

    useEffect(() => {
        if (filterByName.startsWith('.') || filterByName.length < 3) {
            setInputError(true)
        } else {
            setMovies(initialMovies.filter((movie) => movie.name.toLocaleLowerCase().includes(filterByName.toLocaleLowerCase())))
            setInputError(false)
        }
    }, [filterByName])

    return (
        <Container maxW='container.sm'>
            <VStack
                divider={<StackDivider borderColor='gray.200' />}
                spacing={4}
                align='stretch' >
                <Box>
                    <Heading>Movie List</Heading>
                </Box>
                <Box display='flex' alignItems='baseline'>
                    <Input type="text" placeholder="Filter Movies..." onChange={handleChange}></Input>
                    {inputError ?
                        <Alert status='error'>
                            <AlertIcon />
                            There was an error processing your request
                        </Alert>
                        : null}
                    <Button onClick={handleClick} >Toggle Comedy</Button>
                </Box>
                <Box>
                    {movies.map((movie) => (
                        <Movie movie={movie} />
                    ))}
                </Box>
            </VStack>
        </Container>
    )
}