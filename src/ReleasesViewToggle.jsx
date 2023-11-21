export default function ReleasesViewToggle({ view, setView }) {
    return (
        <div id="releases-view-toggle">
            <button
                className={`view-toggle-btn ${view === 'released' ? 'view-selected' : ''}`}
                onClick={() => setView('released')}
            >
                Released
            </button>
            <button
                className={`view-toggle-btn ${view === 'upcoming' ? 'view-selected' : ''}`}
                onClick={() => setView('upcoming')}
            >
                Upcoming
            </button>
        </div>
    )
}