import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import User from '../../models/User';
require('./Form.css');

export class Register extends Component {
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
			let registerData = {
				username: this.state.username,
				email: this.state.email,
				password: this.state.password,
			};
			const res = await User.register(registerData);
			console.log(res);
			this.props.history.push('/login');
		} catch (error) {
			console.log(error.response.data.message);
			this.setState({ errMsg: error.response.data.message });
			console.log(error);
		}
	};

	render() {
		return (
			<section className='container form-container'>
				<div className='form-image'></div>
				<form onSubmit={this.handleSubmit}>
					<h2>Sign Up</h2>
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
						<label htmlFor='email'>
							<p>Email</p>
						</label>
						<input
							onChange={this.handleChange}
							type='text'
							name='email'
							id='email'
							value={this.state.email}
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
						Sign Up
					</button>
					<div id='error' className={this.state.errMsg && 'show'}>
						{this.state.errMsg}
					</div>
				</form>
			</section>
		);
	}
}

export default withRouter(Register);
