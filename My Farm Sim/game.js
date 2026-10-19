let Scene = "MainScreen";



// Mouse position check
function isMouseOver(thing) {
  let y = thing.scrolls ? thing.y - scrollY : thing.y;
  return MouseX >= thing.x && MouseX <= thing.x + thing.width &&
         MouseY >= y && MouseY <= y + thing.height;
}




function drawButton(button) {
  let y = button.scrolls ? button.y - scrollY : button.y;
  
  if (isMouseOver(button)) {
    ctx.fillStyle = button.hoverColor;
  } else {
    ctx.fillStyle = button.color;
  }
  ctx.fillRect(button.x, y, button.width, button.height);
  ctx.fillStyle = button.textColor;
  ctx.font = button.font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(button.text, button.x + button.width / 2, y + button.height / 2)
}

function drawButtons () {
  let screenButtons = buttons.filter((button) => button.Scene === Scene);
  for (let layer = 0; layer <= 10; layer++) {
    for (let button of screenButtons) {
      if (button.Layer === layer) {
        drawButton(button);
      }
    }
  }
}


function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // for checks and changes here
  if (Scene === "WorldSelector") {
  // spring back if past the edges
 if (targetScrollY < 0) {
    targetScrollY += (0 - targetScrollY) * 0.2;
  }
  if (targetScrollY > maxScroll) {
   targetScrollY += (maxScroll - targetScrollY) * 0.2;
 }
   // slide the real scroll toward the target
   scrollY += (targetScrollY - scrollY) * 0.15;
  }
  if (Scene === "Farm") {
    runFarm();
  }
    
  

 // layer drawing
 drawButtons();
  
  
  
  
  
  
  

requestAnimationFrame(gameLoop);
}
gameLoop();
