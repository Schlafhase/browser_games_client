import Home from "./Pages/Home.tsx";
import NotFound from "./Pages/NotFound.tsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Pretender from "./Pages/Pretender/Pretender.tsx";
import ErrorBoundary from "./Components/ErrorBoundary.tsx";

function App() {

    return (
        <ErrorBoundary>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/pretender" element={<Pretender/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </BrowserRouter>
        </ErrorBoundary>
    )
}

export default App
