import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Card from '../../components/Card/Card';
require('./Home.css');

function Home() {
	// const rotateText = () => {
	// 	const words = ['heroes', 'heroines'];
	// 	const adventurer = document.querySelector('.adventurer');
	// 	let timerId = setInterval(changeWord(words, adventurer), 1000);
	// };

	// const changeWord = (arr, el) => {
	// 	console.log('called');

	// 	arr.forEach((word) => {
	// 		console.log(el);
	// 		el.innerText = word;
	// 	});
	// };
	// useEffect(() => {
	// 	rotateText();
	// });

	return (
		<section className='home'>
			<div className='splash'>
				<div className='cta'>
					<h2>
						Join <span className='adventurer'></span> in your area today
					</h2>
					<h3 className='btn'>
						<NavLink to='/register'>Sign Up Today!</NavLink>
					</h3>
				</div>
			</div>
			<div className='container cards-container'>
				<Card
					title='Find Nearby Players'
					icon={'fa-users'}
					content='I am Singing Wind, Chief of the Martians. WINDMILLS DO NOT WORK THAT WAY! GOOD NIGHT! You mean while I am sleeping in it? Hey, you add a one and two zeros to that or we walk!

					Hey! I am a porno-dealing monster, what do I care what you think? Soothe us with sweet lies. I have been there. My folks were always on me to groom myself and wear underpants. What am I, the pope? Bender, I did not know you liked cooking. That is so cute.'
				/>
				<Card
					title='Find Nearby Players'
					icon={'fa-dice-d20'}
					content='I am Singing Wind, Chief of the Martians. WINDMILLS DO NOT WORK THAT WAY! GOOD NIGHT! You mean while I am sleeping in it? Hey, you add a one and two zeros to that or we walk!

					Hey! I am a porno-dealing monster, what do I care what you think? Soothe us with sweet lies. I have been there. My folks were always on me to groom myself and wear underpants. What am I, the pope? Bender, I did not know you liked cooking. That is so cute.'
				/>
				<Card
					title='Find Nearby Players'
					icon={'fa-hat-wizard'}
					content='I am Singing Wind, Chief of the Martians. WINDMILLS DO NOT WORK THAT WAY! GOOD NIGHT! You mean while I am sleeping in it? Hey, you add a one and two zeros to that or we walk!

					Hey! I am a porno-dealing monster, what do I care what you think? Soothe us with sweet lies. I have been there. My folks were always on me to groom myself and wear underpants. What am I, the pope? Bender, I did not know you liked cooking. That is so cute.'
				/>
			</div>
		</section>
	);
}

export default Home;
