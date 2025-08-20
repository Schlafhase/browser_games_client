/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useRef} from "react";

function useFirstRenderLogic(callback: () => void) {
    const firstRender = useRef(true);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            callback();
        }
    }, []);
}

export default useFirstRenderLogic;