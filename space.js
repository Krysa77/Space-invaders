//tabulka a jeji promenne
let tileSize = 32; // 32 pixelu
let rows = 16; 
let columns = 16;

let board;
let boardWidth = tileSize * columns; // 32 * 16
let boardHeight = tileSize * rows; //32 * 16
let context;

//lod a jeji promenne
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

//mimozemstani a jejich promenne
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

window.onload = function() { // po nacteni stranky se spusti vse v funkci
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d"); //pouzivano pro kresleni do tabulky

    //vykresleni lodi
    //context.fillstyle="green";
    //context.fillRect(ship.x, ship.y, ship.width, ship.height);

    //nacist obrazek
    shipImg = new Image();
    shipImg.src = "img/ship.png" //nastavi cestu obrazku lodi
    shipImg.onload = function() { //nacte obrazek lodi
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height); //vykresli lod
    }

    alienImg = new Image();
    alienImg.src = "img/alien1.png"; //nastavi cestu obrazku mimozemstana
    createAliens();

    requestAnimationFrame(update); //naslouchani stisku urcitych tlacitek v obnovovaci frekvenci
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);
}

function update() { //aktualizace stavu hry, vyvolana 'requestAnimationFrame(update);'
    requestAnimationFrame(update);

    if (gameOver){
        return;
    }

    context.clearRect(0, 0, board.width, board.height); //vymazani platna pro vykresleni novych objektu na platno

    //lod
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height); //vykresli lod

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
            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height); //vykresleni mimozemstanu

            if (alien.y >= ship.y){ //pokud se mimozemstane dostanou na radek lode, hra konci
                gameOver = true;
            }
        }
    }

    //strely
    for(let i = 0; i < bulletArray.length; i++) {
        let bullet = bulletArray[i];
        bullet.y += bulletVelocityY;
        context.fillStyle="white";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);  //vykresleni strel

        //kolize strel s mimozemstany
        for (let j = 0; j < alienArray.length; j++) {
            let alien = alienArray[j];
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)) { //hlida jestli nenastane kolize mimozemstana
                bullet.used = true;
                alien.alive = false;
                alienCount--;
                score += 100; // pokud je mimozemstan zasazen, pricte se 100 do skore
            }
        }
    }

    //vycistit strely
    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) { // odstranuje prebytecne strely aby se nepretizila pamet
        bulletArray.shift(); //odstrani prvni prvek z array
    }

    //dalsi level
    if (alienCount == 0) {
        //zvetsit pocet mimozemsanu v radcich a sloupcich o 1
    alienColumns = Math.min(alienColumns + 1, columns/2 -2); //omezeni na 16/2 -2 = 6
    alienRows = Math.min(alienRows + 1, rows-4); //cap at 16-4 = 12
    alienVelocityX += 0.1; //zvyseni rychlosti mimozemstanu
    alienArray = []; //pole mimozemstanu
    bulletArray = []; //pole strel
    createAliens(); //vyvola funkci ktera vytvori mimozemstany
    }

    //skore tabulka
    context.fillStyle="white";
    context.font="bolder 22px sans-serif";
    context.fillText(score, 5, 20);

}

function moveShip(e) { // funkce pro pohyb lodi
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

function createAliens() {  // vytvoreni mimozemstanu na zacatku hry
    for(let c = 0; c < alienColumns; c++){
        for (let r = 0; r < alienRows; r++) {
            let alien = { // velikost, pozice a obrazek mimozemstana
                img : alienImg,
                x : alienX + c*alienWidth,
                y : alienY + r*alienHeight,
                width : alienWidth,
                height : alienHeight,
                alive : true
            }
            alienArray.push(alien); // zapsani mimozemstana do pole
        }
    }
    alienCount = alienArray.length; //pocet mimozemstanu v poli
}

function shoot(e) { // funkce strelby
    if(gameOver){
        return;
    }

    if (e.code == "Space") {
        //strelba
        let bullet = { //velikost, pozice strely
            x : ship.x + shipWidth*15/32,
            y : ship.y,
            width : tileSize/8,
            height : tileSize/2,
            used : false
        }
        bulletArray.push(bullet); // zapsani strely do pole
    }
}

function detectCollision(a, b) { // detekce kolize
    return a.x < b.x + b.width &&   //levy horni roh a nedosahuje na pravy horni roh b
           a.x + a.width > b.x &&   //pravy horni roh a projde levym hornim rohem b
           a.y < b.y + b.height &&  //levy horni roh a nedosahuje na pravy spodni roh b
           a.y + a.height > b.y;    //levy spodni roh a projde levym hornim rohem b
}