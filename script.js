let btnStart = document.createElement('button');
let lblScore = document.createElement('h3');
let lblLowScore = document.createElement('h3');
let getMainDiv = document.querySelector('div');
getMainDiv.append(lblScore);
getMainDiv.append(lblLowScore);
getMainDiv.append(btnStart);
btnStart.innerText = 'Start New Game';
let numOfCards = prompt('How many cards would you like to use?');
if (numOfCards <= 0) {
	numOfCards = prompt('Has to be a number > 0! How many cards would you like to use?');
} else if (numOfCards % 2 !== 0) {
	numOfCards = prompt('Has to be an even number! How many cards would you like to use?');
}
btnStart.addEventListener('click', startGame(numOfCards));

function startGame(howMany) {
	let intScore = 0;
	lblScore.innerText = intScore + ' Points';
	if (!localStorage.getItem('score')) {
		lblLowScore.innerText = '0 Low Score';
	} else {
		lblLowScore.innerText = localStorage.getItem('score').toString() + ' Low Score';
	}
	btnStart.style.display = 'none';
	const gameContainer = document.getElementById('game');
	gameContainer.dataset.locked = 'true';
	let arrRandomColors = [];
	for (let i = 0; i <= howMany - 1; i++) {
		arrRandomColors.push(
			(window['number' + i] =
				'rgb(' +
				getRandomNumber().toString() +
				',' +
				getRandomNumber().toString() +
				',' +
				getRandomNumber().toString() +
				')')
		);
	}
	// creates the random colors Array to use in the game
	let COLORS = [];
	for (let i = 0; i <= arrRandomColors.length / 2 - 1; i++) {
		COLORS.push(arrRandomColors[i].toString());
		COLORS.push(arrRandomColors[i].toString());
	}
	// gets a random number to be used in the RGB setting
	function getRandomNumber() {
		const firstNum = Math.floor(Math.random() * 256);

		return firstNum;
	}
	// here is a helper function to shuffle an array
	// it returns the same array with values shuffled
	// it is based on an algorithm called Fisher Yates if you want ot research more
	function shuffle(array) {
		let counter = array.length;

		// While there are elements in the array
		while (counter > 0) {
			// Pick a random index
			let index = Math.floor(Math.random() * counter);

			// Decrease counter by 1
			counter--;

			// And swap the last element with it
			let temp = array[counter];
			array[counter] = array[index];
			array[index] = temp;
		}

		return array;
	}

	let shuffledColors = shuffle(COLORS);

	// this function loops over the array of colors
	// it creates a new div and gives it a class with the value of the color
	// it also adds an event listener for a click for each card
	function createDivsForColors(colorArray) {
		for (let color of colorArray) {
			// create a new div
			const newDiv = document.createElement('div');

			// give it a class attribute for the value we are looping over
			newDiv.classList.add(color);

			newDiv.dataset.locked = 'false';
			// call a function handleCardClick when a div is clicked on
			newDiv.addEventListener('click', handleCardClick);

			// append the div to the element with an id of game
			gameContainer.append(newDiv);
		}

		const btnResetGame = document.createElement('button');
		btnResetGame.id = 'resetGame';
		const getGameDiv = document.querySelector('#game');
		getGameDiv.append(btnResetGame);
		btnResetGame.innerText = 'Reset Game';
		btnResetGame.addEventListener('click', function(event) {
			resetGame();
		});
		btnResetGame.style.display = 'none';
	}

	let intCount = 0;
	let tempBackColor = 'white';
	// TODO: Implement this function!
	function handleCardClick(event) {
		// you can use event.target to see which element was clicked

		if (event.target.dataset.selected === 'true') {
			alert('You cannot pick the same card.');
			return false;
		}
		intScore += 500;
		lblScore.innerText = intScore + ' Points';
		const h1Tag = document.querySelector('h1');
		intCount++;

		event.target.dataset.selected = 'true';
		if (intCount === 2) {
			intCount = 0;

			if (tempBackColor === event.target.className) {
				event.target.style.backgroundColor = event.target.className;
				h1Tag.innerText = 'Correct!';
				const getSelected = document.querySelectorAll('div');

				for (let i = 0; i <= getSelected.length - 1; i++) {
					if (getSelected[i].dataset.selected === 'true') {
						getSelected[i].dataset.locked = 'true';
					}
				}
			} else {
				event.target.style.backgroundColor = event.target.className;
				h1Tag.innerText = 'Not a match.  Try Again';
				document.getElementById('game').style.pointerEvents = 'none';
				setTimeout(resetBoard, 1000);
			}
		}
		event.target.style.backgroundColor = event.target.className;
		tempBackColor = event.target.className;

		// Check if it's the end of the game and lowest score to localStorage
		const endOFGame = document.querySelectorAll('[data-locked="false"]');
		if (endOFGame.length === 0) {
			h1Tag.innerText = 'You Win!!!';
			// lblLowScore.innerText = localStorage.getItem('score').toString() + ' Low Score';
			if (!localStorage.getItem('score')) {
				lblLowScore.innerText = '0 Low Score';
			} else {
				lblLowScore.innerText = localStorage.getItem('score').toString() + ' Low Score';
			}
			const btnResetGame = document.querySelector('#resetGame');
			btnResetGame.style.display = 'block';

			const lowScore = localStorage.getItem('score');
			if (!lowScore) {
				localStorage.setItem('score', intScore);
			} else if (intScore < lowScore) {
				localStorage.setItem('score', intScore);
			}
		}
	}
	// resets the cards that haven't been matched
	function resetBoard() {
		const foundDiv = document.querySelectorAll('div');

		for (i = 0; i <= foundDiv.length - 1; i++) {
			if (foundDiv[i].dataset.locked === 'true') {
				document.getElementById('game').style.pointerEvents = 'auto';
				// alert(foundDiv[i].dataset.locked);
			} else {
				document.getElementById('game').style.pointerEvents = 'auto';
				foundDiv[i].style.backgroundColor = 'white';
				foundDiv[i].dataset.selected = 'false';
				foundDiv[i].dataset.locked = 'false';
			}
		}
	}

	// resets the entire game
	function resetGame() {
		document.location.reload();
	}

	// when the DOM loads
	createDivsForColors(shuffledColors);
}
