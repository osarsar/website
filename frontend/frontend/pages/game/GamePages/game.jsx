import FriendsList from '../components/FriendsList';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import '../GameCss/game.css';
import '/src/App.css';

function Game() {
	const [mode, setMode] = useState('solo');
	const [color, setColor] = useState('black');
	const [round, setRound] = useState(5);
	const navigate = useNavigate();
	const [isFriendsListOpen, setIsFriendsListOpen] = useState(false);


    const handleFriendsClick = () => {
        setMode('friends');
        setIsFriendsListOpen(true);
    };
	
	const getImageSrc0 = () => {
		return mode === 'local' ? "/src/assets/Local.svg" : "/src/assets/BlackLocal.svg";
	};

	const getImageSrc1 = () => {
		return mode === 'solo' ? "/src/assets/Solo.svg" : "/src/assets/BlackSolo.svg";
	};

	const getImageSrc2 = () => {
		return mode === 'friends' ? "/src/assets/Friends.svg" : "/src/assets/BlackFriends.svg";
	};

	const getImageSrc3 = () => {
		return mode === 'random' ? "/src/assets/Random.svg" : "/src/assets/BlackRandom.svg";
	};

	const handleStart = () => {
        switch(mode) {
            case 'solo':
                navigate('/soloGame', {state: {color: color, round: round}});
                break;
			case 'local':
                navigate('/localeGame', {state: {color: color, round: round}});
                break;
            case 'friends':
                navigate('/soloGame'), {state: {color: color, round: round}};
                break;
            case 'random':
                navigate('/randomlyGame', {state: {color: color, round: round}});
                break;
            case 'tournaments':
                navigate('/tournament', {state: {color: color, round: round}});
                break;

        }
    };

	return (
	<div className="game">
		<div className='mini-background'>
			<div className="mode-select">
				<button className={mode === 'solo' ? 'active match' : 'match'} onClick={() => setMode('solo')}>
					<img src={getImageSrc1()} alt="logo" /> Solo</button>
				<button className={mode === 'local' ? 'active match' : 'match'} onClick={() => setMode('local')}>
					<img src={getImageSrc2()} alt="logo" /> Local</button>
				<button className={mode === 'friends' ? 'active match' : 'match'} onClick={handleFriendsClick}>
					<img src={getImageSrc2()} alt="logo" /> Friends</button>
				<button className={mode === 'random' ? 'active match' : 'match'} onClick={() => setMode('random')}>
					<img src={getImageSrc3()} alt="logo" /> Random</button>
			</div>
			<div>
				<div className='color-table'>
					<span className='color-table'>Black</span>
					<span className='color-table'>white</span>
					<span className='color-table'>purple</span>
				</div>
			</div>
			<div className="color-select">
				<button className={color === 'black' ? 'active match' : 'match'} onClick={() => setColor('black')}>
					<img src="/src/assets/BlackBoard.svg" alt="icon"/>
				</button>
				<button className={color === 'white' ? 'active match' : 'match'} onClick={() => setColor('white')}>
					<img src="/src/assets/WhiteBoard.svg" alt="icon"/>
				</button>
				<button className={color === 'purple' ? 'active match' : 'match'} onClick={() => setColor('purple')}>
				<img src="/src/assets/PurpleBoard.svg" alt="icon"/>
				</button>
			</div>
			<div className="round-select horizontal">
				<div className='container'>
				<span className='profile'>Goals :</span>
					<button className={round === 5 ? 'active rounds' : 'rounds'} onClick={() => setRound(5)}>5</button>
					<button className={round === 7 ? 'active rounds' : 'rounds'} onClick={() => setRound(7)}>7</button>
					<button className={round === 9 ? 'active rounds' : 'rounds'} onClick={() => setRound(9)}>9</button>
				</div>
				<div className='separator'></div>
				<div className="tournament">
					<button className='start-game horizontal' onClick={() => setMode('tournaments')}>
						<span>tournament</span>
					</button>
				</div>
			</div>
			<button className='start-game' onClick={handleStart}>Start</button>
		</div>

		{isFriendsListOpen && (
            <FriendsList isOpen={isFriendsListOpen} onClose={() => setIsFriendsListOpen(false)} />
		)}
	</div>
  );
}

export default Game;
