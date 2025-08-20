/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect} from "react";

function useDestructor(callback: () => void) {
    useEffect(() => {
        return callback;
    }, []);
}

export default useDestructor;