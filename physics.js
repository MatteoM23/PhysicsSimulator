import Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/mode=imports/optimized/matter-js.js';

export function initPhysics() {
    // Create an engine
    const engine = Matter.Engine.create();
    const world = engine.world;

    // Create a renderer (optional here, assuming you might have this set up for visual output)
    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 800,
            height: 600,
            wireframes: false
        }
    });

    // Now add the ground and walls
    addGroundAndWalls(world);

    // Return the engine, world, and render for further use
    return { engine, world, render };
}

function addGroundAndWalls(world) {
    const ground = Matter.Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
    const leftWall = Matter.Bodies.rectangle(0, 305, 60, 610, { isStatic: true });
    const rightWall = Matter.Bodies.rectangle(800, 305, 60, 610, { isStatic: true });
    const ceiling = Matter.Bodies.rectangle(400, 0, 810, 60, { isStatic: true });

    Matter.World.add(world, [ground, leftWall, rightWall, ceiling]);
}
