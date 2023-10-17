import Navbar from './components/navbar';
import React from "react";
import Apple from './pages/apple';
import Youtube from "./pages/youtube";
import Spotify from './pages/spotifyLogin';
import Home from './pages/home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <Router>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/apple" element={<Apple />} />
                <Route path="/spotify" element={<Spotify />} />
                <Route path="/youtube" element={<Youtube />} />
                {/* Include any other routes you might have */}
            </Routes>
        </Router>
    );
}

export default App;
