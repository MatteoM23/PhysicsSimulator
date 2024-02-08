// Use the provided optimized Matter.js CDN link
import Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/mode=imports/optimized/matter-js.js';

// Assume materials.js exports a `materials` object with properties for each material
import { materials } from './materials.js';
import { initPhysics, addWalls } from './physics.js';
import { handleInteractions } from './interactions.js';

document.addEventListener('DOMContentLoaded', () => {
    const engine = Matter.Engine.create();
    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
        },
    });

    // Initialize physics and add invisible walls
    initPhysics(engine);
    addWalls(engine, render);

    // UI setup
    const uiContainer = document.createElement('div');
    document.body.appendChild(uiContainer);
    uiContainer.style.position = 'fixed';
    uiContainer.style.top = '0';
    uiContainer.style.left = '0';
    uiContainer.style.width = '100%';
    uiContainer.style.display = 'flex';
    uiContainer.style.flexDirection = 'column';
    uiContainer.style.alignItems = 'center';
    uiContainer.style.zIndex = '1';

    let currentMaterial = 'sand'; // Default material
    const materialSelector = document.createElement('div');
    uiContainer.appendChild(materialSelector);

    Object.keys(materials).forEach(material => {
        const btn = document.createElement('button');
        btn.innerText = material;
        btn.addEventListener('click', () => {
            currentMaterial = material;
        });
        materialSelector.appendChild(btn);
    });

    // Feature buttons setup
    const featureButtons = document.createElement('div');
    uiContainer.appendChild(featureButtons);

    const gravityBtn = document.createElement('button');
    gravityBtn.innerText = 'Invert Gravity';
    gravityBtn.addEventListener('click', () => {
        engine.world.gravity.y = -engine.world.gravity.y;
    });
    featureButtons.appendChild(gravityBtn);

    const timeBtn = document.createElement('button');
    timeBtn.innerText = 'Toggle Time Dilation';
    timeBtn.addEventListener('click', () => {
        engine.timing.timeScale = engine.timing.timeScale === 1 ? 0.5 : 1;
    });
    featureButtons.appendChild(timeBtn);

    // Continuous particle creation on mouse hold
    let mouseHold = false;
    document.addEventListener('mousedown', (e) => {
        mouseHold = true;
        const interval = setInterval(() => {
            if (!mouseHold) clearInterval(interval);
            if (e.target.tagName.toLowerCase() === 'button') return; // Prevents particle creation when clicking UI buttons
            const mousePosition = { x: e.clientX, y: e.clientY - uiContainer.offsetHeight };
            const materialConfig = materials[currentMaterial];
            const body = Matter.Bodies.circle(mousePosition.x, mousePosition.y, materialConfig.size, {
                ...materialConfig.options,
                render: { fillStyle: materialConfig.color },
            });
            Matter.World.add(engine.world, body);
        }, 100); // Adjust interval as needed for performance
    });

    document.addEventListener('mouseup', () => {
        mouseHold = false;
    });

    handleInteractions(engine);

    Matter.Engine.run(engine);
    Matter.Render.run(render);
});
