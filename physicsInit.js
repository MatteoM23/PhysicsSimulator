import Matter from 'https://cdn.skypack.dev/matter-js';

const uiBoxWidth = 200; // Reserved UI box width, adjust as needed
const uiBoxHeight = 100; // Reserved UI box height, adjust as needed

export const engine = Matter.Engine.create(); // Create a Matter.js engine
export const world = engine.world; // Reference to the world for convenience
let render; // Will hold our renderer

export const initPhysics = () => {
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

    // Draw a gradient background on the canvas
    drawGradientBackground(render.canvas);

    // Define walls and add them to the world
    const wallThickness = 50; // Thickness of the walls
    const wallOptions = { isStatic: true, render: { visible: false } }; // Walls are static and invisible
    const walls = [
        Matter.Bodies.rectangle(window.innerWidth / 2, -wallThickness / 2, window.innerWidth, wallThickness, wallOptions), // Top wall
        Matter.Bodies.rectangle(window.innerWidth / 2, adjustedHeight + wallThickness / 2, window.innerWidth, wallThickness, wallOptions), // Bottom wall
        Matter.Bodies.rectangle(-wallThickness / 2, adjustedHeight / 2, wallThickness, adjustedHeight, wallOptions), // Left wall
        Matter.Bodies.rectangle(window.innerWidth + wallThickness / 2, adjustedHeight / 2, wallThickness, adjustedHeight, wallOptions) // Right wall
    ];
    Matter.World.add(world, walls); // Add the walls to the world

    Matter.Render.run(render); // Run the renderer
    const runner = Matter.Runner.create(); // Create a runner
    Matter.Runner.run(runner, engine); // Run the engine

    // Handle window resize
    window.addEventListener('resize', debounce(() => {
        render.canvas.width = window.innerWidth; // Update canvas width
        render.canvas.height = window.innerHeight - uiBoxHeight; // Update canvas height
        render.options.width = window.innerWidth; // Update renderer width
        render.options.height = window.innerHeight - uiBoxHeight; // Update renderer height
        drawGradientBackground(render.canvas); // Redraw the background
    }, 250));
};

// Function to draw a gradient background on the canvas
function drawGradientBackground(canvas) {
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#000000'); // Start color
    gradient.addColorStop(1, '#131722'); // End color
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the canvas with the gradient
}

// Debounce function to limit how often a function can be called
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}

export { render }; // Export the renderer for external access
