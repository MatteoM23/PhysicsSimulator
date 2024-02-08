// Ensure the import statement is correct
import * as Matter from 'https://cdn.skypack.dev/matter-js';
import { materials, createMaterial } from './materials.js';
import { handleInteractions } from './interactions.js';
import { screenToWorld } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // Confirm Matter.js is correctly loaded
    if (!Matter || !Matter.Engine) {
        console.error("Matter.js didn't load correctly.");
        return;
    }

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

    // Create invisible walls
    const createWalls = () => {
        const thickness = 50;
        const wallOptions = { isStatic: true, render: { visible: false }};
        const walls = [
            Matter.Bodies.rectangle(render.options.width / 2, 0, render.options.width, thickness, wallOptions), // Top
            Matter.Bodies.rectangle(render.options.width / 2, render.options.height, render.options.width, thickness, wallOptions), // Bottom
            Matter.Bodies.rectangle(0, render.options.height / 2, thickness, render.options.height, wallOptions), // Left
            Matter.Bodies.rectangle(render.options.width, render.options.height / 2, thickness, render.options.height, wallOptions) // Right
        ];
        Matter.World.add(engine.world, walls);
    };
    createWalls();

    // UI for Material Selection
    const uiContainer = document.createElement('div');
    uiContainer.style.position = 'fixed';
    uiContainer.style.top = '0';
    uiContainer.style.left = '0';
    uiContainer.style.width = '100%';
    uiContainer.style.display = 'flex';
    uiContainer.style.justifyContent = 'center';
    uiContainer.style.zIndex = '1';
    document.body.appendChild(uiContainer);

    let currentMaterial = 'sand'; // Default material
    Object.entries(materials).forEach(([key, value]) => {
        const button = document.createElement('button');
        button.innerText = value.label;
        button.onclick = () => { currentMaterial = key; };
        uiContainer.appendChild(button);
    });

    // Feature Buttons
    const featureContainer = document.createElement('div');
    featureContainer.style.position = 'fixed';
    featureContainer.style.bottom = '10px';
    featureContainer.style.left = '50%';
    featureContainer.style.transform = 'translateX(-50%)';
    featureContainer.style.zIndex = '1';

    // Gravity Inversion Button
    const invertGravityBtn = document.createElement('button');
    invertGravityBtn.innerText = 'Invert Gravity';
    invertGravityBtn.onclick = () => { engine.world.gravity.y *= -1; };
    featureContainer.appendChild(invertGravityBtn);

    // Time Dilation Button
    const timeDilationBtn = document.createElement('button');
    timeDilationBtn.innerText = 'Toggle Time Dilation';
    let timeDilation = 1;
    timeDilationBtn.onclick = () => {
        timeDilation = timeDilation === 0.5 ? 1 : 0.5;
        engine.timing.timeScale = timeDilation;
    };
    featureContainer.appendChild(timeDilationBtn);

    document.body.appendChild(featureContainer);

    // Continuous Particle Creation
    let mouseHold = false;
    document.body.addEventListener('mousedown', (e) => {
        if (e.target === render.canvas) {
            mouseHold = true;
            document.body.addEventListener('mousemove', continuousCreation);
            continuousCreation(e); // For immediate response
        }
    });
    document.body.addEventListener('mouseup', () => {
        mouseHold = false;
        document.body.removeEventListener('mousemove', continuousCreation);
    });

    function continuousCreation(e) {
        if (!mouseHold) return;
        const { x, y } = screenToWorld(e.clientX, e.clientY);
        if (y > uiContainer.offsetHeight) { // Avoid spawning particles behind the UI
            createMaterial(x, y, currentMaterial, engine.world);
        }
    }

    handleInteractions(engine);

    Matter.Engine.run(engine);
    Matter.Render.run(render);
});

