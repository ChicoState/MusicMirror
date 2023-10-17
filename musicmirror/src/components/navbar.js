import React, {useState} from "react";
import '../styles/Home.css';
import "../styles/navbar.css";
import {Link} from 'react-router-dom';
import Home from "../pages/home";
import apple from "../pages/apple"; 
import SpotifyProfile  from "./SpotifyProfile";
const Navbar = () => {

    // to change burger classes
    const [burger_class, setBurgerClass] = useState("burger-bar unclicked")
    const [menu_class, setMenuClass] = useState("menu hidden")
    const [isMenuClicked, setIsMenuClicked] = useState(false)

    // toggle burger menu change
    const updateMenu = () => {
        if(!isMenuClicked) {
            setBurgerClass("burger-bar clicked")
            setMenuClass("menu visible")
        }
        else {
            setBurgerClass("burger-bar unclicked")
            setMenuClass("menu hidden")
        }
        setIsMenuClicked(!isMenuClicked)
    }

    return(
        <div >
            <nav>
                <div className="burger-menu" onClick={updateMenu}>
                    <div className={burger_class} ></div>
                    <div className={burger_class} ></div>
                    <div className={burger_class} ></div>
                </div>
                <div>
        </div> 
            </nav>

            <div className={menu_class}>
                <ul className="menu-links">
                    <li>
                        <Link to="/" onClick={updateMenu}> Home</Link>
                    </li>
                    <li>
                        <Link to="/Apple" onClick={updateMenu}> Apple</Link>
                    </li>
                    <li>
                        <Link to="/Spotify" onClick={updateMenu}> Spotify</Link>
                    </li>
                    <li>
                        <Link to="/Youtube" onClick={updateMenu}> Youtube</Link>
                    </li>
                    
                </ul>
            </div>
        
        </div>
        
    )
}

export default Navbar