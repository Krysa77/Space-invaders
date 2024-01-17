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

window.onload = function(){
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d"); //pouzivano pro kresleni do tabulky

    //vykresleni lodi
    
}