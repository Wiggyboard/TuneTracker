import { useState } from "react";
import LoadingScreen from "./LoadingScreen";

export default function ReleasesPage() {
    const [releases, setReleases] = useState([]);
    const [loading, setLoading] = useState(true);

    return (
        <main>
            {loading ? (
                <LoadingScreen
                    releases={releases}
                    setReleases={setReleases}
                    setLoading={setLoading}
                />
            ) : (
                <section className='release-list'>
                    {releases.map((release, index) => (
                        <div
                            className='release-card'
                            key={index}
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
                    ))}
                </section>
            )}
        </main>
    )
}