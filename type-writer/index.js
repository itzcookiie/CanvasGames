const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
let letterPosition = 0;

const text = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
let letters;
let letter;

let time = 10000 // 10 seconds

const drawCmd = {
    drawWords: 0,
    redrawWords: 2,
    drawTimer: 1
}
let intervalID;

document.addEventListener('DOMContentLoaded', startGame)
document.addEventListener('keydown', handleKeydown)

function handleKeydown(e) {
    switch(e.key) {
        case letter:
            letterPosition++;
            letter = letters.slice(letterPosition, letterPosition+1)[0];
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
    if(cmd === drawCmd.drawTimer) {
        const timeInSeconds = time / 1000;
        ctx.strokeText(timeInSeconds.toString(), 30, 30);
        time -= 1000;
        if(time <= 0) {
            clearInterval(intervalID);
            console.log('Times up! Put your pens down!');
        }
    } else if(cmd === drawCmd.drawWords) {
        const timeInSeconds = time / 1000;
        ctx.strokeText(timeInSeconds.toString(), 30, 30);
        intervalID = setInterval(() => {
            mainDraw(drawCmd.drawTimer)
        }, 1000)
    } else {
        const timeInSeconds = time / 1000;
        ctx.strokeText(timeInSeconds.toString(), 30, 30);
    }
}

function writeWords(cmd) {
    ctx.font = "30px Comic Sans MS";
    ctx.textAlign = "center";
    const textWidth = ctx.measureText(text).width;
    const letterDistance = textWidth / text.length;
    const offset = 5 * letterDistance; // Make sure text fits on screen
    letters.forEach((letter,i) => {
        const x = (i*letterDistance) + offset;
        const y = canvasHeight / 2;
        if(cmd === drawCmd.drawWords) {
            ctx.strokeText(letter, x, y)
        } else {
            if(i < letterPosition) {
                ctx.fillText(letter, x, y)
            } else {
                ctx.strokeText(letter, x, y)
            }
        }
    });
}

function startGame() {
    letters = getWords();
    letter = letters.slice(letterPosition, 1)[0];
    canvas.width = ctx.measureText(letters).width;
    mainDraw(drawCmd.drawWords);
}
