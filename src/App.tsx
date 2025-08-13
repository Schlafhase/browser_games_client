import Home from "./Pages/Home.tsx";
import NotFound from "./Pages/NotFound.tsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import PretenderHome from "./Pages/Pretender/PretenderHome.tsx";

function App() {

    return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/pretender" element={<PretenderHome/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </BrowserRouter>
    )
}

export default App
