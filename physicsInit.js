import Matter from 'https://cdn.skypack.dev/matter-js';

// Define dimensions for the UI box
const uiBoxWidth = 200; // Reserve space for UI on the right
const uiBoxHeight = 100; // Reserve space for UI at the bottom

export const engine = Matter.Engine.create();
export const world = engine.world;

let render;

export const initPhysics = () => {
    // Adjust the width and height to account for the UI box
    const adjustedWidth = window.innerWidth - uiBoxWidth;
    const adjustedHeight = window.innerHeight - uiBoxHeight;

    render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: adjustedWidth,
            height: adjustedHeight,
            wireframes: false,
            background: 'transparent' // Set to transparent to allow custom drawing below
        }
    });

    // Draw gradient background
    drawGradientBackground(render.canvas);

    // Create floor and walls with appropriate dimensions and positions
    const floor = Matter.Bodies.rectangle(adjustedWidth / 2, adjustedHeight + 50, adjustedWidth, 100, { isStatic: true });
    const leftWall = Matter.Bodies.rectangle(-50, adjustedHeight / 2, 100, adjustedHeight, { isStatic: true });
    const rightWall = Matter.Bodies.rectangle(adjustedWidth + 50, adjustedHeight / 2, 100, adjustedHeight, { isStatic: true });
    const ceiling = Matter.Bodies.rectangle(adjustedWidth / 2, -50, adjustedWidth, 100, { isStatic: true });

    // Add the floor and walls to the world
    Matter.World.add(world, [floor, leftWall, rightWall, ceiling]);

    Matter.Render.run(render);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Resize listener to adjust canvas size dynamically
    window.addEventListener('resize', () => {
        render.canvas.width = window.innerWidth - uiBoxWidth;
        render.canvas.height = window.innerHeight - uiBoxHeight;
        render.options.width = window.innerWidth - uiBoxWidth;
        render.options.height = window.innerHeight - uiBoxHeight;

        // Redraw the gradient to fit the new dimensions
        drawGradientBackground(render.canvas);
    });

    // Register global collision event listener for handling custom material interactions
    Matter.Events.on(engine, 'collisionStart', (event) => {
        event.pairs.forEach((pair) => {
            // Execute interaction rules based on the materials of the colliding bodies
            // handleCollisions(event, engine); // Implement this function as needed
        });
    });

    // Log to indicate successful initialization
    console.log("Physics simulation initialized and ready for interaction.");
};

function drawGradientBackground(canvas) {
    const ctx = canvas.getContext('2d');
    // Ensure the gradient covers the full canvas at all times
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#333333'); // Dark gray at the top
    gradient.addColorStop(1, '#1a1a1a'); // Space gray at the bottom

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export { render }; // Export render so it can be used elsewhere
