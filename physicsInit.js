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
            background: '#f0f0f0'
        }
    });

    // Create floor and walls with appropriate dimensions and positions
    const floor = Matter.Bodies.rectangle(adjustedWidth / 2, adjustedHeight, adjustedWidth, 100, { isStatic: true });
    const leftWall = Matter.Bodies.rectangle(0, adjustedHeight / 2, 100, adjustedHeight, { isStatic: true });
    const rightWall = Matter.Bodies.rectangle(adjustedWidth, adjustedHeight / 2, 100, adjustedHeight, { isStatic: true });
    const ceiling = Matter.Bodies.rectangle(adjustedWidth / 2, 0, adjustedWidth, 100, { isStatic: true });

    // Add the floor and walls to the world
    Matter.World.add(world, [floor, leftWall, rightWall, ceiling]);

    Matter.Render.run(render);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Resize listener to adjust canvas size dynamically
    window.addEventListener('resize', function() {
        render.canvas.width = window.innerWidth - uiBoxWidth;
        render.canvas.height = window.innerHeight - uiBoxHeight;
        render.options.width = window.innerWidth - uiBoxWidth;
        render.options.height = window.innerHeight - uiBoxHeight;
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

export { render }; // Export render so it can be used elsewhere
