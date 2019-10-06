# Disclaimer

This is a crude approximation of a tool to generate .tres animation files for Godot's AnimatedSprite.

# Setup
1. Create a folder "input"
1. Add subfolders that signify the names of the animations, e.g.: `input/walk`, `input/run`
1. Add the animation sprites in the subfolders in the following format: d_nnn, d being an integer that represents the orientation of the sprite and n the number of the sprite frame. E.g.: `input/deployed/0_001.png` for direction `0` and frame `001`.
1. Set up the base of the Godot path in `params.json`. The sprite will be expected to be located in `godotResPath\*animationName*\*frameName*.png`
1. Run an npm i

# Run
`npm start`

Enjoy the `.tres` in your output directory :)