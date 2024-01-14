import { useState } from 'react';
import Header from './Header';
import Home from './Home';
import Signup from './Signup';
import Login from './Login';
import ReleasesPage from './ReleasesPage';
import './styles.css';

export default function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(() => {
		const storedState = localStorage.getItem('isLoggedIn');
		return storedState ? JSON.parse(storedState) : false;
	});
	const [currentPage, setCurrentPage] = useState('Home')

	return (
		<div className='App'>
			<Header
				setCurrentPage={setCurrentPage}
				isLoggedIn={isLoggedIn}
				setIsLoggedIn={setIsLoggedIn}
			/>
			{isLoggedIn ? (
				<ReleasesPage />
			) : currentPage === 'Signup' ? (
				<Signup
					setCurrentPage={setCurrentPage}
					setIsLoggedIn={setIsLoggedIn}
				/>
			) : currentPage === 'Login' ? (
				<Login
					setCurrentPage={setCurrentPage}
					setIsLoggedIn={setIsLoggedIn}
				/>
			) : (
				<Home
					setCurrentPage={setCurrentPage}
				/>
			)}
		</div>
	);
}