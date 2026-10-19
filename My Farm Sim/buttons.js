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
  x: canvas.width / 4 - 112.5, y: 100, width: 225, height: 225,
  text: " ",
  Scene: "WorldSelector",
  Layer: 1,
  color: "rgb(255, 255, 255)", hoverColor: "rgb(225, 225, 225)", textColor: "white", font: "15px sans-serif",
  scrolls: true,
  onClick: () => {
    if (worldExists(1)) {
      currentWorld = loadWorld(1);
      Scene = "Farm"
    } else {
      currentSlot = 1;
      Scene = "CreateWorld";
    }
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

let visualSettings = {
  x: 25,
  y: 150,
  width: 150,
  height: 50,
  text: "Visual Settings",
  Scene: "Settings",
  Layer: 1,
  color: "green",
  hoverColor: "blue",
  textColor: "white",
  font: "15px sans-serif",
  scrolls: false,
  onClick: () => {
    Scene = "visualSettings";
  }
};
let leaveVisualSettings = {
  x: 25,
  y: 25,
  width: 50,
  height: 50,
  text: "<",
  Scene: "visualSettings",
  Layer: 1,
  color: "transparent",
  hoverColor: "transparent",
  textColor: "white",
  font: "30px sans-serif",
  scrolls: false,
  onClick: () => {
    Scene = "Settings";
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
    console.log("hi");
  }
};












let buttons = [play, settings, quit, visualSettings, leaveVisualSettings, leaveSettings, leaveWorldSelector, WorldBox1, worldSelectorTopBar];




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
