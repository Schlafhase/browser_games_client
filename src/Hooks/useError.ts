import ErrorContext from "../Contexts/ErrorContext.tsx";
import {useContext} from "react";

function useError() {
    const context = useContext(ErrorContext);
    if (context === undefined) {
        throw new Error('useError must be used within an ErrorProvider');
    }
    return context;
}

export default useError;