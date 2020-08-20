import React, { Component } from 'react';
import User from '../../models/User';
import axios from 'axios';

class Profile extends Component {
	state = {
		username: '',
		email: '',
		password: '',
		games: [],
		roles: '',
		bio: '',
		city: '',
		lat: '',
		lng: '',
	};

	async componentDidMount() {
		const res = await User.get(this.props.match.params.id);
		const user = res.data.foundUser;
		const userInfo = {
			username: user.username,
			email: user.email,
			games: user.games,
			roles: user.roles,
			bio: user.bio,
			city: user.city,
			lat: user.lat,
			lng: user.lng,
		};
		this.setState(userInfo);
	}

	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	handleTomTomChange = (e) => {
		this.setState(JSON.parse(e.target.value));
	};

	handleTomTom = async (e) => {
		// Handles change of tom tom search input
		const url = `https://api.tomtom.com/search/2/geocode/${e.target.value}.json?key=ojL8SrkEk0ntNQEO0Z1NUfadlxaugNYO`; // Sets url to use value of input for query
		const res = await axios.get(url); // Returns the data from the api call
		const citiesEl = document.getElementById('cities'); // cities
		citiesEl.style.display = 'initial'; // Display select when input changes
		citiesEl.innerHTML = ''; // Empty out select
		res.data.results.forEach((result) => {
			const city = result.address.freeformAddress; // location name
			const option = `<option class="city"value='{"city":"${city}","lat":"${result.position.lat}","lng":"${result.position.lon}"}'>${city}</option>`;
			citiesEl.insertAdjacentHTML('beforeend', option);
		});
		const options = document.querySelectorAll('.city');
		if (options.length > 0) {
			this.setState(JSON.parse(options[0].value));
		}
	};

	handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await User.update(this.props.match.params.id, this.state);

			console.log(res);
		} catch (error) {
			console.log(error);
		}
	};

	render() {
		const state = this.state;
		return (
			<section>
				<div className='profile-left'>
					<h2>{state.username}</h2>
					<p>{state.roles ? state.roles : 'No role'}</p>
				</div>
				<div className='profile-right'>
					<form onSubmit={this.handleSubmit}>
						<div className='form-group'>
							<label htmlFor='username'>Username</label>
							<input
								type='text'
								name='username'
								id='username'
								value={state.username}
								onChange={this.handleChange}
							/>
						</div>
						<div className='form-group'>
							<label htmlFor='roles'>Roles</label>
							<select name='roles' id='roles' onChange={this.handleChange}>
								<option value='DM'>DM</option>
								<option value='Player'>Player</option>
								<option value='DM/Player'>DM/Player</option>
							</select>
						</div>
						<div className='form-group'>
							<label htmlFor='city'>City</label>
							<p>{state.city}</p>
							<input type='text' name='city' onChange={this.handleTomTom} />
							<select
								onChange={this.handleTomTomChange}
								id='cities'
								style={{ display: 'none' }}
							></select>
						</div>
						<button type='submit'>Update Form</button>
					</form>
				</div>
			</section>
		);
	}
}

export default Profile;
