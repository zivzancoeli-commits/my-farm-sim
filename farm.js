ctx.imageSmoothingEnabled = false;
let facing = { x: 0, z: 1 };
let cam = { x: 0, z: 0};
const blockTypes = {};

let hotbar = [
    { tool: "shovel" },
    { tool: "hoe" },
    { tool: "pickaxe" },
    { tool: "axe" },
    { tool: "wateringcan" },
    { block: "grass", count: 10 },
    { block: "dirt", count: 10 },
    null, null
];
let selected = 0;

function drawHotbar() {
    let size = 50;
    let startX = canvas.width / 2 - (hotbar.length * size) / 2;
    let y = canvas.height - size - 10;
    for (let i = 0; i < hotbar.length; i++) {
        let x = startX + i * size;
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(x, y, size, size);
        ctx.strokeStyle = i === selected ? "white" : "gray";
        ctx.lineWidth = i === selected ? 3 : 1;
        ctx.strokeRect(x, y, size, size);
        let slot = hotbar[i];
        if (slot && slot.block) {
            ctx.drawImage(blockTypes[slot.block].top, x + 5, y + 10, 40, 20);
            ctx.fillStyle = "white";
            ctx.font = "14px sans-serif";
            ctx.fillText(slot.count, x + 30, y + 45);
        } else if (slot && slot.tool) {
            ctx.fillStyle = "white";
            ctx.font = "10px sans-serif";
            ctx.fillText(slot.tool, x + 3, y + 40);
        }
    }
}

function addBlock(name, solid, tool) {
    let top = new Image(); top.src = "sprites/top/" + name + "_top.png";
    let front = new Image(); front.src = "sprites/front/" + name + "_front.png";
    let left = new Image(); left.src = "sprites/angled/" + name + "_left.png";
    blockTypes[name] = { top, front, left, solid, tool };
}
addBlock("grass", true, "shovel");
addBlock("dirt", true, "shovel");


let blocks = [
    { block: "grass", x: 0, y: 0, z: 0 },
    { block: "dirt", x: 1, y: 0, z: 0 },
]
function hasBlock(x, y, z) {
    return blocks.some(b => b.x === x && b.y === y && b.z === z);
}
const scale = 0.1;
function drawBlock(name, x, y, z) {
   
    let t = blockTypes[name];
    let { sx, sy, s } = toScreen(x, y, z);
    if (!hasBlock(x - 1, y, z)) ctx.drawImage(t.left, sx + 0, sy + 13 * s, 33 * s, 502 * s);
    if (!hasBlock(x, y, z - 1)) ctx.drawImage(t.front, sx + 31 * s, sy + 184 * s, 367 * s, 334 * s);
    ctx.drawImage(t.top, sx, sy, 398 * s, 199 * s);
}

function toScreen(x, y, z) {
    let s = scale;
    let sx = (x - 0.5) * 364 * s - z * 31 * s;
    let sy = -z * 181 * s - y * 318 * s - x * 15 * s;

    let camSX = cam.x * 364 * s - cam.z * 31 * s;
    let camSY = -cam.z * 181 * s - cam.x * 15 * s;

    sx = sx - Math.round(camSX) + canvas.width / 2;
    sy = sy - Math.round(camSY) + 300;
    return { sx, sy, s };
}

function drawWorld() {
    blocks.sort((a, b) => b.z - a.z || b.x - a.x || a.y - b.y);
    let p = currentWorld.player;
    let playerDrawn = false;
    for (let b of blocks) {
        if (!playerDrawn && b.z < Math.round(p.z)) {
            drawPlayer(p);
            playerDrawn = true;
        }
        drawBlock(b.block, b.x, b.y, b.z);
    }
    if (!playerDrawn) drawPlayer(p);
    drawHotbar();
}

function drawPlayer(p) {
    let pos = toScreen(p.x, p.y + 1, p.z);
    ctx.fillStyle = "red";
    ctx.fillRect(pos.sx + 150 * pos.s, pos.sy, 100 * pos.s, 300 * pos.s);
}

function groundHeight(x, z) {
    let tx = Math.round(x);
    let tz =  Math.round(z);
    let top = null;
    for (let b of blocks) {
        if (b.x === tx && b.z === tz) {
            if (top === null || b.y + 1 > top) top = b.y + 1;
        }
    }
    return top;
}

function updatePlayer() {
    let p = currentWorld.player;
    let speed = 0.05;
    let nx = p.x;
    let nz = p.z;
    if (keys["arrowleft"]) { nx -= speed; facing = { x: -1, z: 0 }; }
    if (keys["arrowright"]) { nx += speed; facing = { x: 1, z: 0 }; }
    if (keys["arrowup"]) { nz += speed; facing = { x: 0, z: 1 }; }
    if (keys["arrowdown"]) { nz -= speed; facing = { x: 0, z: -1 }; }
    
    let h = groundHeight(nx, p.z);
    if (h !== null && Math.abs((h - 1) - p.y) <= 0.5) {
        p.x = nx;
        p.y = h - 1;
    }
    let hz = groundHeight(p.x, nz);
    if (hz !== null && Math.abs((hz - 1) - p.y) <= 0.5) {
        p.z = nz;
        p.y = hz - 1;
    }
    cam.x = p.x;
    cam.z = p.z;
}

function addItem(name) {
    let slot = hotbar.find(s => s && s.block === name);
    if (slot) { slot.count++; return; }
    let empty = hotbar.indexOf(null);
    if (empty !== -1) hotbar[empty] = { block: name, count: 1 };
}

document.addEventListener("keydown", (e) => {
    if (Scene !== "World1") return;
    let p = currentWorld.player;
    let tx = Math.round(p.x + facing.x);
    let tz = Math.round(p.z + facing.z);
    if (e.key >= "1" && e.key <= "9") selected = Number(e.key) - 1;
    if (e.key === "b") {
        let levels = [p.y + 1, p.y];
        for (let y of levels) {
            let hit = blocks.find(b => b.x === tx && b.y === y && b.z === tz);
            if (hit) {
                let held = hotbar[selected];
                if (!held || held.tool !== blockTypes[hit.block].tool) break;
                blocks = blocks.filter(b => b !== hit);
                addItem(hit.block);
                saveWorld();
                break;
            }
        }
    }
    
    if (e.key === "p") {
        let slot = hotbar[selected];
        if (slot && slot.block && slot.count > 0) {
            let levels = [p.y, p.y + 1];
            for (let y of levels) {
                if (!hasBlock(tx, y, tz)) {
                    blocks.push({ block: slot.block, x: tx, y: y, z: tz });
                    slot.count--;
                    if (slot.count === 0) hotbar[selected] = null;
                    saveWorld();
                    break;
                }
            }
        }
    }
});