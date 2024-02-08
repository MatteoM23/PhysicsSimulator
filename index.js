import * as Matter from 'https://cdn.skypack.dev/matter-js';
import { materials, createMaterial } from './materials.js';
import { engine, world, initPhysics, addParticle } from './physics.js';
import { handleInteractions } from './interactions.js';
import { screenToWorld } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize physics, add ground and walls
    initPhysics();
    
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

    // Material Selector UI
    const uiContainer = document.createElement('div');
    uiContainer.id = 'uiContainer';
    document.body.appendChild(uiContainer);

    const materialSelector = document.createElement('div');
    materialSelector.id = 'materialSelector';
    uiContainer.appendChild(materialSelector);

    Object.keys(materials).forEach(key => {
        const button = document.createElement('button');
        button.innerText = materials[key].label;
        button.onclick = () => {
            currentMaterial = key;
        };
        materialSelector.appendChild(button);
    });

    // Feature Buttons
    const featureButtons = document.createElement('div');
    featureButtons.id = 'featureButtons';
    uiContainer.appendChild(featureButtons);

    // Gravity Inversion Button
    const gravityButton = document.createElement('button');
    gravityButton.innerText = 'Invert Gravity';
    gravityButton.onclick = () => {
        engine.world.gravity.y *= -1;
    };
    featureButtons.appendChild(gravityButton);

    // Time Dilation Button
    const timeButton = document.createElement('button');
    timeButton.innerText = 'Toggle Time Dilation';
    let timeScale = 1;
    timeButton.onclick = () => {
        timeScale = timeScale === 1 ? 0.5 : 1;
        engine.timing.timeScale = timeScale;
    };
    featureButtons.appendChild(timeButton);

    let isMouseDown = false;
    let mouseHoldInterval;

    window.addEventListener('mousedown', (event) => {
        if (event.target === render.canvas) {
            isMouseDown = true;
            const { x, y } = screenToWorld(event.clientX, event.clientY, render.canvas);
            mouseHoldInterval = setInterval(() => {
                addParticle(x, y, currentMaterial);
            }, 100); // Adjust time as needed
        }
    });

    window.addEventListener('mouseup', () => {
        clearInterval(mouseHoldInterval);
        isMouseDown = false;
    });

    window.addEventListener('mousemove', (event) => {
        if (isMouseDown) {
            const { x, y } = screenToWorld(event.clientX, event.clientY, render.canvas);
            addParticle(x, y, currentMaterial);
        }
    });

    // Prevent particle creation behind the UI by stopping propagation
    uiContainer.addEventListener('mousedown', (event) => {
        event.stopPropagation();
    });

    handleInteractions(engine, world);

    Matter.Engine.run(engine);
    Matter.Render.run(render);
});

let currentMaterial = 'sand'; // Default material
