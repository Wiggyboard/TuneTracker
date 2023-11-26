import { useState } from 'react';

export default function ArtistSourceSelection({ setArtistSource, setReleases }) {
    const [isFlipped, setFlipped] = useState(false);

    // Fetches artists from Last.fm
    const connectLastfm = () => {
        const lastfmUsername = document.getElementById("lastfm-username").value;
        const lastfmAPIKey = import.meta.env.VITE_REACT_APP_LASTFM_API_KEY;

        fetch(`https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${lastfmUsername}&api_key=${lastfmAPIKey}&format=json&limit=20`)
            .then(response => response.json())
            .then(data => {
                const lastfmArtists = data.topartists.artist.map(artist => {
                    return artist.name;
                });
                const updatedReleases = lastfmArtists.map(artist => ({ artist }));
                setReleases(updatedReleases);
            });
    }

    // Flips Last.fm connection card
    const flipLastFMCard = () => {
        setFlipped(!isFlipped);
    };


    return (
        <section id='artist-source-selection'>
            <h2 id='welcome-user'>Welcome, Username!</h2>
            <h2>To get started, link TuneTracker to your Spotify or Last.fm account</h2>

            <div id='connect-card-container'>
                <div className='connect-card' id='spotify-card' onClick='connectSpotify()'>
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
                            <div className='form-submit' onClick={connectLastfm}>Submit</div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}