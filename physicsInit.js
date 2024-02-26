import Matter from 'https://cdn.skypack.dev/matter-js';

// Define dimensions for the UI box
const uiBoxWidth = 200; // Reserve space for UI on the right
const uiBoxHeight = 100; // Reserve space for UI at the bottom

export const engine = Matter.Engine.create();
export const world = engine.world;
let render;

export const initPhysics = () => {
    const adjustedHeight = window.innerHeight - uiBoxHeight;
    
    render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: adjustedHeight,
            wireframes: false,
            background: 'transparent'
        }
    });

    // Draw gradient background with stars
    drawGradientBackground(render.canvas);

    const wallThickness = 50;
    const wallOptions = { isStatic: true, render: { visible: false } };
    const walls = [
        Matter.Bodies.rectangle(-wallThickness / 2, adjustedHeight / 2, wallThickness, adjustedHeight, wallOptions),
        Matter.Bodies.rectangle(window.innerWidth + wallThickness / 2, adjustedHeight / 2, wallThickness, adjustedHeight, wallOptions),
        Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight + wallThickness / 2, window.innerWidth, wallThickness, wallOptions),
        Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 50, window.innerWidth, 100, { isStatic: true })
    ];

    // Add the walls to the world
    Matter.World.add(world, walls);

    Matter.Render.run(render);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Resize listener to adjust canvas size dynamically
    window.addEventListener('resize', debounce(() => {
        render.canvas.width = window.innerWidth;
        render.canvas.height = window.innerHeight - uiBoxHeight;
        render.options.width = window.innerWidth;
        render.options.height = window.innerHeight - uiBoxHeight;

        // Redraw the gradient and stars to fit the new dimensions
        drawGradientBackground(render.canvas);

        // Reposition the walls and floor accordingly
        // Walls repositioning logic here (omitted for brevity)
    }, 250));

    Matter.Events.on(engine, 'collisionStart', (event) => {
        // Collision handling logic here
    });

    console.log("Physics simulation initialized and ready for interaction.");
};

function drawGradientBackground(canvas) {
    const ctx = canvas.getContext('2d');
    const starsCount = 200;
    const starRadius = 1;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#000000');
    gradient.addColorStop(1, '#131722');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    for (let i = 0; i < starsCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const brightness = Math.random() * 0.5 + 0.5; // Ensure stars are visible

        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
        ctx.beginPath();
        ctx.arc(x, y, starRadius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Debounce function to limit rapid calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}

export { render };
