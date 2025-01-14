let randomNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

document.getElementById('submitGuess').addEventListener('click', checkGuess);

function checkGuess() {
    let userGuess = parseInt(document.getElementById('guessField').value);
    attempts++;
    document.getElementById('attempts').textContent = `시도 횟수: ${attempts}`;

    if (userGuess === randomNumber) {
        displayMessage(`축하합니다! ${attempts}번 만에 맞추셨습니다!`);
        document.getElementById('submitGuess').disabled = true;
    } else if (userGuess < randomNumber) {
        displayMessage('너무 작습니다! 더 큰 숫자를 입력해보세요.');
    } else {
        displayMessage('너무 큽니다! 더 작은 숫자를 입력해보세요.');
    }
}

function displayMessage(message) {
    document.getElementById('message').textContent = message;
} 