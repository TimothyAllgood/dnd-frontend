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
		const instance = axios.create(); // Removes Authorization from header for tom tom request
		delete instance.defaults.headers.common['Authorization'];
		const url = `https://api.tomtom.com/search/2/reverseGeocode/${lat}%2C${lng}.json?key=ojL8SrkEk0ntNQEO0Z1NUfadlxaugNYO`; // Sets url to use value of input for query
		const res = await instance.get(url); // Returns the data from the api call
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
		checkboxes.forEach((checkbox) => {
			console.log(checkbox.value);
			games.forEach((game) => {
				if (checkbox.value === game) {
					checkbox.checked = 'true';
				}
			});
		});
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
		const instance = axios.create(); // Removes Authorization from header for tom tom request
		delete instance.defaults.headers.common['Authorization'];
		const res = await instance.get(url); // Returns the data from the api call
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

	toggleReadOnly = (id) => {
		const inputEl = document.getElementById(id);
		const i = document.querySelector(`.${id}`);
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
			parent.querySelector('#cities').classList.add('city-select-show');
		} else {
			inputEl.readOnly = true;
			i.classList.add('fa-pencil-alt');
			i.classList.remove('fa-times');

			parent.querySelector('#cities').style.display = 'none';
			parent.querySelector('#cities').classList.remove('city-select-show');
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
		const i = document.querySelector('.roles-i');
		selectEl.classList.toggle('select-show');

		if (selectEl.classList.contains('select-show')) {
			i.classList.remove('fa-pencil-alt');
			i.classList.add('fa-times');
		} else {
			i.classList.add('fa-pencil-alt');
			i.classList.remove('fa-times');
		}
	};

	check = () => {
		if (this.props.currentUser === this.props.match.params.id) {
			this.setState({ currentCheck: true });
		}
	};

	addFriend = (e) => {
		User.addFriend(this.props.currentUser, [this.state]);
	};

	toggleModal = (e) => {
		const deleteModal = document.querySelector('.delete-modal');
		deleteModal.classList.toggle('modal-show');
	};

	deleteUser = (e) => {
		User.delete(this.props.currentUser);
		this.props.logout();
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
						<img src={this.state.img} alt='preview' className='preview' />
						<input
							onChange={this.handleImgChange}
							type='file'
							name='img'
							id='img'
						/>

						<label className='custom-label' for='img'>
							<i className='fas fa-upload'></i>
							Choose an image
						</label>
						<button className='img-btn' type='submit'>
							Update Image
						</button>
					</form>
					<div className='user-info'>
						<h2>{state.username}</h2>
						<p>{state.roles ? state.roles : 'No role'}</p>
						<div className='delete'>
							<span onClick={this.toggleModal}>Delete User</span>
						</div>
						<div className='delete-modal'>
							<i onClick={this.toggleModal} className='fas fa-times'></i>
							Are you sure you would like to delete your account?
							<span onClick={this.deleteUser} className='delete'>
								Delete User
							</span>
							<p className='warning'>
								<strong>Warning!</strong> This change is permanent.
							</p>
						</div>
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
						<form onSubmit={this.handleSubmit} className='profile-form'>
							<h2>Adventurer Info</h2>
							<div className='form-group username-form'>
								<label htmlFor='username'>
									<h3>Username</h3>
								</label>
								<input
									readOnly
									type='text'
									name='username'
									id='username'
									value={state.username}
									onChange={this.handleChange}
								/>
								<span
									onClick={() => this.toggleReadOnly('username')}
									className='toggle-edit'
								>
									<i className='fas fa-pencil-alt username'></i>
								</span>
							</div>
							<div className='form-group roles-form'>
								<label htmlFor='roles'>
									<h3>Roles</h3>
								</label>
								<select name='roles' id='roles' onChange={this.handleChange}>
									<option value='DM'>DM</option>
									<option value='Player'>Player</option>
									<option value='DM/Player'>DM/Player</option>
								</select>
								<span onClick={this.showSelect} className='toggle-edit'>
									<i className='fas fa-pencil-alt roles-i'></i>
								</span>
							</div>
							<div className='form-group bio-form'>
								<label htmlFor='bio'>
									<h3>About</h3>
								</label>
								<textarea
									readOnly
									type='text'
									name='bio'
									id='bio'
									value={state.bio}
									onChange={this.handleChange}
								>
									{state.bio}
								</textarea>
								<span
									onClick={() => this.toggleReadOnly('bio')}
									className='toggle-edit'
								>
									<i className='fas fa-pencil-alt bio'></i>
								</span>
							</div>
							<div className='form-group city-group'>
								<label htmlFor='city'>
									<h3>Location</h3>
								</label>
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
							<label htmlFor='games' className='games-form'>
								<h3>Games</h3>
							</label>
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
									<label htmlFor='PF'>Pathfinder 1e</label>
									<input
										type='checkbox'
										name='PF1e'
										id='PF1e'
										value='PF1e'
										className='checkbox'
										onChange={this.handleChange}
									/>
									<span className='custom-checkbox'></span>
								</div>
								<div className='checkbox-label'>
									<label htmlFor='PF'>Pathfinder 2e</label>
									<input
										type='checkbox'
										name='PF2e'
										id='PF2e'
										value='PF2e'
										className='checkbox'
										onChange={this.handleChange}
									/>
									<span className='custom-checkbox'></span>
								</div>
							</div>
							<div className='form-group checkbox-container-two'>
								<div className='checkbox-label'>
									<label htmlFor='5e'>Call of Cthulhu 7E</label>
									<input
										type='checkbox'
										name='CoC7e'
										id='CoC7e'
										value='CoC7e'
										className='checkbox'
										onChange={this.handleChange}
									/>
									<span className='custom-checkbox'></span>
								</div>
								<div className='checkbox-label'>
									<label htmlFor='PF'>Starfinder 1e</label>
									<input
										type='checkbox'
										name='SF1e'
										id='SF1e'
										value='SF1e'
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
