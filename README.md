#Dodge NY Game

##MVP
This will be a dodge-the-obstacle-style game. It requires, at minimum:
- A field of view that scrolls
- A player character
- Non-moving obstacle objects
- A timer

##Technologies
- React for tracking field of view, obstacles, and player character as components
- JavaScript
- Canvas to render the field of view
- HTML/CSS for game info and timer

Challenge: "attaching" objects to a scrolling background.
Solution: scrolling background = coordinate plane; objects have an attachment point in their centers corresponding to a point in the grid

Challenge: movement of player character
Solution: player component listens for left/right keys and allows player to change coordinates left/right; scrolling background listens for up/down keys and "scroll" forward (toward player) at a set rate

Challenge: making objects appear in the field of view without blocking in the player
Solution: game generates objects randomly but checks (potentially using a node tree) that player always has a path to the upper bound of the field of view (i.e., forward)

Challenge: object collisions
Solution: player component checks its calculated boundaries for overlap with other objects' calculated boundaries

Challenge: movement of other objects (if there's time to add this)
Solution: collection of allowed movement vectors for each component (object type)

##Implementation Timeline

###Phase 1: Board, Timer, and Objects
- Board component
- Timer component
- Get board to scroll in canvas
- Create various components/object types
- Get objects to appear on canvas and scroll with board

###Phase 2: Player character
- Player component
- Get player component to move left/right in the canvas
- Get player component to appear on the grid in the canvas, with board scrolling beneath

###Phase 3: Collisions and Gameplay
- Make canvas stop scrolling when character collides with object
- End game if character collides with certain object types
- End game if character reaches destination (specific "latitude" of board)
