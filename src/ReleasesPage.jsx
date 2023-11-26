import { useState } from "react";
import ArtistSourceSelection from "./ArtistSourceSelection";
import ReleasesViewToggle from "./ReleasesViewToggle";
import LoadingScreen from "./LoadingScreen";

export default function ReleasesPage() {
    const [releases, setReleases] = useState([]);
    const [artistSource, setArtistSource] = useState('')
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState('released')

    return (
        <main>
            {artistSource === '' ? (
                <ArtistSourceSelection
                    setArtistSource={setArtistSource}
                    setReleases={setReleases}
                />
            ) : (
                <>
                    {loading ? (
                        <LoadingScreen
                            releases={releases}
                            setReleases={setReleases}
                            setLoading={setLoading}
                        />
                    ) : (
                        <>
                            <ReleasesViewToggle
                                view={view}
                                setView={setView}
                            />
                            <section className='release-list'>
                                {view === 'released' ? (
                                    releases.map((release, releaseID) => {
                                        const formattedDate = new Date(release.releaseDate);
                                        return formattedDate <= Date.now() ? (
                                            <div
                                                className='release-card'
                                                key={releaseID}
                                            >
                                                <img
                                                    className='release-cover'
                                                    src={release.cover}
                                                    alt='Release Cover Art'
                                                />
                                                <p className='release-artist'>{release.artist}</p>
                                                <p className='release-title'>{release.title}</p>
                                                <p className='release-date'>{release.releaseDate}</p>
                                            </div>
                                        ) : null;
                                    })
                                ) : null}
                                {view === 'upcoming' ? (
                                    releases.map((release, releaseID) => {
                                        const formattedDate = new Date(release.releaseDate);
                                        return formattedDate > Date.now() ? (
                                            <div
                                                className='release-card'
                                                key={releaseID}
                                            >
                                                <img
                                                    className='release-cover'
                                                    src={release.cover}
                                                    alt='Release Cover Art'
                                                />
                                                <p className='release-artist'>{release.artist}</p>
                                                <p className='release-title'>{release.title}</p>
                                                <p className='release-date'>{release.releaseDate}</p>
                                            </div>
                                        ) : null;
                                    })
                                ) : null}
                            </section>
                        </>
                    )}
                </>
            )}

        </main>
    )
}