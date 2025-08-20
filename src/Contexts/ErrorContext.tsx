import { createContext, useState, type ReactNode } from 'react';

interface ErrorState {
    message: string;
    details?: string;
}

interface ErrorContextType {
    error: ErrorState | null;
    show: (message: string, details?: string) => void;
    clear: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

function ErrorProvider({ children }: { children?: ReactNode }) {
    const [error, setError] = useState<ErrorState | null>(null);

    const show = (message: string, details?: string) => {
        console.error(message, details);
        setError({ message, details });
    };

    const clear = () => {
        setError(null);
    };

    return (
        <ErrorContext.Provider value={{ error, show, clear }}>
            {children}
        </ErrorContext.Provider>
    );
}

export default ErrorContext;
export { ErrorProvider };