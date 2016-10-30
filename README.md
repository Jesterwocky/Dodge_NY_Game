# Dodge NY Game

[Dodge NY](http://www.jessie-k-walker.com/Dodge_NY_Game/ "Dodge NY Game") is a game that simulates walking on a crowded New York City sidewalk. Surrounded by meandering strangers who jostle you and sap your patience, you must try to reach your destination before losing your cool.

# Tech

Dodge NY is written with vanilla JavaScript, using jQuery for DOM manipulation and WebPack for bundling assets.

## Collision Avoidance / Walking Algorithm

The game contains logic to ensure that person obstacles:
* Walk primarily north/south, with potential east/west drift.
* Stay within the left/right bounds.
* Wrap around when walking off the top or bottom bound.
* Avoid static obstacles on the sidewalk.
* Stay off the road unless avoiding a sidewalk obstacle or if specifically designated as a road-walking person.
