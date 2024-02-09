// physics.js
import Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/mode=imports/optimized/matter-js.js';

export function initPhysics() {
    const engine = Matter.Engine.create();
    const world = engine.world;
    engine.world.gravity.y = 1; // Default gravity setup

    // Initialize renderer with engine and options
    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
            height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
            wireframes: false,
        },
    });

    // Add ground and walls after render is created
    addGroundAndWalls(world, render);

    // Return engine, world, and render for further use
    return { engine, world, render };
}

function addGroundAndWalls(world, render) {
    // Ground
    const ground = Matter.Bodies.rectangle(render.options.width / 2, render.options.height, render.options.width, 60, {
        isStatic: true,
        render: { fillStyle: '#464646' },
    });
    Matter.World.add(world, ground);

    // Walls
    addWalls(world, render.options.width, render.options.height);
}

function addWalls(world, width, height) {
    const thickness = 50;
    const walls = [
        Matter.Bodies.rectangle(width / 2, -thickness / 2, width, thickness, { isStatic: true }), // Top
        Matter.Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, { isStatic: true }), // Bottom
        Matter.Bodies.rectangle(-thickness / 2, height / 2, thickness, height, { isStatic: true }), // Left
        Matter.Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, { isStatic: true }) // Right
    ];
    walls.forEach(wall => Matter.World.add(world, wall));
}
