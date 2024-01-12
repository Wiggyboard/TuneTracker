import { useEffect } from "react";

export default function Header({ isLoggedIn, setIsLoggedIn }) {
    const loginUser = () => {
        setIsLoggedIn(true);
    }

    const logOutUser = () => {
        setIsLoggedIn(false);
    }

    useEffect(() => {
        localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    }, [isLoggedIn]);

    return (
        <header>
            <h1 id="title">TuneTracker</h1>
            <div id="header-button-wrapper">
                {!isLoggedIn ?
                    <>
                        <button className="header-button">Sign-up</button>
                        <button className="header-button" id="header-login" onClick={loginUser}>Login</button>
                    </>
                    :
                    <button className="header-button" id="header-logout" onClick={logOutUser}>Log out</button>
                }
                <img id="menu-icon" src="images/menu-icon.svg" />
            </div>
        </header>
    )
}