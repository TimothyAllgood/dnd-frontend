import React from 'react';
require('./Card.css');

function Card({ title, icon, content }) {
	return (
		<div className='card'>
			<i className={`fas ${icon}`}></i>
			<h3>{title}</h3>
			<p>{content}</p>
		</div>
	);
}

export default Card;
