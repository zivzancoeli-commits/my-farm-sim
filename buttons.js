let scrollY = 0;
let targetScrollY = 0;

// play
let play = {
  x: 375,
  y: 150,
  width: 100,
  height: 50,
  text: "Play",
  Scene: "MainScreen",
  Layer: 10,
  color: "green",
  hoverColor: "blue",
  textColor: "white",
  font: "15px sans-serif",
  scrolls: false,
  onClick: () => {
    Scene = "WorldSelector";
  }
};
let worldSelectorTopBar = {
  x: 0,
  y: 0,
  width: canvas.width,
  height: 75,
  Scene: "WorldSelector",
  Layer: 2,
  color: "rgb(30, 30, 30)",
  hoverColor: "rgb(30, 30, 30)",
  scrolls: false,
};

let leaveWorldSelector = {
  x: 25,
  y: 25,
  width: 50,
  height: 50,
  text: "<",
  Scene: "WorldSelector",
  Layer: 3,
  color: "transparent",
  hoverColor: "transparent",
  textColor: "white",
  font: "30px sans-serif",
  scrolls: false,
  onClick: () => {
    Scene = "MainScreen";
  }
};
let WorldBox1 = {
  x: canvas.width / 4 - 225 / 2, y: 100, width: 225, height: 175,
  text: " ",
  Scene: "WorldSelector",
  Layer: 1,
  color: "rgb(255, 255, 255)", hoverColor: "rgb(225, 225, 225)", textColor: "white", font: "15px sans-serif",
  scrolls: true,
  onClick: () => {
    currentSlot = 1;
    worldCreator();
  }
};

let WorldBox1Delete = {
  x: canvas.width / 4 - 225 / 2, y: 275, width: 225, height: 50,
  text: "Delete",
  Scene: "WorldSelector",
  Layer: 1,
  color: "rgb(255, 255, 255)", hoverColor: "rgb(225, 225, 225)", textColor: "black", font: "15px sans-serif",
  scrolls: true,
  onClick: () => {
    localStorage.removeItem("world1");
  }
};

let worldNameBox = {
  x: 100, y: 100, width: 100, height: 40,
  text: "",
  Scene: "worldCreator",
  Layer: 2,
  color: "rgba(255, 255, 255, 0.5)", hoverColor: "rgba(225, 225, 225, 0.4)",
  textColor: "black", font: "15px sans-serif",
  scrolls: false,
  selected: false,
  maxLength: 12,
  onClick: () => {
    worldNameBox.selected = true;
  }
};

let createWorldButton = {
  x: 150,
  y: 250,
  width: 100,
  height: 50,
  text: "Create",
  Scene: "worldCreator",
  Layer: 10,
  color: "white",
  hoverColor: "rgb(225, 225, 225)",
  textColor: "black",
  font: "18px sans-serif",
  scrolls: false,
  onClick: () => {
    worldChoices.name = worldNameBox.text;
    currentWorld = createWorld(worldChoices);
    blocks = currentWorld.blocks;
    localStorage.setItem("world" + currentSlot, JSON.stringify(currentWorld));
    Scene = "World1";
  }
};


let leaveWorldCreator = {
  x: 25,
  y: 25,
  width: 50,
  height: 50,
  text: "<",
  Scene: "worldCreator",
  Layer: 3,
  color: "transparent",
  hoverColor: "transparent",
  textColor: "white",
  font: "30px sans-serif",
  scrolls: false,
  onClick: () => {
    Scene = "WorldSelector";
  }
};




//   x: canvas.width / 1.333 - 112.5, y: 100, width: 225, height: 225,



let maxScroll = 300;
// settings


let settings = {
  x: 375,
  y: 225,
  width: 100,
  height: 50,
  text: "Settings",
  Scene: "MainScreen",
  Layer: 1,
  color: "green",
  hoverColor: "blue",
  textColor: "white",
  font: "15px sans-serif",
  scrolls: false,
  onClick: () => {
    Scene = "Settings";
  }
};
let controls = {
  x: canvas.width / 4 - 50,
  y: 150,
  width: 100,
  height: 50,
  text: "Controls",
  Scene: "Settings",
  Layer: 1,
  color: "green",
  hoverColor: "blue",
  textColor: "white",
  font: "15px sans-serif",
  scrolls: false,
  onClick: () => {
    controlsScroll = 0;
    controlsTargetScroll = 0;
    scrollY = 0;
    waitingBind = null;
    refreshControlButtons();
    Scene = "Controls";
  }
};

