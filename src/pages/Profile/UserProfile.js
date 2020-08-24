import React, { Component } from 'react';
import User from '../../models/User';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
require('./Profile.css');
require('./User.css');

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
		img: '',
		currentCheck: false,
		friends: false,
		currentUser: [],
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
			img: user.profileImg,
		};
		this.check();
		let currentUser;
		if (!this.state.currentCheck) {
			currentUser = await User.get(this.props.currentUser);
			this.setState({ currentUser: currentUser.data.foundUser.friends });
		}
		this.setState(userInfo);
		if (this.props.currentUser && this.state.currentCheck) {
			if (!user.city) {
				// Get user location using geolocation
				const options = {
					enableHighAccuracy: true,
					timeout: 5000,
					maximumAge: 0,
				};
				const success = (pos) => {
					var crd = pos.coords;

					this.setState({ lat: crd.latitude, lng: crd.longitude });
					this.reverseGeocode(crd.latitude, crd.longitude);
				};

				const error = (err) => {
					console.warn(`ERROR(${err.code}): ${err.message}`);
				};

				navigator.geolocation.getCurrentPosition(success, error, options);
			}
			this.setCheckbox(this.state.games);
			this.handleSelect(this.state.roles);
		}

		for (let user of this.state.currentUser) {
			if (user.username === this.state.username) {
				this.setState({ friends: true });
			}
		}
	}

	async reverseGeocode(lat, lng) {
		// Reverse geocode the lat, lng from the geolocation and add city to db
		const url = `https://api.tomtom.com/search/2/reverseGeocode/${lat}%2C${lng}.json?key=ojL8SrkEk0ntNQEO0Z1NUfadlxaugNYO`; // Sets url to use value of input for query
		const res = await axios.get(url); // Returns the data from the api call
		this.setState({ city: res.data.addresses[0].address.freeformAddress });
		try {
			const res = await User.update(this.props.match.params.id, this.state);

			console.log(res);
		} catch (error) {
			console.log(error);
		}
	}

	setCheckbox = (games) => {
		// console.log('hello');
		const checkboxes = document.querySelectorAll('.checkbox');
		for (let i = 0; i < games.length; i++) {
			if (checkboxes[i].value === games[i]) {
				checkboxes[i].checked = 'true';
			} else {
				checkboxes[i].checked = 'false';
			}
		}
	};

	handleChange = (e) => {
		if (e.target.type === 'checkbox') {
			if (e.target.checked) {
				this.setState({ games: [...this.state.games, e.target.name] });
			} else {
				const removal = this.state.games.filter((value, index, arr) => {
					return value !== e.target.name;
				});
				this.setState({ games: removal });
				console.log(removal);
			}
		}
		this.setState({ [e.target.name]: e.target.value });
	};

	handleImgChange = (e) => {
		const img = document.querySelector('.preview');
		const reader = new FileReader();
		const file = e.target.files[0];
		reader.onloadend = function () {
			img.src = reader.result;
		};
		reader.readAsDataURL(file);
		this.setState({ img: file });
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

	handleImgSubmit = async (e) => {
		e.preventDefault();
		e.preventDefault();
		try {
			const res = await User.updateImg(
				this.props.match.params.id,
				this.state.img
			);

			console.log(res);
			this.setState({ img: res.data.updatedUser.profileImg });
			const imgForm = document.querySelector('.img-form');
			imgForm.classList.add('hidden');
		} catch (error) {
			console.log(error);
		}
	};

	toggleForm = (e) => {
		const imgForm = document.querySelector('.img-form');
		imgForm.classList.toggle('hidden');
	};

	toggleReadOnly = (e) => {
		const parent = e.target.parentElement.parentElement;
		const inputEl = parent.querySelector('input');
		const i = parent.querySelector('i');
		console.log(inputEl.id);
		if (inputEl.readOnly) {
			inputEl.readOnly = false;
			i.classList.remove('fa-pencil-alt');
			i.classList.add('fa-times');
		} else {
			inputEl.readOnly = true;
			i.classList.add('fa-pencil-alt');
			i.classList.remove('fa-times');
		}
	};
	toggleTomTomReadOnly = (e) => {
		const parent = e.target.parentElement.parentElement;
		const inputEl = document.getElementById('city');
		const i = document.querySelector(
			'#root > main > section > div.profile-right > form > div.form-group.city-group > span > i'
		);
		console.log(inputEl.id);
		if (inputEl.readOnly) {
			inputEl.readOnly = false;
			i.classList.remove('fa-pencil-alt');
			i.classList.add('fa-times');

			document.querySelector('.cities-search').style.opacity = '1';
			parent.querySelector('#cities').style.display = 'initial';
		} else {
			inputEl.readOnly = true;
			i.classList.add('fa-pencil-alt');
			i.classList.remove('fa-times');

			parent.querySelector('#cities').style.display = 'none';
			document.querySelector('.cities-search').style.opacity = '0';
		}
	};

	handleSelect = (role) => {
		const selectEl = document.getElementById('roles');
		const options = selectEl.querySelectorAll('option');
		options.forEach((option) => {
			if (option.value === role) {
				option.selected = true;
			}
		});
	};

	showSelect = (e) => {
		const selectEl = document.getElementById('roles');

		selectEl.classList.toggle('select-show');
	};

	check = () => {
		if (this.props.currentUser === this.props.match.params.id) {
			this.setState({ currentCheck: true });
		}
	};

	addFriend = (e) => {
		User.addFriend(this.props.currentUser, [this.state]);
	};

	render() {
		const state = this.state;

		return (
			<section className='container profile'>
				<div className='profile-left'>
					<div className='profile-image-container'>
						<img src={this.state.img} className='profile-img' alt='' />
						{state.currentCheck && (
							<span onClick={this.toggleForm} className='img-form-toggle'>
								<i className='fas fa-plus'></i>
							</span>
						)}
					</div>
					<form
						onSubmit={this.handleImgSubmit}
						encType='multipart/form-data'
						className='img-form hidden'
					>
						<span onClick={this.toggleForm} className='img-form-toggle close'>
							<i className='fas fa-times'></i>
						</span>
						<h2>Update Profile Image</h2>
						<img
							src='https://picsum.photos/150'
							alt='preview'
							className='preview'
						/>
						<label htmlFor='img'>Profile Image</label>
						<input onChange={this.handleImgChange} type='file' name='img' />
						<button type='submit'>Update Image</button>
					</form>
					<div className='user-info'>
						<h2>{state.username}</h2>
						<p>{state.roles ? state.roles : 'No role'}</p>
						{!state.friends && !state.currentCheck && (
							<span onClick={this.addFriend}>Add Friend</span>
						)}
					</div>
				</div>
				<div className='profile-right'>
					{!state.currentCheck && (
						<div className='profile-info'>
							<div className='user-group'>
								<p>Username</p>
								<p>{state.username}</p>
							</div>
							<div className='user-group'>
								<p>Roles</p>
								<p>{state.roles}</p>
							</div>
							<div className='user-group'>
								<p>About</p>
								<p>{state.bio}</p>
							</div>
							<div className='user-group'>
								<p>Location</p>
								<p>{state.city}</p>
							</div>
							<div className='user-group'>
								<p>Games</p>
								{state.games.map((game) => (
									<p key={game}>{game}</p>
								))}
							</div>
						</div>
					)}
					{state.currentCheck && (
						<form onSubmit={this.handleSubmit} className='profile-info'>
							<h2>Adventurer Info</h2>
							<div className='form-group'>
								<label htmlFor='username'>Username</label>
								<input
									readOnly
									type='text'
									name='username'
									id='username'
									value={state.username}
									onChange={this.handleChange}
								/>
								<span onClick={this.toggleReadOnly} className='toggle-edit'>
									<i className='fas fa-pencil-alt'></i>
								</span>
							</div>
							<div className='form-group'>
								<label htmlFor='roles'>Roles</label>
								<select name='roles' id='roles' onChange={this.handleChange}>
									<option value='DM'>DM</option>
									<option value='Player'>Player</option>
									<option value='DM/Player'>DM/Player</option>
								</select>
								<span onClick={this.showSelect} className='toggle-edit'>
									<i className='fas fa-pencil-alt'></i>
								</span>
							</div>
							<div className='form-group'>
								<label htmlFor='bio'>About</label>
								<input
									readOnly
									type='text'
									name='bio'
									id='bio'
									value={state.bio}
									onChange={this.handleChange}
								/>
								<span onClick={this.toggleReadOnly} className='toggle-edit'>
									<i className='fas fa-pencil-alt'></i>
								</span>
							</div>
							<div className='form-group city-group'>
								<label htmlFor='city'>City</label>
								{state.city}

								<div className='cities-search'>
									<input
										type='text'
										name='city'
										id='city'
										readOnly
										onChange={this.handleTomTom}
									/>
									<select
										onChange={this.handleTomTomChange}
										id='cities'
										style={{ display: 'none' }}
									></select>
								</div>
								<span
									onClick={this.toggleTomTomReadOnly}
									className='toggle-edit'
								>
									<i className='fas fa-pencil-alt'></i>
								</span>
							</div>
							<label htmlFor='games'>Games</label>
							<div className='form-group checkbox-container'>
								<div className='checkbox-label'>
									<label htmlFor='5e'>D&D5e</label>
									<input
										type='checkbox'
										name='D&D5e'
										id='5e'
										value='D&D5e'
										className='checkbox'
										onChange={this.handleChange}
									/>
									<span className='custom-checkbox'></span>
								</div>
								<div className='checkbox-label'>
									<label htmlFor='PF'>Pathfinder 2e</label>
									<input
										type='checkbox'
										name='PF'
										id='PF'
										value='PF'
										className='checkbox'
										onChange={this.handleChange}
									/>
									<span className='custom-checkbox'></span>
								</div>
							</div>
							<button className='btn' type='submit'>
								Update Form
							</button>
						</form>
					)}
				</div>
			</section>
		);
	}
}

export default withRouter(Profile);
