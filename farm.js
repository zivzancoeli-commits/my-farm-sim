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
    { block: "grass", count: 100 },
    { block: "dirt", count: 100 },
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

function addBlock(name, solid, tool, breakTime) {
    let top = new Image(); top.src = "sprites/blocks/top/" + name + "_top.png";
    let front = new Image(); front.src = "sprites/blocks/front/" + name + "_front.png";
    let left = new Image(); left.src = "sprites/blocks/angled/" + name + "_left.png";
    blockTypes[name] = { top, front, left, solid, tool, breakTime };
}
addBlock("grass", true, "shovel", 0.5);
addBlock("dirt", true, "shovel", 0.5);

const toolSpeeds = {
    shovel: { shovel: 1},
    pickaxe: { pickaxe: 1, shovel: 0.5 },
    axe: { axe: 1 },
    hoe: {},
    wateringcan: {}
};
let breaking = null

const dirs8 = ["down", "up", "left", "right", "down_left", "down_right", "up_left", "up_right"];
const toolsList = ["shovel", "hoe", "pickaxe", "axe", "wateringcan", "scythe", "fishing_rod"];

const playerIdle = {};
const playerWalk = {};
dirs8.forEach(dir => {
    let img = new Image();
    img.src = "sprites/player/player_" + dir + ".png";
    playerIdle[dir] = img;
    playerWalk[dir] = {};
    for (let n = 1; n <= 4; n++) {
        let w = new Image();
        w.src = "sprites/player/player_" + dir + "_walk_" + n + ".png";
        playerWalk[dir][n] = w;
    }
});

const playerHold = {};
const playerHoldWalk = {};
const playerUse = {};
toolsList.forEach(tool => {
    playerHold[tool] = {};
    playerHoldWalk[tool] = {};
    playerUse[tool] = {};
    dirs8.forEach(dir => {
        let h = new Image();
        h.src = "sprites/player/player_" + dir + "_hold_" + tool + ".png";
        playerHold[tool][dir] = h;
        playerHoldWalk[tool][dir] = {};
        for (let n = 1; n <= 4; n++) {
            let hw = new Image();
            hw.src = "sprites/player/player_" + dir + "_hold_" + tool + "_walk_" + n + ".png";
            playerHoldWalk[tool][dir][n] = hw;
        }
        playerUse[tool][dir] = {};
        if (dir === "down" || dir === "up" || dir === "left" || dir === "right") {
            for (let n = 1; n <= 3; n++) {
                let u = new Image();
                u.src = "sprites/player/player_" + dir + "_" + tool + "_" + n + ".png";
                playerUse[tool][dir][n] = u;
            }
        }
    });
});

function facingDir() {
    let x = facing.x;
    let z = facing.z;
    if (x === -1 && z === 1) return "up_left";
    if (x === 1 && z === 1) return "up_right";
    if (x === -1 && z === -1) return "down_left";
    if (x === 1 && z === -1) return "down_right";
    if (x === -1) return "left";
    if (x === 1) return "right";
    if (z === 1) return "up";
    return "down";
}

function useDir(dir) {
    if (dir === "down_left" || dir === "down_right") return "down";
    if (dir === "up_left" || dir === "up_right") return "up";
    return dir;
}

const itemIcons = {};
function getItemIcon(name) {
    if (itemIcons[name]) return itemIcons[name];
    let img = new Image();
    img.src = "sprites/items/" + name + ".png";
    itemIcons[name] = img;
    return img;
}

const heldBlockIcons = {};
function getHeldBlockIcons(name) {
    if (heldBlockIcons[name]) return heldBlockIcons[name];
    let img = new Image();
    img.src = "sprites/blocks/held/" + name + "_held.png";
    heldBlockIcons[name] = img;
    return img;
}

function handOffset(dir) {
    if (dir === "up") return { ox: 2, oy: 12 };
    if (dir === "left") return { ox: 0, oy: 13 };
    if (dir === "right") return { ox: 11, oy: 13 };
    if (dir === "down_left") return { ox: 1, oy: 14 };
    if (dir === "down_right") return { ox: 11, oy: 14 };
    if (dir === "up_left") return { ox: 1, oy: 12 };
    if (dir === "up_right") return { ox: 10, oy: 12 };
    return { ox: 10, oy: 14 };
}

