/*
import {useEffect, useState} from "react";
import StarRating from "./StarRating";

const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0).toFixed(1);

const KEY = `2078e62b`;

export default function App() {
    const [query, setQuery] = useState("");
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

    function handleAddWatched(movie) {
        setWatched(watched => [...watched, movie])
    }

    function handleDeleteWatched(id) {
        setWatched(watched => watched.filter(movie => movie.imdbID !== id));
    }

    useEffect(function () {
        const controller = new AbortController();

        async function fetchMovies() {
            try {
                setIsLoading(true);
                setError("");
                const res = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`,
                    {signal: controller.signal}
                );
                if (!res.ok)
                    throw new Error("Something went wrong fetching movies");
                const data = await res.json();
                if (data.Response === "False")
                    throw new Error("Movie not found");
                setMovies(data.Search);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message);
                }
            } finally {
                setIsLoading(false);
            }
        }

        if (query.length < 3) {
            setError("");
            setMovies([]);
            return;
        }
        handleCloseMovie();
        fetchMovies().then();
        return function () {
            controller.abort();
        }
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
                    {!isLoading && !error &&
                        <MovieList>{
                            movies?.map(movie => (
                                <Movie
                                    movie={movie}
                                    key={movie.imdbID}
                                    onSelectMovie={handleSelectMovie}
                                />
                            ))
                        }</MovieList>
                    }
                    {error && <ErrorMessage message={error}/>}
                </Box>
                <Box>
                    {selectedId ?
                        <MovieDetails
                            selectedId={selectedId}
                            onCloseMovie={handleCloseMovie}
                            onAddWatched={handleAddWatched}
                            watched={watched}
                        /> :
                        <>
                            <Summary watched={watched}/>
                            <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched}/>
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

function MovieList({children}) {
    return (
        <ul className="list list-movies">
            {children}
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

function MovieDetails({selectedId, onCloseMovie, onAddWatched, watched}) {
    const [movie, setMovie] = useState({});
    const [userRating, setUserRating] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    // const isWatched = watched.map(movie => movie.imdbID).includes(selectedId);

    const watchedMovie = watched.filter(mv => mv.imdbID === selectedId);
    const isWatched = watchedMovie.length === 1;


    const {
        Title: title,
        Year: year,
        Poster: poster,
        Runtime: runtime,
        imdbRating,
        Plot: plot,
        Released: released,
        Actors: actors,
        Director: director,
        Genre: genre
    } = movie; // derived state;

    function handleAdd() {
        const newWatchedMovie = {
            imdbID: selectedId,
            title,
            year,
            poster,
            imdbRating: Number(imdbRating),
            runtime: Number(runtime.split(" ").at(0)),
            userRating,
        };

        onAddWatched(newWatchedMovie);
        onCloseMovie();
    }

    useEffect(function () {
        function callback(e) {
            if (e.code === "Escape") {
                onCloseMovie();
            }
        }

        document.addEventListener("keydown", callback);

        return () => {
            document.removeEventListener("keydown", callback);
        }
    }, [onCloseMovie]);

    useEffect(function () {
        const controller = new AbortController();

        async function getMovieDetails() {
            try {
                setError("");
                setIsLoading(true);

                const res = await fetch(`http://www.omdbapi.com/?i=${selectedId}&apikey=${KEY}`, {signal: controller.signal});

                if (!res.ok) throw new Error("Something went wrong Fetching movie details");

                const data = await res.json();
                setMovie(data);
            } catch (error) {
                if (error.name !== "AbortError") {
                    setError(error.message);
                }
            } finally {
                setIsLoading(false);
            }
        }

        getMovieDetails().then();
        return function () {
            controller.abort();
        }
    }, [selectedId])

    useEffect(function () {
        if (!title) return;
        document.title = `Movie | ${title}`;

        /!* clojure in javascript is that function will remember its variables when it was created *!/
        return function () {
            document.title = "usePopcorn"
            // console.log(`Cleaning up effect for movie ${title}`)
        };
    }, [title])

    if (isLoading)
        return <Loader/>

    if (error)
        return <ErrorMessage message={error}/>

    if (!error && !isLoading)
        return (
            <div className="details">
                <header>
                    <button className="btn-back" onClick={onCloseMovie}>⇽</button>
                    <img src={poster} alt={`Poster of ${title} movie`}/>
                    <div className="details-overview">
                        <h2>{title}</h2>
                        <p>{released} &bull; {runtime}</p>
                        <p>{genre}</p>
                        <p><span>⭐</span> {imdbRating} IMDB rating</p>
                    </div>
                </header>
                <section>
                    <div className="rating">
                        {!isWatched ?
                            <>
                                < StarRating size={24} maxRating={10} defaultRating={0} onSetRating={setUserRating}/>
                                {userRating > 0 &&
                                    <button className="btn-add" onClick={handleAdd}>+ Add to Watched List</button>}
                            </>
                            : <p>You rated this movie with {watchedMovie.at(0).userRating} <span>⭐</span></p>
                        }
                    </div>
                    <p><em>{plot}</em></p>
                    <p>Starring {actors}</p>
                    <p>Directed By {director}</p>
                </section>
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

function WatchedMoviesList({watched, onDeleteWatched}) {
    return (
        <ul className="list">
            {watched.map((movie) => (
                <WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched}/>
            ))}
        </ul>
    );
}

function WatchedMovie({movie, onDeleteWatched}) {
    return (
        <li>
            <img src={movie.poster} alt={`${movie.title} poster`}/>
            <h3>{movie.title}</h3>
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
                <button className="btn-delete" onClick={() => onDeleteWatched(movie.imdbID)}>X</button>
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
    *!/


/!*
 const controller = new AbortController();
 fetch("url",{signal: controller.signal})
 clean up function ==> return function(){ controller. abort}
 handle error ==> catch(error){ if(error.name!== "AbortError"){setError(error.message)}}


 https request ==> abort http request
 adding event listener ==> remove event listener
*!/*/
