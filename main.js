window.onload = function() {
    
    

const canvas = document.getElementById("tetris");
const context = canvas.getContext('2d');

context.scale(20, 20);

context.fillStyle = '#000';
context.fillRect(0,0, canvas.width, canvas.height);

const matrix = [
    [0,0,0],
    [1,1,1],
    [0,1,0]
];

    console.log(typeof(matrix));
    
function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((val, x) => {
            if(val !== 0) {
                context.fillStyle = 'red';
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

drawMatrix(matrix, {x: 5, y: 5});
}