const controlOrder = [
  "moveUp", "moveDown", "moveLeft", "moveRight",
  "break", "place",
  "hotbar1", "hotbar2", "hotbar3", "hotbar4", "hotbar5",
  "hotbar6", "hotbar7", "hotbar8", "hotbar9"
];
let controlBindButtons = [];
function buildControlButtons() {
  controlBindButtons = [];
  let startY = 90;
  let rowH = 36;
  for (let i = 0; i < controlOrder.length; i++) {
    let action = controlOrder[i];
    let y = startY + i * rowH;
    let labelBtn = {
      x: 80, y: y, width: 220, height: 32,
      action: action,
      text: controlLabels[action],
      Scene: "Controls",
      Layer: 1,
      color: "transparent",
      hoverColor: "transparent",
      textColor: "white",
      font: "16px sans-serif",
      scrolls: true,
      onClick: () => {}
    };
    let keyBtn = {
      x: 320, y: y, width: 160, height: 32,
      action: action,
      text: keyLabel(controlsMap[action]),
      Scene: "Controls",
      Layer: 1,
      color: "rgb(60, 60, 60)",
      hoverColor: "rgb(90, 90, 90)",
      textColor: "white",
      font: "15px sans-serif",
      scrolls: true,
      onClick: () => {
        waitingBind = action;
        refreshControlButtons();
      }
    };
    controlBindButtons.push(labelBtn, keyBtn);
  }
  controlsMaxScroll = Math.max(0, startY + controlOrder.length * rowH - 320);
}

function refreshControlButtons() {
  for (let b of controlBindButtons) {
    if (!b.action || b.color === "transparent") continue;
    if (waitingBind === b.action) {
      b.text = "> press key <";
      b.color = "rgb(120, 90, 40)";
      b.hoverColor = "rgb(140, 110, 50)";
    } else {
      b.text = keyLabel(controlsMap[b.action]);
      b.color = "rgb(60, 60, 60)";
      b.hoverColor = "rgb(90, 90, 90)";
    }
  }
}

buildControlButtons();
refreshControlButtons();

let leaveControls = {
  x: 25, y: 25, width: 50, height: 50,
  text: "<",
  Scene: "Controls",
  Layer: 3,
  color: "transparent",
  hoverColor: "transparent",
  textColor: "white",
  font: "30px sans-serif",
  scrolls: false,
  onClick: () => {
    waitingBind = null;
    refreshControlButtons();
    Scene = "Settings";
  }
};

let controlsTitle = {
  x: 170, y: 30, width: 300, height: 40,
  text: "Controls",
  Scene: "Controls",
  Layer: 3,
  color: "transparent",
  hoverColor: "transparent",
  textColor: "white",
  font: "22px sans-serif",
  scrolls: false,
  onClick: () => {}
};

let resetControls = {
  x: 220, y: 420, width: 200, height: 40,
  text: "Reset Defaults",
  Scene: "Controls",
  Layer: 3,
  color: "rgb(80, 50, 50)",
  hoverColor: "rgb(110, 70, 70)",
  textColor: "white",
  font: "15px sans-serif",
  scrolls: false,
  onClick: () => {
    controlsMap = Object.assign({}, defaultControls);
    saveControls();
    waitingBind = null;
    refreshControlButtons();
  }
};


let leaveSettings = {
  x: 25,
  y: 25,
  width: 50,
  height: 50,
  text: "<",
  Scene: "Settings",
  Layer: 1,
  color: "transparent",
  hoverColor: "transparent",
  textColor: "white",
  font: "30px sans-serif",
  scrolls: false,
  onClick: () => {
    Scene = "MainScreen";
  }
};







let quit = {
  x: 375,
  y: 300,
  width: 100,
  height: 50,
  text: "Quit",
  Scene: "MainScreen",
  Layer: 1,
  color: "green",
  hoverColor: "blue",
  textColor: "white",
  font: "15px sans-serif",
  scrolls: false,
  onClick: () => {
    console.log("Quit");
  }
};












let buttons = [play, settings, quit, leaveSettings, leaveWorldSelector, WorldBox1, worldSelectorTopBar, worldNameBox, leaveWorldCreator, createWorldButton, WorldBox1Delete, controls, leaveControls, controlsTitle, resetControls, ...controlBindButtons];



document.addEventListener("keydown", (e) => {
  if (!worldNameBox.selected || Scene !== worldNameBox.Scene) return;
  if (e.key.length === 1 && worldNameBox.text.length < worldNameBox.maxLength) {
    worldNameBox.text += e.key;
  }
  if (e.key === "Backspace") {
    worldNameBox.text = worldNameBox.text.slice(0, -1);
    e.preventDefault();
  }
  if (e.key === "Enter") {
    worldNameBox.selected = false;
    worldChoices.name = worldNameBox.text;
  }
})
canvas.addEventListener("mousedown", (e) => {
  if (e.button !== 0) return;
  for (let layer = 10; layer >= 0; layer--) {
    for (let button of buttons) {
      if (button.Layer === layer && button.Scene === Scene && isMouseOver(button)) {
        button.onClick();
        return;
      }
    }
  }
});
