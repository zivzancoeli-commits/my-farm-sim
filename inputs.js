const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let keys = {};

const defaultControls = {
  moveUp: "arrowup",
  moveDown: "arrowdown",
  moveLeft: "arrowleft",
  moveRight: "arrowright",
  break: "b",
  place: "p",
  hotbar1: "1",
  hotbar2: "2",
  hotbar3: "3",
  hotbar4: "4",
  hotbar5: "5",
  hotbar6: "6",
  hotbar7: "7",
  hotbar8: "8",
  hotbar9: "9"
};

const controlLabels = {
  moveUp: "Walk Up",
  moveDown: "Walk Down",
  moveLeft: "Walk Left",
  moveRight: "Walk Right",
  break: "Break Block",
  place: "Place Block",
  hotbar1: "Hotbar Slot 1",
  hotbar2: "Hotbar Slot 2",
  hotbar3: "Hotbar Slot 3",
  hotbar4: "Hotbar Slot 4",
  hotbar5: "Hotbar Slot 5",
  hotbar6: "Hotbar Slot 6",
  hotbar7: "Hotbar Slot 7",
  hotbar8: "Hotbar Slot 8",
  hotbar9: "Hotbar Slot 9"
};

let controlsMap = loadControls();
let waitingBind = null;
let controlsScroll = 0;
let controlsTargetScroll = 0;
let controlsMaxScroll = 0;

function loadControls() {
  try {
    let saved = JSON.parse(localStorage.getItem("controls"));
    if (saved && typeof saved === "object") {
      return Object.assign({}, defaultControls, saved);
    }
  } catch (e) {}
  return Object.assign({}, defaultControls);
}
function saveControls() {
  localStorage.setItem("controls", JSON.stringify(controlsMap));
}

function isActionDown(action) {
  let key = controlsMap[action];
  return key && keys[key] === true;
}

function keyLabel(key) {
  if (!key) return "None";
  if (key === " ") return "Space";
  if (key === "escape") return "Esc";
  if (key.startsWith("arrow")) return key.replace("arrow", "Arrow ");
  return key.length === 1 ? key.toUpperCase() : key;
}

document.addEventListener("keydown", (e) => {
  let k = e.key.toLowerCase();
  if (waitingBind) {
    e.preventDefault();
    if (k === "escape") {
      waitingBind = null;
      refreshControlButtons();
      return;
    }
    for (let action in controlsMap) {
      if (controlsMap[action] === k && action !== waitingBind) {
        controlsMap[action] = null;
      }
    }
    controlsMap[waitingBind] = k;
    saveControls();
    waitingBind = null;
    refreshControlButtons();
    return;
  }
  keys[k] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

// --- Mouse Inputs ---

let LeftMousePressed = false;
let RightMousePressed = false;
let MouseX = 0;
let MouseY = 0; 


canvas.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    LeftMousePressed = true;
  }
  if (e.button === 2) {
    RightMousePressed = true;
  }
});
canvas.addEventListener("mouseup", (e) => {
  if (e.button === 0) {
    LeftMousePressed = false;
  }
  if (e.button === 2) {
    RightMousePressed = false;
  }
});
canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});
// mouse location on screen
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  MouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
  MouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
});

canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  if (Scene === "WorldSelector") {
    targetScrollY += e.deltaY;
  }
  if (Scene === "Controls") {
    controlsTargetScroll += e.deltaY;
    if (controlsTargetScroll < 0) controlsTargetScroll = 0;
    if (controlsTargetScroll > controlsMaxScroll) controlsTargetScroll = controlsMaxScroll;
  }
}, { passive: false });