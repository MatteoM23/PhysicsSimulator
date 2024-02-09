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

export function addSparks(x, y, material, world) {
    const spark = Matter.Bodies.circle(x, y, material.size, {
        density: material.density,
        friction: material.friction,
        restitution: material.restitution || 0,
        render: { fillStyle: material.color },
    });
    Matter.World.add(world, spark);
}

export function addGroundAndWalls(world, width, height) {
    const ground = Matter.Bodies.rectangle(width / 2, height, width, 60, { isStatic: true, render: { fillStyle: '#464646' } });
    const walls = [
        Matter.Bodies.rectangle(width / 2, -30, width, 60, { isStatic: true }),
        Matter.Bodies.rectangle(width / 2, height + 30, width, 60, { isStatic: true }),
        Matter.Bodies.rectangle(-30, height / 2, 60, height, { isStatic: true }),
        Matter.Bodies.rectangle(width + 30, height / 2, 60, height, { isStatic: true })
    ];
    Matter.World.add(world, [ground, ...walls]);
}
