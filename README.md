# My Farm Sim

## What it has
- A part 2D part 3D renderer for the player and the blocks
- A movement system that stops you from walking through blocks, over blocks, or jumping into the void of despair and sorrow
- A hotbar
- Working tools
- Sprites for the player, items, and blocks
- Whatever's in your hand gets displayed
- Customizable controls
- Working stairs and slabs

## Problems I ran into
- The player would be visible with blocks in the way (still kind of a bug)
- Each block moved separately
- You could walk through blocks if it was in the corner but now it checks if you're going diagonally
- It shook whenever you moved because of a camera smoothing change I added
- If you pull out the dirt it might crash your game. This is still going on so I recommend only playing with the grass for now

## What I'm adding next
- World generation that will "borrow" the way Minecraft does it using sound
- NPCs that can give quests
- A shop along with new tools
- Plants and trees
- A way to build a house

## How to play
1. Go to https://zivzancoeli-commits.github.io/my-farm-sim/
2. Click play
3. Click the white box above delete
4. The controls are Arrows NOT WASD and you can only break dirt and grass using the shovel and by clicking B, P is used to place with blocks in your hands. Also use the numbers 1-9 to switch between items on your hotbar. The only useful items at the moment are the shovel and the blocks.
