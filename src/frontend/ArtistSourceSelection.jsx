import { useState, useEffect } from 'react';

export default function ArtistSourceSelection({ setUserData, setArtistSource, setLoading }) {
    const [isFlipped, setFlipped] = useState(false);
    const params = new URLSearchParams(window.location.hash.slice(1));
    const spotifyAccessToken = params.get('access_token');

    // Authorizes Spotifty account
    const authorizeSpotify = () => {
        const clientID = import.meta.env.VITE_REACT_APP_SPOTIFY_CLIENT_ID;
        const redirectURI = 'https://wiggyboard.com/tunetracker/';
        const scope = 'user-top-read';
        const authURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&redirect_uri=${redirectURI}&scope=${scope}`;

        // Redirects to Spotify authorization page
        window.location.href = authURL;
    }

    // Sets artistSource as Spotify
    const setSpotify = () => {
        setUserData({ spotifyAccessToken: spotifyAccessToken });
        setArtistSource('spotify');
        setLoading(true);
    }

    // Checks on page load if a Spotify access token exists
    useEffect(() => {
        if (spotifyAccessToken) {
            setSpotify();
        }
    }, []);

    // Flips Last.fm connection card
    const flipLastFMCard = () => {
        setFlipped(!isFlipped);
    }

    // Sets artistSource as Last.fm
    const setLastfm = () => {
        const lastfmUsername = document.getElementById('lastfm-username').value;
        setUserData({ lastfmUsername: lastfmUsername });
        setArtistSource('lastfm');
        setLoading(true);
    }

    return (
        <section id='artist-source-selection'>
            <h2 id='welcome-user'>Welcome!</h2>
            <h2>To get started, connect TuneTracker to your Spotify or Last.fm account</h2>

            <div id='connect-card-container'>
                <div className='connect-card' id='spotify-card' onClick={authorizeSpotify}>
                    <img className='connect-icon' src='images/spotify-icon.svg' />
                    <p>Connect to Spotify</p>
                </div>

                <div className='card-container'>
                    <div className={`card-flip ${isFlipped ? 'card-flipped' : ''}`} onClick={isFlipped ? null : flipLastFMCard}>
                        <div className='connect-card' id='lastfm-card-front'>
                            <img className='connect-icon' src='images/lastfm-icon.svg' />
                            <p>Connect to Last.fm</p>
                        </div>
                        <div className='card-back'>
                            <p>Last.fm username:</p>
                            <input type='text' id='lastfm-username' />
                            <div className='form-submit' onClick={setLastfm}>Submit</div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}