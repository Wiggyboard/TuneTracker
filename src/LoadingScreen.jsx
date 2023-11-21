import { useEffect } from "react";

export default function LoadingScreen({ setReleases, setLoading }) {
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        const fetchSpotifyArtists = async () => {
            return ['Sufjan Stevens', 'Geese', 'Aesop Rock', 'HEALTH', 'Iron and Wine'];
        }

        const fetchArtistID = async (artist) => {
            /* sleep(3000); */
            const response = await fetch(`https://musicbrainz.org/ws/2/artist?query=artist:${artist}&fmt=json`, {
                signal,
                headers: {
                    'User-Agent': 'TuneTracker/2.0.0-alpha (scottfreedman2@gmail.com)'
                }
            });
            const data = await response.json();
            const artistID = data.artists[0].id
            return { artistID };
        };

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
                const cover = 'static/no-cover.svg';
                return { cover };
            }
            else {
                const imageBlob = await response.blob();
                const cover = URL.createObjectURL(imageBlob);
                return { cover };
            }
        }




        const updateReleases = async () => {

            // Calls function to fetch artists from Spotify and updates releases with artist values.
            const artists = await fetchSpotifyArtists();
            const updatedReleases = artists.map(artist => ({ artist }));
            setReleases(updatedReleases);

            // Calls function to fetch artistIDs from MusicBrainz and updates releases with artistID values.
            const artistIDs = await Promise.all(artists.map(fetchArtistID));
            setReleases(prevReleases => {
                return prevReleases.map((release, index) => ({
                    ...release,
                    ...artistIDs[index],
                }));
            });

            // Calls function to fetch releaseGroupIDs, titles, and releaseDates from MusicBrainz and updates releases with those values.
            const releaseGroupData = await Promise.all(artistIDs.map(artistID => fetchReleaseGroupData(artistID.artistID)));
            setReleases(prevReleases => {
                return prevReleases.map((release, index) => ({
                    ...release,
                    ...releaseGroupData[index],
                }));
            });

            // Calls function to fetch releaseIDs that have associated cover art from MusicBrainz and updates releases with MBID values.
            const releaseIDs = await Promise.all(releaseGroupData.map(releaseGroupID => fetchReleaseID(releaseGroupID.releaseGroupID)));
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
            <img id="loading-icon" src="static/loading-icon.svg" />
        </section>
    )
}