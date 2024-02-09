import Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/mode=imports/optimized/matter-js.js';

export function initPhysics() {
    const engine = Matter.Engine.create();
    const world = engine.world;

    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 800,
            height: 600,
            wireframes: false
        }
    });

    // Adjust positions and make them invisible
    addGroundAndWalls(world, render.canvas.width, render.canvas.height);

    return { engine, world, render };
}

function addGroundAndWalls(world, canvasWidth, canvasHeight) {
    const thickness = 60; // Thickness of the walls and ground
    const offScreenMargin = 5; // Ensures walls and ceiling are just beyond the visible canvas
    
    // Adjust positions to be just outside the visible area and make them invisible
    const ground = Matter.Bodies.rectangle(canvasWidth / 2, canvasHeight + (thickness / 2) - offScreenMargin, canvasWidth, thickness, {
        isStatic: true,
        render: { visible: false } // Makes the ground invisible
    });

    const leftWall = Matter.Bodies.rectangle(-(thickness / 2) + offScreenMargin, canvasHeight / 2, thickness, canvasHeight, {
        isStatic: true,
        render: { visible: false } // Makes the left wall invisible
    });

    const rightWall = Matter.Bodies.rectangle(canvasWidth + (thickness / 2) - offScreenMargin, canvasHeight / 2, thickness, canvasHeight, {
        isStatic: true,
        render: { visible: false } // Makes the right wall invisible
    });

    const ceiling = Matter.Bodies.rectangle(canvasWidth / 2, -(thickness / 2) + offScreenMargin, canvasWidth, thickness, {
        isStatic: true,
        render: { visible: false } // Makes the ceiling invisible
    });

    Matter.World.add(world, [ground, leftWall, rightWall, ceiling]);
}
