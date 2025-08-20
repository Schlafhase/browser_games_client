import useError from "../Hooks/useError.ts";
import {ErrorProvider} from "../Contexts/ErrorContext.tsx";
import Error from "./Error.tsx";
import type {ReactNode} from "react";

function InnerErrorBoundary({children}: { children?: ReactNode }) {
    const context = useError();

    return (<>
        {context.error ? (
            <Error error={context.error.message} errorDetails={context.error.details}/>
        ) : (
            children
        )}
    </>)
}

function ErrorBoundary({children}: { children?: ReactNode }) {

    return (
        <ErrorProvider>
            <InnerErrorBoundary>{children}</InnerErrorBoundary>
        </ErrorProvider>
    )
}

export default ErrorBoundary;