
const canvas = document.getElementById("tetris");
//Getting contex out
const context = canvas.getContext('2d');
//Scaling the game's block elements to be visible
context.scale(20, 20);

function arenaSweep() {
    let rowCount = 1;
    outer: for(let y = arena.length - 1; y > 0; --y) {
        for(let x = 0; x < arena[y].length; ++x) {
            if(arena[y][x] === 0) {
                continue outer;
            }
        }
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

//Checking if the arena has the cloumns and rows
//and what is the value of the specific index (if 1 => there is a collision)
function colide(arena, player) {
    const[m, o] = [player.matrix, player.pos];
    for(let y = 0; y < m.length; ++y) {
        for(let x = 0; x < m[y].length; ++x) {
            if(m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

//Creating the matrix arrays which are blocks in the game
//based on the given arguments
function createMatrix(w, h) {
    const matrix = [];
    while(h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function createPiece(type) {
    if(type === 'T') {
        return [
            [0,0,0],
            [1,1,1],
            [0,1,0]
        ];
    } else if(type === 'O') {
        return [
            [2,2],
            [2,2]
        ];
    } else if(type === 'L') {
        return [
            [0,3,0],
            [0,3,0],
            [0,3,3]
        ];
    } else if(type === 'J') {
        return [
            [0,4,0],
            [0,4,0],
            [4,4,0]
        ];
    } else if(type === 'I') {
        return [
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0]
        ];
    } else if(type === 'S') {
        return [
            [0,6,6],
            [6,6,0],
            [0,0,0]
        ];
    } else if(type === 'Z') {
        return [
            [7,7,0],
            [0,7,7],
            [0,0,0]
        ];
    }
}

//Basis for the updating game's plot function
//Most importantly drawing game's elements and clearing them
//so that there is a movement efect
function draw() {
    context.fillStyle = '#000';
    context.fillRect(0,0, canvas.width, canvas.height);
    
    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
}
    
//Setting of the position of the game's blocks on the canvas
function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((val, x) => {
            if(val !== 0) {
                context.fillStyle = colors[val];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

//Copying values from the player to the arena in the correct position
function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((val, x) => {
            if(val !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = val;
            }
        });
    });
}

function playerDrop() {
    player.pos.y++;
    if(colide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

function playerMove(dir) {
    player.pos.x += dir;
    if(colide(arena, player)) {
        player.pos.x -= dir;
    }
}

function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length /2 |0);
    if(colide(arena, player)) {
        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
    }
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while(colide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if(offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

function rotate(matrix, dir) {
    for(let y = 0; y < matrix.length; ++y) {
        for(let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]]
                =
            [matrix[y][x], matrix[x][y]]
        }
    }
    if(dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;

//Updating the creation and movement of the game's block
//so that the game has the continuity
//Counting and storing time of the movement of the elements
function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    
    //Setting the game's element to drop every second
    dropCounter += deltaTime;
    if(dropCounter > dropInterval) {
        playerDrop();
    }
    
    draw();
    requestAnimationFrame(update);
}

function updateScore() {
    document.getElementById("score").innerText = "Your score is: " + player.score;
}

const colors = [
    null,
    'red',
    'blue',
    'green',
    'violet',
    'yellow',
    'orange',
    'grey'
];

const arena = createMatrix(12, 20);

//Setting the values of the specific game's block
const player = {
    pos: { x: 0, y: 0 },
    matrix: null,
    score: 0
}

//Setting the keybord keys that are responsible for block movement
document.addEventListener('keydown', event => {
    if(event.keyCode === 37) {
        playerMove(-1);
    } else if(event.keyCode === 39) {
        playerMove(1);
    } else if(event.keyCode === 40) {
        playerDrop();
    } else if(event.keyCode === 81) {
        playerRotate(-1);
    } else if(event.keyCode === 87) {
        playerRotate(1);
    }
});

playerReset();
updateScore();
update();

