import React, { Component } from 'react';
import User from '../../models/User';
import Conversation from '../../models/Conversation';
import { withRouter } from 'react-router-dom';
require('./Profile.css');

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
		existingConversation: false,
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
			id: user._id,
		};
		this.check();
		let currentUser;
		if (!this.state.currentCheck) {
			currentUser = await User.get(this.props.currentUser);
			currentUser.data.foundUser.friends.map((friend) => {
				if (friend.username === user.username) {
					this.setState({ friends: true });
				}
			});

			this.setState({ currentUser: currentUser.data.foundUser.friends });
		}

		const conversation = await Conversation.get(
			this.props.currentUser,
			this.props.match.params.id
		);

		if (conversation.data.foundConversation) {
			this.setState({ existingConversation: true });
		}

		this.setState(userInfo);
	}

	check = () => {
		if (this.props.currentUser === this.props.match.params.id) {
			this.setState({ currentCheck: true });
		}
	};

	addFriend = (e) => {
		User.addFriend(this.props.currentUser, [this.state]);
	};

	startConversation = (e) => {
		Conversation.start(this.props.currentUser, this.props.match.params.id);
		this.props.history.push(`/messages/${this.props.currentUser}`);
	};

	viewConversation = (e) => {
		this.props.history.push(
			`/messages/${this.props.currentUser}/${this.props.match.params.id}`
		);
	};

	render() {
		const state = this.state;

		return (
			<section className='container profile'>
				<div className='profile-left'>
					<div className='profile-image-container'>
						<img src={this.state.img} className='profile-img' alt='' />
					</div>
					<div className='user-info'>
						<h2>{state.username}</h2>
						<p>{state.roles ? state.roles : 'No role'}</p>
						<div className='user-btn-container'>
							{!state.friends && (
								<span onClick={this.addFriend}>Add Friend</span>
							)}
							{!state.existingConversation ? (
								<span onClick={this.startConversation}>Start Conversation</span>
							) : (
								<span onClick={this.viewConversation}>View Messages</span>
							)}
						</div>
					</div>
				</div>
				<div className='profile-right'>
					{!state.currentCheck && (
						<div className='profile-info'>
							<h2>Adventurer Info</h2>
							<div className='user-group'>
								<h3>Username</h3>
								<p>{state.username}</p>
							</div>
							<div className='user-group'>
								<h3>Roles</h3>
								<p>{state.roles}</p>
							</div>
							<div className='user-group bio'>
								<h3>About</h3>
								<p>{state.bio}</p>
							</div>
							<div className='user-group location'>
								<h3>Location</h3>
								<p>{state.city}</p>
							</div>
							<div
								className='user-group
							games'
							>
								<h3>Games</h3>
								{state.games.map((game) => (
									<p key={game}>{game}</p>
								))}
							</div>
						</div>
					)}
				</div>
			</section>
		);
	}
}

export default withRouter(Profile);
