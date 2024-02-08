import * as Matter from 'https://cdn.skypack.dev/matter-js';
import { materials, createMaterial } from './materials.js';
import { handleInteractions } from './interactions.js';
import { screenToWorld } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize engine
    const engine = Matter.Engine.create();
    const world = engine.world;

    // Set up rendering
    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'transparent',
        },
    });

    // Create ground
    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 40, {
        isStatic: true,
        render: { fillStyle: '#787878' }
    });
    Matter.World.add(world, ground);

    // Initialize UI for material selection
    const uiContainer = document.createElement('div');
    uiContainer.id = 'uiContainer';
    document.body.appendChild(uiContainer);

    const materialSelector = document.createElement('div');
    materialSelector.id = 'materialSelector';
    uiContainer.appendChild(materialSelector);

    let currentMaterial = 'sand'; // Default material
    Object.keys(materials).forEach(material => {
        const button = document.createElement('button');
        button.innerText = material;
        button.addEventListener('click', () => currentMaterial = material);
        materialSelector.appendChild(button);
    });

    // Handle mouse down event to create materials at clicked position
    window.addEventListener('mousedown', (event) => {
        const { x, y } = screenToWorld(event.clientX, event.clientY, render.canvas);
        createMaterial(x, y, currentMaterial, world);
    });

    // Handle custom interactions defined in interactions.js
    handleInteractions(engine, world);

    // Run the engine and renderer
    Matter.Engine.run(engine);
    Matter.Render.run(render);
});
