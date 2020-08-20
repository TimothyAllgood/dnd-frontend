import React from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Routes from './config/Routes';

function App() {
	return (
		<main>
			<Navbar />

			<Routes />
		</main>
	);
}

export default App;
