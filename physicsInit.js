import Matter from 'https://cdn.skypack.dev/matter-js';

const uiBoxWidth = 200; // Reserved UI box width, adjust as needed
const uiBoxHeight = 100; // Reserved UI box height, adjust as needed

export const engine = Matter.Engine.create(); // Create a Matter.js engine
export const world = engine.world; // Reference to the world for convenience
let render; // Will hold our renderer

export const initPhysics = () => {
    console.log("Initializing physics...");

    const adjustedHeight = window.innerHeight - uiBoxHeight; // Adjust the canvas height to make room for UI
    render = Matter.Render.create({
        element: document.body, // Parent element for the canvas
        engine: engine,
        canvas: document.getElementById('physicsCanvas'), // Target the canvas directly
        options: {
            width: window.innerWidth,
            height: adjustedHeight,
            wireframes: false, // Set to false for filled shapes
            background: 'transparent' // Transparent background
        }
    });

    console.log("Physics renderer created.", render);

    // Draw a gradient background on the canvas
    drawGradientBackground(render.canvas);
    console.log("Gradient background drawn.");

    // Define walls and add them to the world
    const wallThickness = 50; // Thickness of the walls
    const wallOptions = { isStatic: true, render: { visible: false } }; // Walls are static and invisible
    const walls = [
        Matter.Bodies.rectangle(window.innerWidth / 2, -wallThickness / 2, window.innerWidth, wallThickness, wallOptions),
        Matter.Bodies.rectangle(window.innerWidth / 2, adjustedHeight + wallThickness / 2, window.innerWidth, wallThickness, wallOptions),
        Matter.Bodies.rectangle(-wallThickness / 2, adjustedHeight / 2, wallThickness, adjustedHeight, wallOptions),
        Matter.Bodies.rectangle(window.innerWidth + wallThickness / 2, adjustedHeight / 2, wallThickness, adjustedHeight, wallOptions)
    ];
    Matter.World.add(world, walls); // Add the walls to the world
    console.log("Walls added to the world.", walls);

    Matter.Render.run(render); // Run the renderer
    console.log("Renderer started.");

    const runner = Matter.Runner.create(); // Create a runner
    Matter.Runner.run(runner, engine); // Run the engine
    console.log("Engine runner started.");

    // Handle window resize with debounce
    window.addEventListener('resize', debounce(() => {
        console.log("Window resized, updating canvas and renderer dimensions.");
        render.canvas.width = window.innerWidth;
        render.canvas.height = window.innerHeight - uiBoxHeight;
        render.options.width = window.innerWidth;
        render.options.height = window.innerHeight - uiBoxHeight;
        drawGradientBackground(render.canvas);
    }, 250));
};

function drawGradientBackground(canvas) {
    console.log("Drawing gradient background...");
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#000000'); // Start color
    gradient.addColorStop(1, '#131722'); // End color
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
            console.log("Debounced function executed.");
        }, wait);
    };
}

export { render }; // Export the renderer for external access
