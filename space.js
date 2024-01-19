//tabulka
let tileSize = 32; // 32 pixelu
let rows = 16; 
let columns = 16;

let board;
let boardWidth = tileSize * columns; // 32 * 16
let boardHeight = tileSize * rows; //32 * 16
let context;

//lod
let shipWidth = tileSize*2; //sirka lode 64p
let shipHeight = tileSize; //vyska lode 32p
let shipX = tileSize * columns/2 - tileSize;
let shipY = tileSize * rows - tileSize*2;

let ship = {
    x : shipX,
    y : shipY,
    width : shipWidth,
    height : shipHeight
}

let shipImg;
let shipVelocityX = tileSize; //rychlost pohybu lodi

//mimozemstani
let alienArray = [];
let alienWidth = tileSize*2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;

let alienRows = 2;
let alienColumns = 3;
let alienCount = 0; // pocet mimozemstanu k porazeni
let alienVelocityX = 1; // rychlost pohybu mimozemstanu

//strely
let bulletArray = [];
let bulletVelocityY = -10; //rychlost pohybu strely

let score = 0;
let gameOver = false;

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
    shipImg.onload = function() { //nacte obrazek lodi
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    }

    alienImg = new Image();
    alienImg.src = "img/alien1.png";
    createAliens();

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);
}

function update() {
    requestAnimationFrame(update);

    if (gameOver){
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    //lod
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    //mimozemstane
    for (let i = 0; i < alienArray.length; i++){
        let alien = alienArray[i];
        if(alien.alive){
            alien.x += alienVelocityX;

            //pokud se mimozemstan dotkne okraje
            if(alien.x + alien.width >= board.width || alien.x <= 0){
                alienVelocityX *= -1;
                alien.x += alienVelocityX*2;

                // posunout vsechny mimozemstany vys o jeden radek
                for (let j = 0; j < alienArray.length; j++){
                    alienArray[j].y += alienHeight;
                }
            }
            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);

            if (alien.y >= ship.y){
                gameOver = true;
            }
        }
    }

    //strely
    for(let i = 0; i < bulletArray.length; i++) {
        let bullet = bulletArray[i];
        bullet.y += bulletVelocityY;
        context.fillStyle="white";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        //kolize strel s mimozemstany
        for (let j = 0; j < alienArray.length; j++) {
            let alien = alienArray[j];
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
                bullet.used = true;
                alien.alive = false;
                alienCount--;
                score += 100;
            }
        }
    }

    //vycistit strely
    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
        bulletArray.shift(); //odstrani prvni prvek z array
    }

    //dalsi level
    if (alienCount == 0) {
        //zvetsit pocet mimozemsanu v radcich a sloupcich o 1
    alienColumns = Math.min(alienColumns + 1, columns/2 -2); //omezeni na 16/2 -2 = 6
    alienRows = Math.min(alienRows + 1, rows-4); //cap at 16-4 = 12
    alienVelocityX += 0.1; //zvyseni rychlosti mimozemstanu
    alienArray = [];
    bulletArray = [];
    createAliens();
    }

    //skore
    context.fillStyle="white";
    context.font="bolder 22px sans-serif";
    context.fillText(score, 5, 20);

}

function moveShip(e) {
    if(gameOver){
        return;
    }

    if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
        ship.x -= shipVelocityX; // pohyb doleva jeden tile
    }
    else if (e.code == "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width) {
        ship.x += shipVelocityX; // pohyb doprava jeden tile
    }
}

function createAliens() {
    for(let c = 0; c < alienColumns; c++){
        for (let r = 0; r < alienRows; r++) {
            let alien = {
                img : alienImg,
                x : alienX + c*alienWidth,
                y : alienY + r*alienHeight,
                width : alienWidth,
                height : alienHeight,
                alive : true
            }
            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}

function shoot(e) {
    if(gameOver){
        return;
    }

    if (e.code == "Space") {
        //strelba
        let bullet = {
            x : ship.x + shipWidth*15/32,
            y : ship.y,
            width : tileSize/8,
            height : tileSize/2,
            used : false
        }
        bulletArray.push(bullet);
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //levy horni roh a nedosahuje na pravy horni roh b
           a.x + a.width > b.x &&   //pravy horni roh a projde levym hornim rohem b
           a.y < b.y + b.height &&  //levy horni roh a nedosahuje na pravy spodni roh b
           a.y + a.height > b.y;    //levy spodni roh a projde levym hornim rohem b
}