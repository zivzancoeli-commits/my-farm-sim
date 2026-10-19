let cameraX = 0;
let cameraY = 0;
const tileSize = 32;
const layerHeight = 28;
const skew = 3;
const topHeight = 16;
const angledImage = new Image();
const frontImage = new Image();
const tilesImage = new Image();
tilesImage.src = "sprites/top.png";
frontImage.src = "sprites/front.png";
angledImage.src = "sprites/angled.png";


function getTile(x, y, z) {
    let layer = currentWorld.map[z];
    if (layer === undefined) {
        return -1;
    }
    let row = layer[y];
    if (row === undefined) {
        return -1;
    }
    let tile = row[x];
    if (tile === undefined) {
        return -1;
    }
    return tile;
}

function drawMap() {
    ctx.imageSmoothingEnabled = false;
    for (let z = 0; z < currentWorld.map.length; z++) {
        for (let y = 0; y < currentWorld.map[z].length; y++) {
            for (let x = 0; x < currentWorld.map[z][y].length; x++) {
                let tile = getTile(x, y, z);
                if (tile !== -1) {
                    let screenX = x * tileSize - cameraX + y * skew;
                    let screenY = y * topHeight - z * layerHeight - cameraY;
                    if (getTile(x, y + 1, z) === -1) {
                        ctx.drawImage(frontImage, tile * 16, 0, 16, 16, screenX, screenY + topHeight, tileSize, layerHeight);
                    }
                    if (getTile(x - 1, y, z) === -1 && z > 0) {
                        ctx.drawImage(angledImage, tile * 16, 0, 4, 16, screenX - skew, screenY + topHeight, skew, layerHeight);
                    }
                    ctx.drawImage(tilesImage, tile * 16, 0, 16, 16, screenX, screenY, tileSize, topHeight);
                }
            }
        }
    }
}

function updatePlayer() {
    if (keys["d"]) {
        currentWorld.player.x += 0.1;
    }
    if (keys["a"]) {
        currentWorld.player.x -= 0.1;
    }
    if (keys["w"]) {
        currentWorld.player.y -= 0.1;
    }
    if (keys["s"]) {
        currentWorld.player.y += 0.1;
    }
}

function drawPlayer() {
    let screenX = currentWorld.player.x * tileSize - cameraX + currentWorld.player.y * skew;
    let screenY = currentWorld.player.y * topHeight - currentWorld.player.z * layerHeight - cameraY;
    ctx.fillStyle = "red";
    ctx.fillRect(screenX, screenY, 20, 20);
}

function runFarm() {
    updatePlayer();
    cameraX = currentWorld.player.x * tileSize - canvas.width / 2;
    cameraY = currentWorld.player.y * topHeight - canvas.height / 2;
    drawMap();
    drawPlayer();
    ctx.fillStyle = "white";
    ctx.font = "20px sans-serif";
    ctx.fillText("Day: " + currentWorld.day, 60, 30);
    ctx.fillText("Coins: " + currentWorld.coins, 60, 60);

}


