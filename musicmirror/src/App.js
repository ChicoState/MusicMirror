import AddSongs from './components/AddSongs';
import Playlist from './components/Playlist';
import SpotifyProfile from './components/SpotifyProfile';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Apple from './pages/apple';
import Youtube from './pages/youtube';
import Home from './pages/home';
import UserLog from "./pages/usrlogin"
import { useState } from 'react';

function App() {
let component
  switch(window.location.pathname){
    case "/Home":
      component = <Home/>   
      break
    case "/apple":
      component = <Apple/>
      break
    case "/youtube":
      component = <Youtube/>
      break
    case "/Usrlogin":
      component =<UserLog/>
      break
    default:
      component = <Home/>
      break

  }
  return (
    <>
    <Navbar/> 
      {component}
    </>
  )
  
}

export default App;
