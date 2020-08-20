import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import User from '../../models/User';
require('../Register/Form.css');
require('./Login.css');

export class Login extends Component {
	state = {
		username: '',
		email: '',
		password: '',
	};

	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await User.login(this.state);

			// this.props.setCurrentUser(res.data.token);

			console.log(res);
			this.props.history.push('/');
		} catch (error) {
			console.log(error);
		}
	};

	render() {
		return (
			<section className='container login form-container'>
				<div className='form-image'></div>
				<form onSubmit={this.handleSubmit}>
					<h2>Login</h2>
					<div className='form-group'>
						<label htmlFor='username'>
							<p>Username</p>
						</label>
						<input
							onChange={this.handleChange}
							type='text'
							name='username'
							id='username'
							value={this.state.username}
						/>
					</div>
					<div className='form-group'>
						<label htmlFor='password'>
							<p>Password</p>
						</label>
						<input
							onChange={this.handleChange}
							type='text'
							name='password'
							id='password'
							value={this.state.password}
						/>
					</div>
					<button className='btn btn-primary' type='submit'>
						Login
					</button>
				</form>
			</section>
		);
	}
}

export default withRouter(Login);