function drawHeldOverlay(dir, x, y, ps, img) {
    if (!img) return;
    let off = handOffset(dir);
    let size = 8 * ps;
    ctx.drawImage(img, x + off.ox * ps, y + off.oy * ps, size, size);
}

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
    let ps = 2;
    let dir = facingDir();
    let x = pos.sx + 150 * pos.s - 8 * ps;
    let y = pos.sy;
    let held = hotbar[selected];
    let tool = held && held.tool;
    let moving = keys["arrowleft"] || keys["arrowright"] || keys["arrowup"] || keys["arrowdown"];
    let wf = Math.floor(performance.now() / 120) % 4 + 1;

    if (breaking) {
        let bHeld = hotbar[breaking.slot];
        let bTool = bHeld && bHeld.tool;
        let frames = bTool && playerUse[bTool] && playerUse[bTool][useDir(dir)];
        if (frames && frames[1]) {
            let t = (performance.now() - breaking.start) / breaking.time;
            let n = Math.min(3, Math.floor(t * 3) + 1);
            ctx.drawImage(frames[n], x - 8 * ps, y - 4 * ps, 32 * ps, 32 * ps);
            return;
        }
    }

    if (tool && playerHold[tool] && playerHold[tool][dir]) {
        if (moving) {
            ctx.drawImage(playerHoldWalk[tool][dir][wf], x - 8 * ps, y - 4 * ps, 32 * ps, 32 * ps);
        } else {
            ctx.drawImage(playerHold[tool][dir], x - 8 * ps, y - 4 * ps, 32 * ps, 32 * ps);
        }
        return;
    }

    let icon = null;
    if (held && held.block && blockTypes[held.block]) {
        icon = getHeldBlockIcons(held.block);
    } else if (held && held.item) {
        icon = getItemIcon(held.item);
    }

    let behind = dir === "up" || dir === "up_left" || dir === "up_right";
    if (behind && icon) drawHeldOverlay(dir, x, y, ps, icon);

    if (moving) {
        ctx.drawImage(playerWalk[dir][wf], x, y, 16 * ps, 24 * ps);
    } else {
        ctx.drawImage(playerIdle[dir], x, y, 16 * ps, 24 * ps);
    }

    if (!behind && icon) drawHeldOverlay(dir, x, y, ps, icon);
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
    let dx = 0;
    let dz = 0;
    if (keys["arrowleft"]) dx -= 1;
    if (keys["arrowright"]) dx += 1;
    if (keys["arrowup"]) dz += 1;
    if (keys["arrowdown"]) dz -= 1;
    if (dx !== 0) nx += dx * speed;
    if (dz !== 0) nz += dz * speed;
    if (dx !== 0 || dz !== 0) facing = { x: dx, z: dz };
    
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
    updateBreaking();
}

function updateBreaking() {
    if (!breaking) return;
    let p = currentWorld.player;
    if (p.x !== breaking.px || p.z !== breaking.pz || selected !== breaking.slot) {
        breaking = null;
        return;
    }
    if (performance.now() - breaking.start >= breaking.time) {
        blocks = blocks.filter(b => b !== breaking.hit);
        addItem(breaking.hit.block);
        saveWorld();
        breaking = null;
    }
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
        if (breaking) { breaking = null; return }
        let levels = [p.y + 1, p.y];
        for (let y of levels) {
            let hit = blocks.find(b => b.x === tx && b.y === y && b.z === tz);
            if (hit) {
                let held = hotbar[selected];
                if (!held || !held.tool) break;
                let speed = toolSpeeds[held.tool][blockTypes[hit.block].tool];
                if (!speed) break;
                breaking = {
                    hit: hit,
                    slot: selected,
                    px: p.x,
                    pz: p.z,
                    start: performance.now(),
                    time: blockTypes[hit.block].breakTime / speed * 1000
                };
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