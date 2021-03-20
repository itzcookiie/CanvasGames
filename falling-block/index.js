const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const colWidth = canvas.width / 5;
let colY = 0;
const playerBlockHeight = canvas.height / 5;
const player = {
    x: 0,
    y: canvas.height - playerBlockHeight
};
let blockCols = [];
const drawCmd = {
    playerLeft: 0,
    playerRight: 1,
    blockBuild: 2,
    blockDown: 3
}
let intervalID;

document.addEventListener('DOMContentLoaded', startGame);

document.onkeydown = handlePlayerMovement

function handlePlayerMovement(e) {
    switch (e.key) {
        case 'ArrowLeft':
            mainDraw(drawCmd.playerLeft)
            break;
        case 'ArrowRight':
            mainDraw(drawCmd.playerRight)
            break;
    }
}

function gameTimer() {
    const timer = 100; // ms
    // e.g. 2 = twice as fast, 5 = five times as fast
    const timeMultiplier = 5;
    intervalID = setInterval(() => {
        if(gameOver()) {
            clearInterval(intervalID);
            console.log('game over')
            return;
        }
        if(colY >= canvas.height) {
            clearInterval(intervalID);
            mainDraw(drawCmd.blockBuild);
            gameTimer();
        } else {
            mainDraw(drawCmd.blockDown);
        }
    }, timer * (1/timeMultiplier))
}

function gameOver() {
    const playerCol = player.x / colWidth;
    const playerTop = player.y - playerBlockHeight;
    return blockCols.some(col => (col === playerCol) && (colY >= playerTop));
}

function blockDraw(cmd) {
    let numBlocks = 5;
    const colWidth = canvas.width / numBlocks;
    const colHeight = canvas.height / numBlocks;
    let blockArr = Array.from(Array(numBlocks)).map((a,i) => i);

    if(cmd === drawCmd.blockBuild) {
        blockCols = [];
        colY = 0;
        Array.from(Array(numBlocks-1)).forEach(f => {
            let index = randomNumber(0,blockArr.length-1)
            let col = blockArr.splice(index, 1)[0];
            blockCols.push(col);
            ctx.fillRect(col*colWidth, colY, colWidth, colHeight);
        })
    } else if(cmd === drawCmd.blockDown)  {
        const colHeightDistance = colHeight / 10 // movement per ms
        colY += colHeightDistance;
        blockCols.forEach(col => {
            ctx.fillRect(col*colWidth, colY, colWidth, colHeight);
        })
    } else {
        blockCols.forEach(col => {
            ctx.fillRect(col*colWidth, colY, colWidth, colHeight);
        })
    }
}

function playerDraw(cmd) {
    const offset = 0;
    const playerWidth = colWidth - offset;
    if(cmd === drawCmd.playerLeft && player.x !== 0) {
        player.x -= colWidth;
        ctx.fillRect(player.x, player.y, playerWidth, playerBlockHeight);
    } else if (cmd === drawCmd.playerRight && player.x !== (canvas.width * 0.8)) {
        player.x += colWidth;
        ctx.fillRect(player.x, player.y, playerWidth, playerBlockHeight);
    } else {
        ctx.fillRect(player.x, player.y, playerWidth, playerBlockHeight);
    }
}

function mainDraw(drawCmd) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    blockDraw(drawCmd);
    playerDraw(drawCmd);
}

function randomNumber(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function startGame() {
    ctx.fillStyle = "green";
    mainDraw(drawCmd.blockBuild);
    gameTimer();
}