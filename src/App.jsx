import { useState } from 'react';
import Header from './Header';
import Home from './Home';
import ReleasesPage from './ReleasesPage';
import './styles.css';

export default function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(() => {
		const storedState = localStorage.getItem('isLoggedIn');
		return storedState ? JSON.parse(storedState) : false;
	});

	return (
		<div className='App'>
			<Header
				isLoggedIn={isLoggedIn}
				setIsLoggedIn={setIsLoggedIn}
			/>
			{!isLoggedIn ?
				<Home />
				:
				<ReleasesPage />
			}
		</div>
	)
}