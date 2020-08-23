import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import User from '../../models/User';
const ENDPOINT = 'http://localhost:4000';

class MessageContainer extends React.Component {
	state = {
		from: '',
		to: '',
		username: '',
		message: '',
		messages: [],
	};

	socket = socketIOClient(ENDPOINT);

	async componentDidMount() {
		const currentUser = this.props.currentUser;
		const user = await User.get(currentUser);
		this.setState({
			username: user.data.foundUser.username,
			from: user.data.foundUser._id,
			to: this.props.match.params.id,
		});
		const addMessage = (data) => {
			this.setState({ messages: [...this.state.messages, data] });
		};
		const from = this.state.from;
		const to = this.state.to;
		this.socket.on('RECEIVE_MESSAGE', function (data) {
			if (data.from === from || data.to || to) {
				addMessage(data);
			}
		});
	}
	sendMessage = (ev) => {
		ev.preventDefault();
		this.socket.emit('SEND_MESSAGE', {
			from: this.state.from,
			to: this.state.to,
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
												{message.from}: {message.message}
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

export default MessageContainer;
