import { useState } from "react";
import ReleasesViewToggle from "./ReleasesViewToggle";
import LoadingScreen from "./LoadingScreen";

export default function ReleasesPage() {
    const [releases, setReleases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('released')

    return (
        <main>
            {loading ? (
                <LoadingScreen
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
        </main>
    )
}