// Ensure Matter.js is imported correctly from the CDN
import * as Matter from 'https://cdn.skypack.dev/matter-js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the Matter.js engine.
    const engine = Matter.Engine.create();
    const world = engine.world;

    // Set up rendering. This assumes you want to render to the body of your webpage.
    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false // Setting wireframes to false to see the styled rendering.
        },
    });

    // Example: Add a ground to the world.
    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 20, window.innerWidth, 40, {
        isStatic: true, // Ground should not fall under gravity
        render: { fillStyle: 'brown' } // Optional: style the ground
    });
    Matter.World.add(world, ground);

    // Start the engine and the renderer.
    Matter.Engine.run(engine);
    Matter.Render.run(render);

    // Example: Add event listener for clicks to create circles.
    window.addEventListener('click', function(event) {
        const x = event.clientX;
        const y = event.clientY;
        // Example: create a ball where the user clicks
        const ball = Matter.Bodies.circle(x, y, 30, {
            density: 0.04,
            friction: 0.01,
            restitution: 0.8, // Bounciness
            render: { fillStyle: 'blue' } // Optional: style the ball
        });
        Matter.World.add(world, ball);
    });
});
