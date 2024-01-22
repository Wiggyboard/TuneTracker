import { useEffect } from 'react';

export default function LoadingScreen({ userData, artistSource, setReleases, setLoading }) {
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        // Fetches artists from Spotify
        const fetchSpotifyArtists = async () => {
            const spotifyAccessToken = userData.spotifyAccessToken;

            const response = await fetch('https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=20', {
                signal,
                headers: {
                    'Authorization': 'Bearer ' + spotifyAccessToken
                }
            });
            const data = await response.json();
            const spotifyArtists = data.items.map(artist => {
                return artist.name;
            });
            return spotifyArtists;
        }

        // Fetches artists from Last.fm
        const fetchLastfmArtists = async () => {
            const lastfmUsername = userData.lastfmUsername;
            const lastfmAPIKey = import.meta.env.VITE_REACT_APP_LASTFM_API_KEY;

            const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${lastfmUsername}&api_key=${lastfmAPIKey}&format=json&limit=20`);
            const data = await response.json();
            const lastfmArtists = data.topartists.artist.map(artist => {
                return artist.name;
            });
            return lastfmArtists;
        }

        const fetchArtistID = async (artist) => {
            const response = await fetch(`https://musicbrainz.org/ws/2/artist?query=artist:${artist}&fmt=json`, {
                signal,
                headers: {
                    'User-Agent': 'TuneTracker/2.0.0-alpha (scottfreedman2@gmail.com)'
                }
            });
            const data = await response.json();
            let artistID = data.artists[0].id;;
            for (let i = 0; i < data.artists.length; i++) {
                if (data.artists[i].name.toLowerCase() === artist.toLowerCase()) {
                    artistID = data.artists[i].id;
                    break;
                }
            }
            return { artistID: artistID };
        }

        const fetchReleaseGroupData = async (artistID) => {
            const response = await fetch(`https://musicbrainz.org/ws/2/release-group?artist=${artistID}&limit=100&fmt=json`, {
                signal,
                headers: {
                    'User-Agent': 'TuneTracker/2.0.0-alpha (scottfreedman2@gmail.com)'
                }
            });
            const data = await response.json();
            const sortedReleaseGroups = data['release-groups'].sort((a, b) => {
                return new Date(b['first-release-date']) - new Date(a['first-release-date']);
            });
            const mostRecentReleaseGroupID = sortedReleaseGroups[0].id;
            const title = sortedReleaseGroups[0]['title'];
            const releaseDate = sortedReleaseGroups[0]['first-release-date'];

            // Formats release date
            const timeFrames = releaseDate.split('-');
            const year = parseInt(timeFrames[0]);
            const month = parseInt(timeFrames[1]);
            const day = parseInt(timeFrames[2]);
            const date = new Date(year, month - 1, day);
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const monthName = monthNames[date.getMonth()];
            const formattedDate = monthName + ' ' + day + ', ' + year;

            return { releaseGroupID: mostRecentReleaseGroupID, title: title, releaseDate: formattedDate };
        };

        const fetchReleaseID = async (releaseGroupID) => {
            const response = await fetch(`https://musicbrainz.org/ws/2/release-group/${releaseGroupID}?fmt=json&inc=releases`, {
                signal,
                headers: {
                    'User-Agent': 'TuneTracker/2.0.0-alpha (scottfreedman2@gmail.com)'
                }
            });
            const data = await response.json();

            // Checks for cover art by looping through releaseIDs
            let releaseWithCover = null;
            for (let i = 0; i < data.releases.length; i++) {
                const response = await fetch(`http://coverartarchive.org/release/${data.releases[i].id.toString()}/front-250`, { signal });
                if (response.status === 200) {
                    releaseWithCover = i;
                    break;
                }
                else {
                    releaseWithCover = 0;
                }
            }

            const releaseID = data.releases[releaseWithCover].id;
            return { releaseID };
        }

        const fetchCover = async (releaseID) => {
            const response = await fetch(`http://coverartarchive.org/release/${releaseID}/front-250`, { signal });
            if (response.status === 404) {
                const cover = 'images/no-cover.svg';
                return { cover };
            }
            else {
                const imageBlob = await response.blob();
                const cover = URL.createObjectURL(imageBlob);
                return { cover };
            }
        }








        const updateReleases = async () => {
            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

            // Calls function to fetch artists from Spotify or Lastfm and updates releases with artist values.
            let artists = [];
            if (artistSource === 'spotify') {
                artists = await fetchSpotifyArtists();
            }
            else if (artistSource === 'lastfm') {
                artists = await fetchLastfmArtists();
            }
            const updatedReleases = artists.map(artist => ({ artist }));
            setReleases(updatedReleases);

            // Calls function to fetch artistIDs from MusicBrainz and updates releases with artistID values.
            const artistIDs = [];
            for (const artist of artists) {
                artistIDs.push(await fetchArtistID(artist));
                await delay(1500);
            }

            setReleases(prevReleases => {
                return prevReleases.map((release, index) => ({
                    ...release,
                    ...artistIDs[index],
                }));
            });

            // Calls function to fetch releaseGroupIDs, titles, and releaseDates from MusicBrainz and updates releases with those values.
            const releaseGroupData = [];
            for (const artistID of artistIDs) {
                releaseGroupData.push(await fetchReleaseGroupData(artistID.artistID));
                await delay(1500);
            }

            setReleases(prevReleases => {
                return prevReleases.map((release, index) => ({
                    ...release,
                    ...releaseGroupData[index],
                }));
            });

            // Calls function to fetch releaseIDs that have associated cover art from MusicBrainz and updates releases with MBID values.
            const releaseIDs = [];
            for (const releaseGroupID of releaseGroupData) {
                releaseIDs.push(await fetchReleaseID(releaseGroupID.releaseGroupID));
                await delay(1500);
            }

            setReleases(prevReleases => {
                return prevReleases.map((release, index) => ({
                    ...release,
                    ...releaseIDs[index],
                }));
            });

            // Calls function to fetch cover from CoverArtArchive and updates releases with cover values
            const covers = await Promise.all(releaseIDs.map(releaseID => fetchCover(releaseID.releaseID)));
            setReleases(prevReleases => {
                return prevReleases.map((release, index) => ({
                    ...release,
                    ...covers[index],
                }));
            });

            // Sort releases by date
            setReleases(prevReleases => {
                const sortedReleases = [...prevReleases];
                sortedReleases.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                return sortedReleases;
            });

            setLoading(false);
        }

        updateReleases();

        return () => {
            abortController.abort('Component unmounted');
        }
    }, []);








    return (
        <section id="loading-container">
            <h2>Fetching upcoming and recently released albums...</h2>
            <p>(This could take a few minutes)</p>
            <img id="loading-icon" src="images/loading-icon.svg" />
        </section>
    )
}