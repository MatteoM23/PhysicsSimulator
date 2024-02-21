import Matter from 'https://cdn.skypack.dev/matter-js';

// Define dimensions for the UI box
const uiBoxWidth = 200; // Reserve space for UI on the right
const uiBoxHeight = 100; // Reserve space for UI at the bottom

export const engine = Matter.Engine.create();
export const world = engine.world;
let render;

export const initPhysics = () => {
    // Adjust the height to account for the UI box
    const adjustedHeight = window.innerHeight - uiBoxHeight;
    
    render = Matter.Render.create({
        element: document.body,
        engine: engine,
        canvas: document.querySelector('canvas'), // Select the canvas element
        options: {
            wireframes: false,
            background: 'transparent' // Set to transparent to allow custom drawing below
        }
    });

    // Draw gradient background
    drawGradientBackground(render.canvas);

    // Create walls around the perimeter of the screen
    const wallThickness = 50;
    const wallOptions = { isStatic: true, render: { visible: false } };
    const leftWall = Matter.Bodies.rectangle(-wallThickness / 2, adjustedHeight / 2, wallThickness, adjustedHeight, wallOptions);
    const rightWall = Matter.Bodies.rectangle(window.innerWidth + wallThickness / 2, adjustedHeight / 2, wallThickness, adjustedHeight, wallOptions);
    const bottomWall = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight + wallThickness / 2, window.innerWidth, wallThickness, wallOptions);

    // Add the walls to the world
    Matter.World.add(world, [leftWall, rightWall, bottomWall]);

    // Create floor just above the bottom of the screen
    const floor = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 50, window.innerWidth, 100, { isStatic: true });

    // Add the floor to the world
    Matter.World.add(world, floor);

    Matter.Render.run(render);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Resize listener to adjust canvas size dynamically
    window.addEventListener('resize', () => {
        const adjustedHeight = window.innerHeight - uiBoxHeight;
        
        render.canvas.width = window.innerWidth;
        render.canvas.height = adjustedHeight;

        // Redraw the gradient to fit the new dimensions
        drawGradientBackground(render.canvas);

        // Reposition the walls and floor
        Matter.Body.setPosition(leftWall, { x: -wallThickness / 2, y: adjustedHeight / 2 });
        Matter.Body.setPosition(rightWall, { x: window.innerWidth + wallThickness / 2, y: adjustedHeight / 2 });
        Matter.Body.setPosition(bottomWall, { x: window.innerWidth / 2, y: window.innerHeight + wallThickness / 2 });
        Matter.Body.setPosition(floor, { x: window.innerWidth / 2, y: window.innerHeight - 50 });
    });

    // Log to indicate successful initialization
    console.log("Physics simulation initialized and ready for interaction.");
};

function drawGradientBackground(canvas) {
    const ctx = canvas.getContext('2d');
    const starsCount = 200; // Number of stars
    const starRadius = 1; // Radius of stars

    // Ensure the gradient covers the full canvas at all times
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#000000'); // Black at the top
    gradient.addColorStop(1, '#131722'); // Dark space grey at the bottom

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    for (let i = 0; i < starsCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const brightness = Math.random() * 0.4; // Random brightness between 0 and 0.4

        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`; // White with varying opacity
        ctx.beginPath();
        ctx.arc(x, y, starRadius, 0, Math.PI * 2);
        ctx.fill();
    }
}

export { render }; // Export render so it can be used elsewhere
