import {useEffect, useState} from "react";

const KEY = `2078e62b`;

export function useMovies(query) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

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

        fetchMovies().then();
        return function () {
            controller.abort();
        }
    }, [query]); /* will only execute at mount phase */
    return {movies, isLoading, error};
}