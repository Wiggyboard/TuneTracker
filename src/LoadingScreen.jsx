import { useEffect } from "react";

export default function LoadingScreen({ releases, setReleases, setLoading }) {

    /* let artists = ['Sufjan Stevens', 'Radiohead']; */

    /* let mbids = [
        "d67d3f47-f7b5-45fe-9567-a237746a6105",
        "76df3287-6cda-33eb-8e9a-044b5e15ffdd",
        "e9b0f69e-ee3d-36ed-8c12-f8ee65f87e45",
        "d40165ac-a2c9-4ab7-9844-b643106a5a9b",
        "8db9754a-154f-449a-9552-22c76ddc0264",
        "76df3287-6cda-33eb-8e9a-044b5e15ffdd",
        "d67d3f47-f7b5-45fe-9567-a237746a6105",
        "e9b0f69e-ee3d-36ed-8c12-f8ee65f87e45",
        "d40165ac-a2c9-4ab7-9844-b643106a5a9b",
        "8db9754a-154f-449a-9552-22c76ddc0264",
        "76df3287-6cda-33eb-8e9a-044b5e15ffdd",
        "d67d3f47-f7b5-45fe-9567-a237746a6105",
        "e9b0f69e-ee3d-36ed-8c12-f8ee65f87e45",
        "d40165ac-a2c9-4ab7-9844-b643106a5a9b",
        "8db9754a-154f-449a-9552-22c76ddc0264",
        "d67d3f47-f7b5-45fe-9567-a237746a6105",
        "e9b0f69e-ee3d-36ed-8c12-f8ee65f87e45",
        "d40165ac-a2c9-4ab7-9844-b643106a5a9b",
        "8db9754a-154f-449a-9552-22c76ddc0264",
        "d67d3f47-f7b5-45fe-9567-a237746a6105",
        "e9b0f69e-ee3d-36ed-8c12-f8ee65f87e45",
        "d40165ac-a2c9-4ab7-9844-b643106a5a9b",
        "8db9754a-154f-449a-9552-22c76ddc0264",
        "d67d3f47-f7b5-45fe-9567-a237746a6105",
        "e9b0f69e-ee3d-36ed-8c12-f8ee65f87e45",
        "d40165ac-a2c9-4ab7-9844-b643106a5a9b",
        "8db9754a-154f-449a-9552-22c76ddc0264"] */


    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        const fetchSpotifyArtists = async () => {
            return ['Sufjan Stevens', 'Geese', 'Aesop Rock', 'The Mountain Goats', 'Porcupine Tree'];
        }

        const fetchArtistID = async (artist) => {
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
            console.log(data);
            const sortedReleaseGroups = data['release-groups'].sort((a, b) => {
                return new Date(b['first-release-date']) - new Date(a['first-release-date']);
            });
            const mostRecentReleaseGroupID = sortedReleaseGroups[0].id;
            const title = sortedReleaseGroups[0]['title'];
            const releaseDate = sortedReleaseGroups[0]['first-release-date'];
            return { releaseGroupID: mostRecentReleaseGroupID, title: title, releaseDate: releaseDate };
        };

        const fetchReleaseID = async (releaseGroupID) => {
            const response = await fetch(`https://musicbrainz.org/ws/2/release-group/${releaseGroupID}?fmt=json&inc=releases`, {
                signal,
                headers: {
                    'User-Agent': 'TuneTracker/2.0.0-alpha (scottfreedman2@gmail.com)'
                }
            });
            const data = await response.json();

            // Checks for cover art
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