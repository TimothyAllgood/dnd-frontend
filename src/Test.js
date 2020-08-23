import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import User from './models/User';
const ENDPOINT = 'http://localhost:4000';

class Test extends React.Component {
	state = {
		from: '',
		to: '',
		username: '',
		message: '',
		messages: [],
	};

	socket = socketIOClient(ENDPOINT);

	async componentDidMount() {
		const user = await User.get('5f402032bd4c4db1367ac630');
		this.setState({
			username: user.data.foundUser.username,
			from: user.data.foundUser._id,
		});
		const addMessage = (data) => {
			console.log(data);
			this.setState({ messages: [...this.state.messages, data] });
			console.log(this.state.messages);
		};
		this.socket.on('RECEIVE_MESSAGE', function (data) {
			addMessage(data);
		});
	}
	sendMessage = (ev) => {
		ev.preventDefault();
		this.socket.emit('SEND_MESSAGE', {
			author: this.state.username,
			message: this.state.message,
		});
	};

	render() {
		return (
			<div className='container'>
				<div className='row'>
					<div className='col-4'>
						<div className='card'>
							<div className='card-body'>
								<div className='card-title'>Global Chat</div>
								<hr />
								<div className='messages'>
									{this.state.messages.map((message) => {
										return (
											<div>
												{message.author}: {message.message}
											</div>
										);
									})}
								</div>
							</div>
							<div className='card-footer'>
								{/* <input
									type='text'
									placeholder='Username'
									value={this.state.username}
									onChange={(ev) =>
										this.setState({ username: ev.target.value })
									}
									className='form-control'
								/> */}
								<br />
								<input
									type='text'
									placeholder='Message'
									className='form-control'
									value={this.state.message}
									onChange={(ev) => this.setState({ message: ev.target.value })}
								/>
								<br />
								<button
									onClick={this.sendMessage}
									className='btn btn-primary form-control'
								>
									Send
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Test;
