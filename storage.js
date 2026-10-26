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

    // Full block at y=0 plus a half-block at y=1: surface = 1.5
    // (a lone half-block at y=0 has surface 0.5, which is a step down).
    function addStep(x, z, base, step) {
        setGround(x, z, base);
        list.push({ block: step, x: x, y: 1, z: z });
    }

    // Raised grass hill: dirt under + grass on top (surface = 2).
    setGround(4, 4, "dirt");
    setGround(5, 4, "dirt");
    setGround(4, 5, "dirt");
    setGround(5, 5, "dirt");
    list.push({ block: "grass", x: 4, y: 1, z: 4 });
    list.push({ block: "grass", x: 5, y: 1, z: 4 });
    list.push({ block: "grass", x: 4, y: 1, z: 5 });
    list.push({ block: "grass", x: 5, y: 1, z: 5 });

    // Stone stairs on the path side (south, -z) and the east side (+x).
    // Grass floor (1) → stair (1.5) → hill (2), each step 0.5.
    addStep(4, 3, "cobblestone", "stone_stairs");
    addStep(5, 3, "cobblestone", "stone_stairs");
    addStep(6, 4, "cobblestone", "stone_stairs");
    addStep(6, 5, "cobblestone", "stone_stairs");

    // path leading to the south stairs
    setGround(0, 1, "gravel_path");
    setGround(0, 2, "gravel_path");
    setGround(1, 2, "gravel_path");
    setGround(2, 2, "gravel_path");
    setGround(3, 2, "stone_path");
    setGround(3, 3, "stone_path");
    setGround(4, 2, "stone_path");
    setGround(5, 2, "stone_path");

    // clutter (full blocks only — lone slabs at y=0 punch holes in the floor)
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
