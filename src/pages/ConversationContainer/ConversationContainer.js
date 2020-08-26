import React, { useEffect, useState } from 'react';
import Conversation from '../../models/Conversation';
import { withRouter } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:4000/');
require('./Messages.css');

function ConversationContainer(props) {
	const [conversations, setConversations] = useState([]);
	const [currentConversation, setConversation] = useState({});
	const [message, setMessage] = useState('');
	const [participant, setParticipant] = useState({});
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		async function fetch() {
			const foundConversations = await Conversation.getAll(props.currentUser);
			setConversations(foundConversations.data.foundConversations);
			if (!currentConversation) {
				setConversation(foundConversations.data.foundConversations[0]);
			}
			return foundConversations;
		}
		return () => {
			fetch();
		};
	});

	useEffect(() => {
		console.log(participant);
		socket.on('RECEIVE_MESSAGE', async (data) => {
			const messagesEl = document.querySelector('.messages');
			console.log(messagesEl.clientHeight);
			messagesEl.scrollTop = messagesEl.scrollHeight + 1000;
			if (participant.from && participant.to) {
				if (participant.to === data.to || participant.from === data.to) {
					setMessages((oldArray) => [...oldArray, data]);
				}
			}
		});
	}, [participant]);

	async function setConvo(e, id) {
		const menuItems = document.querySelectorAll('.convo-menu-item');
		menuItems.forEach((menuItem) => menuItem.classList.remove('active-convo'));
		e.target.classList.add('active-convo');
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
			return (
				<>
					<h3
						onClick={(e) => setConvo(e, conversation._id)}
						className='convo-menu-item'
					>
						{conversation.participants.users.userOne.username}/
						{conversation.participants.users.userTwo.username}
					</h3>
				</>
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
							<div className={you === username ? 'float-right' : 'float-left'}>
								<h4>{username}</h4>
								<p>{newMessage.message}</p>
							</div>
						);
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
							<i class='fas fa-paper-plane'></i>
						</button>
					</form>
				)}
			</div>
		</div>
	);
}

export default withRouter(ConversationContainer);
