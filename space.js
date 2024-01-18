//tabulka
let tileSize = 32; // 32 pixelu
let rows = 16; 
let columns = 16;

let board;
let boardWidth = tileSize * columns; // 32 * 16
let boardHeight = tileSize * rows; //32 * 16
let context;

//lod
let shipWidht = tileSize*2; //sirka lode 64p
let shipHeight = tileSize; //vyska lode 32p
let shipX = tileSize * columns/2 - tileSize;
let shipY = tileSize * rows - tileSize*2;

let ship = {
    x : shipX,
    y : shipY,
    width : shipWidht,
    height : shipHeight,
}

let shipImg;
let shipVelocityX = tileSize; //rychlost pohybu lodi

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d"); //pouzivano pro kresleni do tabulky

    //vykresleni lodi
    //context.fillstyle="green";
    //context.fillRect(ship.x, ship.y, ship.width, ship.height);

    //nacist obrazek
    shipImg = new Image();
    shipImg.src = "img/ship.png"
    shipImg.onload = function(){ //nacte obrazek lodi
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    }
    requestAnimationFrame(update);
}

function update() {
    requestAnimationFrame(update);
    //lod
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

}

//pokracovani ------------- 14:00