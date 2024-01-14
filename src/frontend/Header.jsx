import { useEffect } from "react";

export default function Header({ setCurrentPage, isLoggedIn, setIsLoggedIn }) {
    const openSignupPage = () => {
        setCurrentPage('Signup');
    }

    const openLoginPage = () => {
        setCurrentPage('Login');
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
                        <button className="header-button" onClick={openSignupPage}>Sign-up</button>
                        <button className="header-button" id="header-login" onClick={openLoginPage}>Login</button>
                    </>
                    :
                    <button className="header-button" id="header-logout" onClick={logOutUser}>Log out</button>
                }
                <img id="menu-icon" src="images/menu-icon.svg" />
            </div>
        </header>
    )
}