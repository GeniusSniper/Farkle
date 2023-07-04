var diceArr = [];
let availableScore = 0;
let availableScoreAndBank;
let totalScore = 0;
let scoreElement;
let roundOver = true;
let preStoredScore = 0;
let scoreSelectedPointsAndRisk;
let roundoverelement;

function initializeDice() {
	for (i = 0; i < 6; i++) {
		diceArr[i] = {};
		diceArr[i].id = "die" + (i + 1);
		diceArr[i].value = i + 1;
		diceArr[i].clicked = 0;
	}
	availableScoreAndBank = document.querySelector('.availableScoreAndBank');
	totalScore = 0;
	scoreElement = document.querySelector('.score');
	scoreSelectedPointsAndRisk = document.querySelector('.scoreSelectedPointsAndRisk');
	roundoverelement = document.querySelector('.roundover');
}

/*Rolling dice values*/
function rollDice() {
	if(roundOver){//if round is over deselect all selected dice
		clearTransparent();
	}
	roundoverelement.innerHTML = roundOver ? 'It is a New Round!' : 'Round Over score your points or you will lose it!';
	
	roundOver = !roundOver;

	let scoresArr = new Array(6).fill(0);
	for (var i = 0; i < 6; i++) {
		if (diceArr[i].clicked === 0) {
			const curRoll = Math.floor((Math.random() * 6) + 1);
			diceArr[i].value = curRoll;
			scoresArr[curRoll - 1]++;
		}
	}
	const score = calculatingScore(scoresArr);
	scoreSelectedPointsAndRisk.innerHTML = `Score ${preStoredScore} and risks your points to roll dice`;
	if(score === 0) preStoredScore = 0;
	availableScore = preStoredScore + score;
	availableScoreAndBank.innerHTML = `Score your ${availableScore} and end your turn, banking your point.`;
	updateDiceImg();
}

// calculating scores
function calculatingScore(arr = []) {
	let curScore = 0;
	for (let i = 0; i < arr.length; i++) {
		while (arr[i] >= 3) {//if more than 6 dice improve function using %
			if (i !== 0) {
				curScore += (i + 1) * 100;
				arr[i] -= 3;
				continue;
			}
			curScore += 1000;
			arr[i] -= 3;
		}
		if (i !== 0 && i !== 4) { //if dice is not 1 or 5
			continue;
		}
		const multiplier = i === 0 ? 100 : 10;
		while (arr[i] > 0) {
			curScore += (i + 1) * multiplier;
			arr[i]--;
		}
	}
	return curScore;
}

//scoring score 
function bankScore(){
	totalScore += availableScore
	scoreElement.innerHTML = totalScore;
	availableScore = 0;
	roundOver = true;
	clearTransparent();
	if(totalScore >= 10000) {
		alert("congratulation! You WON!");
	}
}

function clearTransparent(){
	preStoredScore = 0;
	for (let i = 0; i < diceArr.length; i++) {
		if (diceArr[i].clicked === 0) continue;
		document.getElementById(diceArr[i].id).classList.toggle('transparent');
		diceArr[i].clicked = 0;
	}
}

/*Updating images of dice given values of rollDice*/
function updateDiceImg() {
	var diceImage;
	for (var i = 0; i < 6; i++) {
		diceImage = "images/" + diceArr[i].value + ".png";
		document.getElementById(diceArr[i].id).setAttribute("src", diceImage);
	}
}

function diceClick(img) {
	var i = img.getAttribute("data-number");
	
	img.classList.toggle("transparent");
	if (diceArr[i].clicked === 0) {
		diceArr[i].clicked = 1;
	}
	else {
		diceArr[i].clicked = 0;
	}
	updatePreScore();
}
//if player want to risk points calculate the score player want to save
function updatePreScore(){
	if(roundOver) return 0;
	let scores = new Array(6).fill(0);
	for(let i = 0; i < 6; i++){
		if(diceArr[i].clicked === 1) {
			scores[diceArr[i].value - 1]++;
		}
	}
	preStoredScore = calculatingScore(scores);
	scoreSelectedPointsAndRisk.innerHTML = `Score ${preStoredScore} and risks your points to roll dice`;
}