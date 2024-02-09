// physics.js
import Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/mode=imports/optimized/matter-js.js';

export function initPhysics() {
    const engine = Matter.Engine.create();
    const world = engine.world;
    engine.world.gravity.y = 1; // Default gravity setup

    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
            height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
            wireframes: false,
        },
    });

    // Ensuring addGroundAndWalls is called after render is fully initialized.
    addGroundAndWalls(world, render.options.width, render.options.height);

    Matter.Render.run(render);

    return { engine, world, render };
}


export function addGroundAndWalls(world) {
    const ground = Matter.Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
    const leftWall = Matter.Bodies.rectangle(0, 305, 60, 610, { isStatic: true });
    const rightWall = Matter.Bodies.rectangle(800, 305, 60, 610, { isStatic: true });
    const ceiling = Matter.Bodies.rectangle(400, 0, 810, 60, { isStatic: true });

    Matter.World.add(world, [ground, leftWall, rightWall, ceiling]);
}

