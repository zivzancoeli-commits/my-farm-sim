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
            list.push({ block: "grass", x: x, y: 0, z: z });
        }
    }

    function setGround(x, z, name) {
        let i = list.findIndex(b => b.x === x && b.y === 0 && b.z === z);
        if (i !== -1) list[i].block = name;
        else list.push({ block: name, x: x, y: 0, z: z });
    }

    // raised hill: dirt under, grass on top
    setGround(4, 4, "dirt");
    setGround(5, 4, "dirt");
    setGround(4, 5, "dirt");
    setGround(5, 5, "dirt");
    list.push({ block: "grass", x: 4, y: 1, z: 4 });
    list.push({ block: "grass", x: 5, y: 1, z: 4 });
    list.push({ block: "grass", x: 4, y: 1, z: 5 });
    list.push({ block: "grass", x: 5, y: 1, z: 5 });

    // full-block “steps” around the hill (no slabs)
    setGround(3, 4, "dirt");
    setGround(3, 5, "dirt");
    setGround(4, 3, "dirt");
    setGround(5, 3, "dirt");
    setGround(6, 4, "cobblestone");
    setGround(6, 5, "cobblestone");
    setGround(6, 3, "stone_path");

    // path from spawn
    setGround(0, 1, "gravel_path");
    setGround(0, 2, "gravel_path");
    setGround(1, 2, "gravel_path");
    setGround(2, 2, "gravel_path");
    setGround(3, 2, "stone_path");
    setGround(3, 3, "stone_path");

    // clutter (full blocks only)
    setGround(-4, 0, "crate");
    setGround(-5, 0, "wood_planks");
    setGround(-5, 1, "fence_block");
    setGround(-5, -1, "fence_block");
    setGround(2, -3, "cobblestone");
    setGround(1, -3, "stone_brick");
    setGround(-6, -5, "sand");
    setGround(-5, -5, "sand");
    setGround(-6, -4, "sand");

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
        player: { x: 0, y: 0, z: 0 }
    };
}
