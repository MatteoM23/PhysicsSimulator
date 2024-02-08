import * as Matter from 'https://cdn.skypack.dev/matter-js';
import { materials, createMaterial } from './materials.js';
import { engine, world, initPhysics } from './physics.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the physics environment
    initPhysics();

    // Create UI container if it doesn't exist
    let uiContainer = document.getElementById('uiContainer');
    if (!uiContainer) {
        uiContainer = document.createElement('div');
        uiContainer.id = 'uiContainer';
        document.body.appendChild(uiContainer);
    }

    // Material Selector
    const materialSelector = document.createElement('div');
    materialSelector.id = 'materialSelector';
    uiContainer.appendChild(materialSelector);

    // Populate material selector
    Object.keys(materials).forEach(key => {
        const material = materials[key];
        const button = document.createElement('button');
        button.textContent = material.label;
        button.style.backgroundColor = material.render.fillStyle;
        button.onclick = () => currentMaterial = key;
        materialSelector.appendChild(button);
    });

    // Feature Buttons
    // Gravity Inversion Button
    const gravityButton = document.createElement('button');
    gravityButton.textContent = 'Invert Gravity';
    gravityButton.onclick = () => {
        engine.world.gravity.y *= -1;
    };
    uiContainer.appendChild(gravityButton);

    // Time Dilation Button
    const timeButton = document.createElement('button');
    timeButton.textContent = 'Toggle Time Dilation';
    let timeDilation = 1;
    timeButton.onclick = () => {
        timeDilation = timeDilation === 1 ? 0.5 : 1;
        engine.timing.timeScale = timeDilation;
    };
    uiContainer.appendChild(timeButton);

    // Default material
    let currentMaterial = 'sand';

    // Setup rendering
    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
        },
    });

    // Add particles on mouse click
    window.addEventListener('mousedown', event => {
        const { clientX, clientY } = event;
        createMaterial(clientX, clientY, currentMaterial, world);
    });

    // Run the engine and renderer
    Matter.Engine.run(engine);
    Matter.Render.run(render);
});
