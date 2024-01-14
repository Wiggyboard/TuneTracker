export default function Home({ setCurrentPage }) {
    const openSignupPage = () => {
        setCurrentPage('Signup');
    }

    // Animates-in elements on scroll
    function checkScroll() {
        const elementsToAnimate = document.querySelectorAll('.animate-in');

        elementsToAnimate.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop + 200 < windowHeight) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    window.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    checkScroll();

    return (
        <main id="home-main">
            <section className='diagonal'>
                <div id='diagonal-wrapper'>
                    <div id='dw-left'>
                        <h2>Easily track upcoming and recently-released albums from the artists YOU love.</h2>
                        <div id='button-wrapper'>
                            <button id='create-button' className='diagonal-button' onClick={openSignupPage}>Create Account</button>
                            <a href='#about'>
                                <button id='learn-button' className='diagonal-button'>Learn More</button>
                            </a>
                        </div>
                    </div>
                    <div id='preview-wrapper'>
                        <img id='preview' src='images/preview.png' />
                    </div>
                </div>
            </section>

            <div className='wave-container'></div>

            <section id='about'>
                <h2>How it works</h2>
                <div id='steps-wrapper'>
                    <div className='step animate-in' id='step-1'>
                        <h3>1</h3>
                        <p>Create an account</p>
                        <img className='step-icon' src='images/create-account-icon.svg' />
                    </div>
                    <div className='step animate-in' id='step-2'>
                        <h3>2</h3>
                        <p>Connect your Spotify or Last.fm account</p>
                        <img className='step-icon' id='spotify-icon' src='images/spotify-icon.svg' />
                        <img className='step-icon' id='lastfm-icon' src='images/lastfm-icon.svg' />
                    </div>
                    <div className='step animate-in' id='step-3'>
                        <h3>3</h3>
                        <p>View upcoming and recently-released albums from artists you listen to</p>
                        <img className='step-icon' src='images/albums-icon.svg' />
                    </div>
                </div>
                <div className='animate-in' id='bottom-create'>
                    <h3>Ready to get started?</h3>
                    <button id='create-button' onClick={openSignupPage}>Create Account</button>
                </div>
            </section>
        </main>
    )
}