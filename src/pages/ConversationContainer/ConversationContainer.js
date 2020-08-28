import React, { useEffect, useState } from 'react';
import Conversation from '../../models/Conversation';
import { withRouter } from 'react-router-dom';
import { socket } from '../../util/socket';

require('./Messages.css');

function ConversationContainer(props) {
	const [conversations, setConversations] = useState([]);
	const [currentConversation, setConversation] = useState({});
	const [message, setMessage] = useState('');
	const [participant, setParticipant] = useState({});
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		let mounted = true;

		async function fetch() {
			const foundConversations = await Conversation.getAll(props.currentUser);
			setConversations(foundConversations.data.foundConversations);
		}
		if (mounted) {
			fetch();
		}
		return () => (mounted = false);
	});

	useEffect(() => {
		socket.off('RECIEVE_MESSAGE').on('RECEIVE_MESSAGE', async (data) => {
			const messagesEl = document.querySelector('.messages');
			messagesEl.scrollTop = messagesEl.scrollHeight + 1000;
			data.sent = new Date();
			setMessages((oldArray) => [...oldArray, data]);
		});
	}, []);

	async function setConvo(e, id) {
		const menuItems = document.querySelectorAll('.convo-menu-item');
		menuItems.forEach((menuItem) => menuItem.classList.remove('active-convo'));
		if (e.target.classList.contains('convo-menu-item')) {
			e.target.classList.add('active-convo');
		} else {
			e.target.parentElement.classList.add('active-convo');
		}

		setMessages([]);
		setParticipant({});
		const conversation = await Conversation.getOneByID(id);
		const almostTo = conversation.data.foundConversation.participants.ids.map(
			(participant, key) => {
				if (participant !== props.currentUser && key !== '_id') {
					return participant;
				}
			}
		);

		const to = almostTo.filter((item) => item !== undefined);

		setParticipant({ from: props.currentUser, to: to[0] });
		setConversation(conversation.data.foundConversation);
		conversation.data.foundConversation.messages.map((message) => {
			setMessages((oldArray) => [...oldArray, message]);
		});
	}

	function handleChange(e) {
		e.preventDefault();
		setMessage(e.target.value);
	}
	const sendMessage = (ev) => {
		socket.emit('SEND_MESSAGE', {
			to: participant.to,
			from: participant.from,
			message: message,
		});
	};
	function handleSubmit(e) {
		e.preventDefault();
		sendMessage();
		const messageContent = { message: message };
		Conversation.addMessage(participant.from, participant.to, messageContent);
	}

	const addMessage = (data) => {
		setMessages((oldArray) => [...oldArray, data]);
	};

	let conversationsEL;
	// let messages;
	if ({ conversations }) {
		conversationsEL = conversations.map((conversation) => {
			let userInfo;
			const users = Object.entries(conversation.participants.users);
			users.map((fuser) => {
				if (props.currentUser !== fuser[1]._id) {
					userInfo = fuser[1];
				}
			});
			return (
				<div
					onClick={(e) => setConvo(e, conversation._id)}
					className='convo-menu-item'
					key={conversation._id}
				>
					<img className='user-img' src={userInfo.profileImg} alt='' />
					<h3>{userInfo.username}</h3>
				</div>
			);
		});
	}

	let title;
	if (currentConversation.participants) {
		const users = Object.entries(currentConversation.participants.users);
		users.map((fuser) => {
			if (props.currentUser !== fuser[1]._id) {
				title = fuser[1].username;
			}
		});
	}

	return (
		<div className='convo-container'>
			<div className='convo-menu'>{conversationsEL}</div>

			<div className='convo'>
				<div className='convo-title'>
					<h3>{title ? title : 'Chat'}</h3>
				</div>
				<div className='messages'>
					{messages.map((newMessage) => {
						if (currentConversation.participants) {
							const users = Object.entries(
								currentConversation.participants.users
							);
							let username = '';
							let you;
							users.map((fuser) => {
								if (newMessage.from === fuser[1]._id) {
									username = fuser[1].username;
								}
								if (props.currentUser === fuser[1]._id) {
									you = fuser[1].username;
								}
							});

							return (
								<div
									key={newMessage._id}
									className={you === username ? 'float-right' : 'float-left'}
								>
									<h4>
										{username}:{' '}
										{new Date(Date.parse(newMessage.sent)).toLocaleDateString()}
									</h4>
									<p>{newMessage.message}</p>
								</div>
							);
						}
					})}
				</div>
				{title && (
					<form className='message-form' onSubmit={handleSubmit}>
						<input
							type='text'
							placeholder='Message'
							className='form-control'
							value={message}
							onChange={handleChange}
						/>
						<br />
						<button type='submit'>
							<i className='fas fa-paper-plane'></i>
						</button>
					</form>
				)}
			</div>
		</div>
	);
}

export default withRouter(ConversationContainer);
