import React, { Component } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import User from '../../models/User';
require('../Register/Form.css');
require('./Login.css');

export class Login extends Component {
	state = {
		username: '',
		email: '',
		password: '',
		errMsg: '',
	};

	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	handleSubmit = async (e) => {
		e.preventDefault();
		try {
			let loginData = {
				username: this.state.username,
				email: this.state.email,
				password: this.state.password,
			};
			const res = await User.login(loginData);

			this.props.setCurrentUser(res.data.token);

			console.log(res);
			this.props.history.push(`/profile/${res.data.id}`);
		} catch (error) {
			console.log(error.response.data.message);
			this.setState({ errMsg: error.response.data.message });
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
							type='password'
							name='password'
							id='password'
							value={this.state.password}
						/>
					</div>
					<button className='btn btn-primary' type='submit'>
						Login
					</button>
					<p className='switch-form'>
						Don't have an account?
						<NavLink to='/register'>&#x20;Register today!</NavLink>
					</p>
					<div id='error' className={this.state.errMsg && 'show'}>
						{this.state.errMsg}
					</div>
				</form>
			</section>
		);
	}
}

export default withRouter(Login);
