import React from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Routes from './config/Routes';
import jwt_decode from 'jwt-decode';
import { withRouter } from 'react-router-dom';
import setAuthHeader from './util/setAuthHeader';
import io from 'socket.io-client';

const socket = io('https://shrouded-castle-10865.herokuapp.com/');

class App extends React.Component {
	state = {
		currentUser: '',
		currentUsername: '',
		socket: '',
	};

	componentDidMount() {
		const token = localStorage.getItem('token');
		if (token) {
			// Set Auth Header
			setAuthHeader(token);
			// Decode Token
			const decodedToken = jwt_decode(token);
			// Set State

			this.setState({
				currentUser: decodedToken.id,
				currentUsername: decodedToken.user,
			});

			console.log(socket.id); // undefined

			socket.on('connect', () => {
				this.setState({ socket: socket.id });
				socket.emit('fromClient', {
					user: this.state.currentUser,
					socket: this.state.socket,
				});
				console.log(socket.id); // 'G5p5...'
			});

			socket.on('hello', (data) => {
				console.log(data);
			});
		}
	}

	setCurrentUser = (token) => {
		// Store Token
		localStorage.setItem('token', token);
		// Set Auth Header
		setAuthHeader(token);
		// Decode Token
		const decodedToken = jwt_decode(token);
		// Set State
		this.setState({
			currentUser: decodedToken.id,
			currentUsername: decodedToken.user,
		});
	};

	logout = () => {
		// Remove Token
		localStorage.removeItem('token');
		// Remove Auth Header
		setAuthHeader();
		// Set State
		this.setState({ currentUser: '', currentUsername: '' });
		// Redirect
		this.props.history.push('/login');
	};
	render() {
		return (
			<main>
				<Navbar
					currentUser={this.state.currentUser}
					username={this.state.currentUsername}
					logout={this.logout}
				/>

				<Routes
					currentUser={this.state.currentUser}
					setCurrentUser={this.setCurrentUser}
				/>
			</main>
		);
	}
}

export default withRouter(App);
