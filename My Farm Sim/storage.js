let currentWorld = null;
let currentSlot = 0;

function newWorld() {
    return { 
        day: 1, 
        coins: 50,
        player: { x: 2, y: 2, z: 0 },
        map: [
            [// layer 0 ground
            [3, 2, 0, 3, 0, 0, -1, 0, -1, 0],
            [2, 0, 0, 0, 2, 0, 0, -1, 0, -1]
            ], [ // layer 1, one block up from ground
            [2, -1, 0, -1, 2, 0, 0, -1, -1, 0],
            [0, -1, -1, 0, -1, 0, 0, 0, -1, 0]
            ]
        ]
    };
}
function saveWorld(slot, data) {
    localStorage.setItem("world" + slot, JSON.stringify(data));
}
function loadWorld(slot) {
    let text = localStorage.getItem("world" + slot);
    if (text === null) {
      return newWorld();
    } return JSON.parse(text);
}
function worldExists(slot) {
return localStorage.getItem("world" + slot) !== null;
}