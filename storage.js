let currentWorld = null;
let currentSlot = 1;
let worldChoices = { name: "", difficulty: "normal", map: "normal", startCoins: 50, day: 1 };

function worldCreator() {
    let saved = localStorage.getItem("world" + currentSlot);
    if (saved === null) {
        Scene = "worldCreator";
    } else {
        currentWorld = JSON.parse(saved);
        blocks = currentWorld.blocks || [];
        Scene = "World1";
    }
}

function makeGround() {
    let list = [];
    for (let x = -7; x <= 7; x++) {
        for (let z = -7; z <= 7; z++) {
            list.push({ block: "grass", x: x, y: 0, z: z});
        }
    }
    return list;
}

function saveWorld() {
    currentWorld.blocks = blocks;
    localStorage.setItem("world" + currentSlot, JSON.stringify(currentWorld));
}

function createWorld(choices) {
    return {
        blocks: makeGround(),
        name: choices.name,
        difficulty: choices.difficulty,
        map: choices.map,
        coins: choices.startCoins,
        day: 1,
        player: {x: 0, y: 0, z: 0}
    };
}
