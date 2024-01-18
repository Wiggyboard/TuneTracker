export default function Signup({ setCurrentPage, setIsLoggedIn }) {
    async function signUp() {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();

        document.getElementById('invalid-email').style.display = 'none';
        document.getElementById('invalid-password').style.display = 'none';
        document.getElementById('password-mismatch').style.display = 'none';
        document.getElementById('existing-email').style.display = 'none';

        const signUpData = {
            email: email,
            password: password,
            confirmPassword: confirmPassword,
        };

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            document.getElementById('invalid-email').style.display = 'flex';
        }
        else if (password !== confirmPassword) {
            document.getElementById('password-mismatch').style.display = 'flex';
        }
        else if (password.length < 8) {
            document.getElementById('invalid-password').style.display = 'flex';
        }
        else {
            try {
                const response = await fetch('https://api.wiggyboard.com:3000/users/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(signUpData),
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log(result);
                    localStorage.setItem('token', result.data.token);
                    localStorage.setItem('userEmail', email);
                    setIsLoggedIn(true);
                    setCurrentPage('Releases');
                }
                else if (response.status === 401) {
                    document.getElementById('existing-email').style.display = 'flex';
                }
            }
            catch (err) {
                console.error(err);
            }
        }
    }

    const openLoginPage = () => {
        setCurrentPage('Login');
    }

    const openHomePage = () => {
        setCurrentPage('Home');
    }

    return (
        <section id='signup-section'>
            <form>
                <p className='back-link'><a onClick={openHomePage}>Back</a></p>
                <h2>User Sign-Up</h2>
                <p>Already have an account? <a onClick={openLoginPage}>Log in</a></p>
                <label htmlFor='email'>Email</label>
                <input type='text' id='email' />
                <label htmlFor='password'>Password</label>
                <input type='password' id='password' />
                <label htmlFor='confirm-password'>Confirm password</label>
                <input type='password' id='confirm-password' />
                <p id='invalid-email' className='error-text'>Email must be valid</p>
                <p id='invalid-password' className='error-text'>Password must be at least 8 characters</p>
                <p id='password-mismatch' className='error-text'>Passwords must match</p>
                <p id='existing-email' className='error-text'>Email already in use</p>
                <div className='form-submit' onClick={signUp}>Create Account</div>
            </form>
        </section>
    )
}