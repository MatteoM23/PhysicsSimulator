import * as Matter from 'https://cdn.skypack.dev/matter-js';
import { materials, createMaterial } from './materials.js'; // Ensure this matches the exported names
import { handleInteractions } from './interactions.js'; // Assuming this is correctly exporting handleInteractions
import { screenToWorld } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize engine and world using physics.js logic
    const { engine, world, update } = initPhysics(); // Assuming initPhysics is properly exported from physics.js

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

    // Populate material selector from materials.js
    Object.keys(materials).forEach(material => {
        const button = document.createElement('button');
        button.innerText = material;
        button.addEventListener('click', () => currentMaterial = material);
        materialSelector.appendChild(button);
    });

    // Add feature buttons and interactions from interactions.js
    setupFeatureButtons(uiContainer, world); // Assuming setupFeatureButtons is properly defined to add buttons like "Invert Gravity"

    let currentMaterial = 'sand'; // Default material

    // Handle mouse down event to create materials at clicked position
    window.addEventListener('mousedown', (event) => {
        const { x, y } = screenToWorld(event.clientX, event.clientY); // Utilize screenToWorld from utils.js
        const body = createMaterial(x, y, currentMaterial, world); // Utilize createMaterial from materials.js
        Matter.World.add(world, body);
    });

    // Run custom interaction handlers from interactions.js
    handleInteractions(engine, world); // Ensure this is properly set up to listen for and handle interactions

    // Run the engine and renderer
    Matter.Engine.run(engine);
    Matter.Render.run(render);
});
