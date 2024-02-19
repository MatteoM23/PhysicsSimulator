import Matter from 'https://cdn.skypack.dev/matter-js';

// Create an engine
export const engine = Matter.Engine.create();
let render;
export const world = engine.world;

// Create a renderer
export const render = Matter.Render.create({
    element: document.body, // Assuming the simulation is attached to the body
    engine: engine,
    options: {
        width: Math.min(document.documentElement.clientWidth, 800),
        height: Math.min(document.documentElement.clientHeight, 600),
        wireframes: false, // Set to false for solid rendering
        background: '#f0f0f0' // Light grey background
    }
});

// Function to add walls
const addWalls = () => {
    const { width, height } = render.options;
    // Thickness of the walls
    const thickness = 50;

    // Parameters: x, y, width, height, [options]
    const ground = Matter.Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, { isStatic: true });
    const ceiling = Matter.Bodies.rectangle(width / 2, -thickness / 2, width, thickness, { isStatic: true });
    const leftWall = Matter.Bodies.rectangle(-thickness / 2, height / 2, thickness, height, { isStatic: true });
    const rightWall = Matter.Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, { isStatic: true });

    // Add the walls to the world
    Matter.World.add(world, [ground, ceiling, leftWall, rightWall]);
};

export const initPhysics = () => {
    // Create a renderer
    render = Matter.Render.create({
        element: document.body, // Assuming you want the renderer to attach to the body
        engine: engine,
        options: {
            width: window.innerWidth - uiBoxWidth,
            height: window.innerHeight - uiBoxHeight,
            wireframes: false,
            background: '#f0f0f0'
        }
    });

    // Add walls or additional setup here

    // Run the renderer
    Matter.Render.run(render);

    // Create a runner to run the engine
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
};

export { render }; // Export render so it can be used elsewhere
