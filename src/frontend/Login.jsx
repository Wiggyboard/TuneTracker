export default function Login({ setCurrentPage, setIsLoggedIn }) {
    async function login() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const response = await fetch('https://wiggyboard.com/tunetracker/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result);
            localStorage.setItem('token', result.token);
            localStorage.setItem('userEmail', email);
            setIsLoggedIn(true);
            setCurrentPage('Releases');
        }
        else if (response.status === 401) {
            const error = await response.json();
            console.log('fail');
            document.getElementById('invalid-credentials').style.display = 'flex';
        }
        else {
            console.error('Error:', response);
        }
    }

    const openSignupPage = () => {
        setCurrentPage('Signup');
    }

    const openHomePage = () => {
        setCurrentPage('Home');
    }

    return (
        <section id='login-section'>
            <form>
                <p className='back-link'><a onClick={openHomePage}>Back</a></p>
                <h2>User Login</h2>
                <p>Don't have an account yet? <a onClick={openSignupPage}>Sign-up</a></p>
                <label htmlFor='email'>Email</label>
                <input type='text' id='email' />
                <label htmlFor='password'>Password</label>
                <input type='password' id='password' />
                <p id='invalid-credentials' className='error-text'>Invalid email or password</p>
                <div className='form-submit' onClick={login}>Login</div>
            </form>
        </section>
    )
}