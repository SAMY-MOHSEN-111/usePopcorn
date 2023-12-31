/*
import {useEffect, useState} from "react";

const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = `2078e62b`;

export default function App() {
    const [query, setQuery] = useState("inception");
    const [movies, setMovies] = useState([]);
    const [watched, setWatched] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedId, setSelectedId] = useState(null);

    function handleSelectMovie(id) {
        setSelectedId(id === selectedId ? null : id);
    }

    function handleCloseMovie() {
        setSelectedId(null);
    }

    useEffect(function () {
        async function fetchMovies() {
            try {
                setIsLoading(true);
                setError("");
                const res = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`);
                if (!res.ok) throw new Error("Something went wrong fetching movies");
                const data = await res.json();
                console.log(data);
                if (data.Response === "False") throw new Error("Movie not found");
                setMovies(data.Search);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        if (query.length < 3) {
            setError("");
            setMovies([]);
            return;
        }
        fetchMovies().then();
    }, [query]); /!* will only execute at mount phase *!/

    return (
        <>
            {/!* props drill down solution using components composition *!/}
            <NavBar>
                <Logo/>
                <Search query={query} setQuery={setQuery}/>
                <NumResults movies={movies}/>
            </NavBar>
            <Main>
                <Box>
                    {isLoading && <Loader/>}
                    {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie}/>}
                    {error && <ErrorMessage message={error}/>}
                </Box>
                <Box>
                    {selectedId ? <MovieDetails selectedId={selectedId} onCloseMovie={handleCloseMovie}/> :
                        <>
                            <Summary watched={watched}/>
                            <WatchedMoviesList watched={watched}/>
                        </>
                    }
                </Box>
            </Main>
        </>
    );
}

function Loader() {
    return <p className="loader">Loading...</p>;
}

function ErrorMessage({message}) {
    return (
        <p className="error">
            <span>⛔</span> {message}
        </p>
    );
}

function NavBar({children}) {
    return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
    return (
        <div className="logo">
            <span role="img">🍿</span>
            <h1>usePopcorn</h1>
        </div>
    );
}

function Search({query, setQuery}) {
    return (
        <input
            className="search"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
    );
}

function NumResults({movies}) {
    return (
        <p className="num-results">
            Found <strong>{movies?.length ? movies.length : 0}</strong> results
        </p>
    );
}

function Main({children}) {
    return <main className="main">{children}</main>;
}

function Box({children}) {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="box">
            <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
                {isOpen ? "–" : "+"}
            </button>
            {isOpen && children}
        </div>
    );
}

function MovieList({movies, onSelectMovie}) {
    return (
        <ul className="list list-movies">
            {movies?.map((movie) => (
                <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie}/>
            ))}
        </ul>
    );
}

function Movie({movie, onSelectMovie}) {
    return (
        <li onClick={() => onSelectMovie(movie.imdbID)}>
            <img src={movie.Poster} alt={`${movie.Title} poster`}/>
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>🗓</span>
                    <span>{movie.Year}</span>
                </p>
            </div>
        </li>
    );
}

function MovieDetails({selectedId, onCloseMovie}) {
    return (
        <div className="details">
            <button className="btn-back" onClick={onCloseMovie}>⇽</button>
            {selectedId}
        </div>
    );
}

function Summary({watched}) {
    const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
    const avgUserRating = average(watched.map((movie) => movie.userRating));
    const avgRuntime = average(watched.map((movie) => movie.runtime));
    return (
        <div className="summary">
            <h2>Movies you watched</h2>
            <div>
                <p>
                    <span>#️⃣</span> <span>{watched.length} movies</span>
                </p>
                <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{avgUserRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                </p>
            </div>
        </div>
    );
}

function WatchedMoviesList({watched}) {
    return (
        <ul className="list">
            {watched.map((movie) => (
                <WatchedMovie movie={movie} key={movie.imdbID}/>
            ))}
        </ul>
    );
}

function WatchedMovie({movie}) {
    return (
        <li>
            <img src={movie.Poster} alt={`${movie.Title} poster`}/>
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>⭐️</span>
                    <span>{movie.imdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{movie.userRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{movie.runtime} min</span>
                </p>
            </div>
        </li>
    );
}

/!*
        useEffect(function () {
            console.log("After every render")
        });

        useEffect(function () {
            console.log("After initial render")
        }, []);

        useEffect(function () {
            console.log("Synchronized with query")
        }, [query]);

        console.log("During Render");
    *!/*/
