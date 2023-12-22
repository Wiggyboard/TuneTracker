import { useState } from 'react';
import Header from './Header';
import Home from './Home';
import ReleasesPage from './ReleasesPage';
import './styles.css';

export default function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false)

	return (
		<div className='App'>
			<Header />
			{!isLoggedIn ?
				<Home /> :
				<ReleasesPage />}
		</div>
	)
}