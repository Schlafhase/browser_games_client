import Home from "./Pages/Home.tsx";
import NotFound from "./Pages/NotFound.tsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Pretender from "./Pages/Pretender/Pretender.tsx";

function App() {

    return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/pretender" element={<Pretender/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </BrowserRouter>
    )
}

export default App
