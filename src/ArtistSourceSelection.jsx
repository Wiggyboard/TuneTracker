import { useState } from 'react';

export default function ArtistSourceSelection({ setUserData, setArtistSource, setLoading }) {
    const [isFlipped, setFlipped] = useState(false);

    // Flips Last.fm connection card
    const flipLastFMCard = () => {
        setFlipped(!isFlipped);
    }

    // Sets artistSource as Spotify
    const setSpotify = () => {
        setArtistSource('spotify');
    }

    // Sets artistSource as Last.fm
    const setLastfm = () => {
        const lastfmUsername = document.getElementById("lastfm-username").value;
        setUserData({ lastfmUsername: lastfmUsername });
        setArtistSource('lastfm');
        setLoading(true);
    }

    return (
        <section id='artist-source-selection'>
            <h2 id='welcome-user'>Welcome, Username!</h2>
            <h2>To get started, link TuneTracker to your Spotify or Last.fm account</h2>

            <div id='connect-card-container'>
                <div className='connect-card' id='spotify-card' onClick={setSpotify}>
                    <img className='connect-icon' src='static/spotify-icon.svg' />
                    <p>Connect to Spotify</p>
                </div>

                <div className='card-container'>
                    <div className={`card-flip ${isFlipped ? 'card-flipped' : ''}`} onClick={isFlipped ? null : flipLastFMCard}>
                        <div className='connect-card' id='lastfm-card-front'>
                            <img className='connect-icon' src='static/lastfm-icon.svg' />
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