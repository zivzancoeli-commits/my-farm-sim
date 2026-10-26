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
    list.push({ block: "dirt", x: 4, y: 0, z: 4 });
    list.push({ block: "dirt", x: 5, y: 0, z: 4 });
    list.push({ block: "dirt", x: 4, y: 0, z: 5 });
    list.push({ block: "dirt", x: 5, y: 0, z: 5 });
    list.push({ block: "grass", x: 4, y: 1, z: 4 });
    list.push({ block: "grass", x: 5, y: 1, z: 4 });
    list.push({ block: "grass", x: 4, y: 1, z: 5 });
    list.push({ block: "grass", x: 5, y: 1, z: 5 });
    list.push({ block: "grass_slope", x: 3, y: 0, z: 4 });
    list.push({ block: "grass_slope", x: 3, y: 0, z: 5 });
    list.push({ block: "grass_slope", x: 4, y: 0, z: 3 });
    list.push({ block: "grass_slope", x: 5, y: 0, z: 3 });
    list.push({ block: "stone_stairs", x: 6, y: 0, z: 4 });
    list.push({ block: "stone_stairs", x: 6, y: 0, z: 5 });
    list.push({ block: "gravel_path", x: 0, y: 0, z: 1 });
    list.push({ block: "gravel_path", x: 0, y: 0, z: 2 });
    list.push({ block: "gravel_path", x: 1, y: 0, z: 2 });
    list.push({ block: "gravel_path", x: 2, y: 0, z: 2 });
    list.push({ block: "stone_path", x: 3, y: 0, z: 2 });
    list.push({ block: "stone_path", x: 3, y: 0, z: 3 });
    list.push({ block: "wood_slab", x: -2, y: 0, z: -1 });
    list.push({ block: "stone_slab", x: -3, y: 0, z: -1 });
    list.push({ block: "crate", x: -4, y: 0, z: 0 });
    list.push({ block: "wood_planks", x: -5, y: 0, z: 0 });
    list.push({ block: "fence_block", x: -5, y: 0, z: 1 });
    list.push({ block: "fence_block", x: -5, y: 0, z: -1 });
    list.push({ block: "cobblestone", x: 2, y: 0, z: -3 });
    list.push({ block: "cobblestone_stairs", x: 1, y: 0, z: -3 });
    list.push({ block: "sand", x: -6, y: 0, z: -5 });
    list.push({ block: "sand", x: -5, y: 0, z: -5 });
    list.push({ block: "sand", x: -6, y: 0, z: -4 });
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
