import Matter from 'https://cdn.skypack.dev/matter-js';

export function initPhysics() {
    const engine = Matter.Engine.create();
    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'linear-gradient(to bottom, #e0c3fc, #8ec5fc)' // Gradient background color
        },
    });

    // Add floor and walls with gradient color
    const wallThickness = 10; // Adjust the thickness of the walls
    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, wallThickness, { 
        isStatic: true, 
        render: {
            fillStyle: 'linear-gradient(to right, #e0c3fc, #8ec5fc)', // Gradient fill color for floor
            strokeStyle: '#776e65' // Stroke color for floor
        } 
    });
    const leftWall = Matter.Bodies.rectangle(wallThickness / 2, window.innerHeight / 2, wallThickness, window.innerHeight, { 
        isStatic: true, 
        render: {
            fillStyle: 'linear-gradient(to bottom, #e0c3fc, #8ec5fc)', // Gradient fill color for left wall
            strokeStyle: '#776e65' // Stroke color for left wall
        } 
    });
    const rightWall = Matter.Bodies.rectangle(window.innerWidth - (wallThickness / 2), window.innerHeight / 2, wallThickness, window.innerHeight, { 
        isStatic: true, 
        render: {
            fillStyle: 'linear-gradient(to bottom, #e0c3fc, #8ec5fc)', // Gradient fill color for right wall
            strokeStyle: '#776e65' // Stroke color for right wall
        } 
    });
    
    Matter.World.add(engine.world, [ground, leftWall, rightWall]);

    Matter.Render.run(render);
    Matter.Runner.run(engine); // Fix for deprecated Engine.run

    return { engine, render, world: engine.world };
}
