import * as Matter from 'https://cdn.skypack.dev/matter-js';
import { materials, createMaterial } from './materials.js';
import { handleInteractions } from './interactions.js';
import { screenToWorld } from './utils.js';
// If initPhysics is defined in a separate file, import it here
// import { initPhysics } from './physics.js';

document.addEventListener('DOMContentLoaded', () => {
    // Assuming initPhysics is properly defined and sets up the engine and world
    const engine = Matter.Engine.create(); // Placeholder for engine initialization
    const world = engine.world; // Accessing the world from the engine

    // Placeholder setupFeatureButtons function. Define this function based on your application's needs.
    const setupFeatureButtons = (container, world) => {
        // Example: Add a gravity inversion button
        const gravityButton = document.createElement('button');
        gravityButton.innerText = 'Invert Gravity';
        gravityButton.addEventListener('click', () => {
            world.gravity.y *= -1;
        });
        container.appendChild(gravityButton);
    };

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

    // Initialize UI for material selection and feature buttons
    const uiContainer = document.createElement('div');
    uiContainer.id = 'uiContainer';
    document.body.appendChild(uiContainer);

    const materialSelector = document.createElement('div');
    materialSelector.id = 'materialSelector';
    uiContainer.appendChild(materialSelector);

    // Dynamically populate material selector based on materials.js
    let currentMaterial = 'sand'; // Initialize with a default material
    Object.keys(materials).forEach(material => {
        const button = document.createElement('button');
        button.innerText = material;
        button.addEventListener('click', () => currentMaterial = material);
        materialSelector.appendChild(button);
    });

    // Setup additional feature buttons if needed
    setupFeatureButtons(uiContainer, world);

    // Handle mouse down event to create materials at the clicked position
    window.addEventListener('mousedown', (event) => {
        const { x, y } = screenToWorld(event.clientX, event.clientY);
        createMaterial(x, y, currentMaterial, world);
    });

    // Handle custom interactions defined in interactions.js
    handleInteractions(engine, world);

    // Run the engine and renderer
    Matter.Engine.run(engine);
    Matter.Render.run(render);
});
