const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const text = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."

let letters;
let currentLetter;
let letterPosition = 0;
let randomLettersIndex = [];

let time = 10000 // 10 seconds
const timeInterval = 1000; // 1 second

const drawCmd = {
    drawWords: 0,
    redrawWords: 2,
    drawTimer: 1,
    moveLetters: 3
};

const problemOptions = {
    hide: {
        code: 0
    },
    randomColour: {
        code: 1
    },
    flip: {
        code: 2
    },
    move: {
        code: 3
    }

}
let intervalID;
let timeoutID;
let moveY = 0;
const queue = [];
let gameOver = false;
let lettersMoving = false;

document.addEventListener('DOMContentLoaded', startGame)
document.addEventListener('keydown', handleKeydown)

function handleKeydown(e) {
    if(gameOver) return;

    switch(e.key) {
        case currentLetter:
            letterPosition++;
            currentLetter = letters.slice(letterPosition, letterPosition+1)[0];
            mainDraw(drawCmd.redrawWords);
            break;
    }
}

function getWords() {
    return getLetters(text.split(' '));
}

function getLetters(wordList) {
    return wordList.flatMap(word => word.split(''));
}

function mainDraw(cmd) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    writeWords(cmd);
    writeTimer(cmd);
}

function writeTimer(cmd) {
    const timeInSeconds = time / 1000;
    const fontSize = parseInt(ctx.font);
    if(cmd === drawCmd.drawWords) {
        ctx.strokeText(timeInSeconds.toString(), fontSize, fontSize);
        intervalID = setInterval(countTime, timeInterval)
    } else {
        ctx.strokeText(timeInSeconds.toString(), fontSize, fontSize);
    }
}

function countTime() {
    time -= timeInterval;
    mainDraw();
    if(time <= 0) {
        clearInterval(intervalID);
        gameOver = true;
        console.log('Times up! Put your pens down!');
    }
}

function writeWords(cmd) {
    ctx.font = "30pt Comic Sans MS";
    ctx.textAlign = "center";
    const textWidth = ctx.measureText(text).width;
    const letterDistance = textWidth / text.length;
    const offset = 5 * letterDistance; // Make sure text fits on screen
    letters.forEach((letter,i) => {
        ctx.fillStyle = "#000000";
        ctx.strokeStyle = "#000000";
        const x = (i*letterDistance) + offset;
        const y = canvas.height / 2;
        const problemLetterItem = randomLettersIndex.filter(problemLetter => problemLetter.index === i);
        cmd === drawCmd.drawWords
            ? initialWordsDraw(x, y, letter, problemLetterItem, letterDistance)
            : defaultWordDraw(x, y, i, letter, problemLetterItem, letterDistance);
    });
}

function initialWordsDraw(x, y, letter, problemLetterItem, letterDistance) {
    if(problemLetterItem.length) {
        handleProblemLetter(x, y, letter, problemLetterItem[0], letterDistance);
    } else {
        ctx.strokeText(letter, x, y);
    }
}

function defaultWordDraw(x, y, i, letter, problemLetterItem, letterDistance) {
    if(i < letterPosition) {
        ctx.fillText(letter, x, y);
    } else if(problemLetterItem.length) {
        handleProblemLetter(x, y, letter, problemLetterItem[0], letterDistance);
    } else {
        ctx.strokeText(letter, x, y);
    }
}

function handleProblemLetter(x, y, letter, problemLetterObj, letterDistance) {
        switch (problemLetterObj.code) {
            case problemOptions.hide.code:
                // Don't draw anything = same as hiding
                break;
            case problemOptions.randomColour.code:
                randomColour(x, y, letter);
                break;
            case problemOptions.flip.code:
                flip(x, y, letter, letterDistance);
                break;
            case problemOptions.move.code:
                move(x, y, letter, letterDistance);
                break;
        }
}

function randomColour(x, y, letter) {
    ctx.fillStyle = "green";
    ctx.fillText(letter, x, y);
}

function flip(x, y, letter) {
    const textHeight = getTextHeight(ctx.font);

    // 10 for extra offsetting
    const yDistance = y - 10;
    ctx.translate(x, yDistance);
    ctx.rotate(180 * Math.PI / 180);
    ctx.translate(-x, -yDistance);
    ctx.textAlign = "center";
    ctx.strokeText(letter, x, y);
    ctx.resetTransform();
}

function move(x, y, letter) {
    const { top, bottom } = canvas.getBoundingClientRect();

    const interval = setInterval(() => {
        let command = 'down';

        if(moveY >= bottom) command = 'up';
        if(moveY <= top) command = 'down';

        console.log(moveY, top, bottom)

        switch (command) {
            case 'up':
                ctx.strokeText(letter, x, moveY--);
                mainDraw();
                break;
            case 'down':
                ctx.strokeText(letter, x, moveY++);
                mainDraw();
                break;
        }
    }, 500)
}

function getRandomLettersIndexes(limit) {
    let i = 0;
    const numOfOptions = Object.values(problemOptions);
    while(i < limit) {
        randomLettersIndex.push({
            index: getRandomNumber(letters),
            code: getRandomNumber(numOfOptions)
        });
        i++;
    }
}

function startGame() {
    letters = getWords();
    currentLetter = letters.slice(letterPosition, 1)[0];
    canvas.width = ctx.measureText(letters).width;
    const limit = 50;
    getRandomLettersIndexes(limit);
    mainDraw(drawCmd.drawWords);
}

function getRandomNumber(lettersArr) {
    return Math.floor(Math.random() * lettersArr.length);
}

const getTextHeight = (fontStyle) => {
    const text = document.createElement("span");
    text.textContent = 'text';
    text.style.font = fontStyle;

    const block = document.createElement("div");
    block.style.display = "inline-block";
    block.style.width = "1px";
    block.style.height = "0px";

    const div = document.createElement("div");
    div.append(block, text);

    document.body.appendChild(div);

    let result = {};

    try {
        let blockOffsetTop;
        let textOffsetTop;
        let blockTop;
        let blockBottom;
        let textTop;
        let textBottom;

        block.style.verticalAlign = 'baseline';
        blockTop = block.getBoundingClientRect().top;
        blockBottom = block.getBoundingClientRect().bottom;
        textTop = text.getBoundingClientRect().top;
        textBottom = text.getBoundingClientRect().bottom;
        blockOffsetTop = blockTop + blockBottom;
        textOffsetTop = textTop + textBottom;
        result.ascent = blockOffsetTop - textOffsetTop;

        block.style.verticalAlign = 'bottom';
        blockTop = block.getBoundingClientRect().top;
        blockBottom = block.getBoundingClientRect().bottom;
        textTop = text.getBoundingClientRect().top;
        textBottom = text.getBoundingClientRect().bottom;
        blockOffsetTop = blockTop + blockBottom;
        textOffsetTop = textTop + textBottom;
        result.height = blockOffsetTop - textOffsetTop;

        result.descent = result.height - result.ascent;

    } finally {
        div.remove();
    }

    return result.height;
}
