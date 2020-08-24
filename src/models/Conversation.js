import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api';

export default class Conversation {
	static get = async (userOne, userTwo) => {
		return axios.get(`${BASE_URL}/v1/messages/${userOne}/${userTwo}`);
	};
	static start = async (userOne, userTwo) => {
		return axios.post(`${BASE_URL}/v1/messages/${userOne}/${userTwo}`);
	};
	static getAll = async (userOne) => {
		return axios.get(`${BASE_URL}/v1/messages/conversations/${userOne}`);
	};

	static getOneByID = async (id) => {
		return axios.get(`${BASE_URL}/v1/messages/conversationByID/${id}`);
	};

	static addMessage = async (userOne, userTwo, messageContent) => {
		console.log(messageContent);
		return axios.post(
			`${BASE_URL}/v1/messages/conversation/${userOne}/${userTwo}`,
			messageContent
		);
	};
}
