import {useEffect, useState} from "react";

export function useLocalStorageState(initialState, key) {

    const [value, setValue] = useState(function () {
        const storedValue = JSON.parse(localStorage.getItem(key));
        return storedValue ? storedValue : initialState;
    });

    useEffect(function () {
        async function saveValueToLocalStorage() {
            localStorage.setItem(key, JSON.stringify(value));
        }

        // no need to clean up x Fetching, x EventListener
        saveValueToLocalStorage().then();
    }, [key, value])

    return [value, setValue];
}