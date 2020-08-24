import React, { Component, useEffect, useState } from 'react';
import Conversation from '../../models/Conversation';
import { withRouter } from 'react-router-dom';
import User from '../../models/User';
require('./Messages.css');

function ConversationContainer(props) {
	const [conversations, setConversations] = useState([]);
	const [currentConversation, setConversation] = useState({});
	const [message, setMessage] = useState('');
	const [participant, setParticipant] = useState({});

	useEffect(() => {
		async function fetch() {
			const foundConversations = await Conversation.getAll(props.currentUser);
			setConversations(foundConversations.data.foundConversations);

			if (!currentConversation) {
				setConversation(foundConversations.data.foundConversations[0]);
			}
		}

		fetch();
	});

	async function setConvo(id) {
		const conversation = await Conversation.getOneByID(id);
		const almostTo = conversation.data.foundConversation.participants.map(
			(participant, key) => {
				if (participant !== props.currentUser && key !== '_id') {
					console.log(participant);
					return participant;
				}
			}
		);

		const to = almostTo.filter((item) => item !== undefined);

		setParticipant({ from: props.currentUser, to: to[0] });
		setConversation(conversation.data.foundConversation);
	}

	async function fetchUsername(id) {
		const user = await User.get(id);
		return user;
	}

	function handleChange(e) {
		e.preventDefault();
		setMessage(e.target.value);
	}
	function handleSubmit(e) {
		e.preventDefault();
		const messageContent = { message: message };
		Conversation.addMessage(participant.from, participant.to, messageContent);
	}

	let conversationsEL;
	let messages;
	if ({ conversations }) {
		conversationsEL = conversations.map((conversation) => {
			return (
				<p onClick={() => setConvo(conversation._id)}>
					{conversation.participants[0]}
				</p>
			);
		});
	}
	if (currentConversation.messages) {
		messages = currentConversation.messages.map((message) => {
			return <p>{message.message}</p>;
		});
	}
	return (
		<div>
			<div className='conversations-menu'>Conversations: {conversationsEL}</div>
			<div className='conversation-container'>
				Messages: {messages}
				<form onSubmit={handleSubmit}>
					<div className='message'>
						<label htmlFor='message'>Message</label>
						<input onChange={handleChange} type='text' name='message' />
						<button type='submit'>Send Message</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default withRouter(ConversationContainer);
