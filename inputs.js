const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let keys = {};


document.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
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
}, { passive: false });