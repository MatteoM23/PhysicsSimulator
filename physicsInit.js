import Matter from 'https://cdn.skypack.dev/matter-js';

const uiBoxWidth = 200;
const uiBoxHeight = 100;

export const engine = Matter.Engine.create();
export const world = engine.world;
let render;

export const initPhysics = () => {
    const adjustedHeight = window.innerHeight - uiBoxHeight;
    render = Matter.Render.create({
        element: document.body,
        engine: engine,
        canvas: document.getElementById('physicsCanvas'), // Target the canvas directly
        options: {
            width: window.innerWidth,
            height: adjustedHeight,
            wireframes: false,
            background: 'transparent'
        }
    });

    drawGradientBackground(render.canvas);

    const wallThickness = 50;
    const wallOptions = { isStatic: true, render: { visible: false } };
    const walls = [
        Matter.Bodies.rectangle(-wallThickness / 2, adjustedHeight / 2, wallThickness, adjustedHeight, wallOptions),
        Matter.Bodies.rectangle(window.innerWidth + wallThickness / 2, adjustedHeight / 2, wallThickness, adjustedHeight, wallOptions),
        Matter.Bodies.rectangle(window.innerWidth / 2, -wallThickness / 2, window.innerWidth, wallThickness, wallOptions),
        Matter.Bodies.rectangle(window.innerWidth / 2, adjustedHeight + (uiBoxHeight - wallThickness / 2), window.innerWidth, wallThickness, wallOptions)
    ];

    Matter.World.add(world, walls);

    Matter.Render.run(render);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    window.addEventListener('resize', debounce(() => {
        render.canvas.width = window.innerWidth;
        render.canvas.height = window.innerHeight - uiBoxHeight;
        render.options.width = window.innerWidth;
        render.options.height = window.innerHeight - uiBoxHeight;
        drawGradientBackground(render.canvas);
    }, 250));
};

function drawGradientBackground(canvas) {
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#000000');
    gradient.addColorStop(1, '#131722');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Optionally add stars or other background details here
}

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
