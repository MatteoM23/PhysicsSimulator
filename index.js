// Import the entire Matter library from the Skypack CDN
import * as Matter from 'https://cdn.skypack.dev/matter-js';

// Import local modules. Ensure these modules are also updated to import Matter correctly.
import { createMaterial, materialProperties } from './materials.js';
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
            background: 'transparent' // Use a transparent background to see the CSS gradient
        }
    });

    // Create ground to prevent particles from falling indefinitely
    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 40, { isStatic: true });
    Matter.World.add(engine.world, ground);

    // Initialize custom interactions
    handleInteractions(engine, engine.world);

    let currentMaterial = 'sand'; // Default material

    // Create UI for material selection
    const materialSelector = document.createElement('div');
    materialSelector.id = 'materialSelector';
    document.body.appendChild(materialSelector);

    // Dynamically create buttons based on available materials
    Object.keys(materialProperties).forEach(material => {
        const button = document.createElement('button');
        button.innerText = material;
        button.addEventListener('click', () => currentMaterial = material);
        materialSelector.appendChild(button);
    });

    // Handle mouse down event to create materials
    window.addEventListener('mousedown', function(event) {
        const { x, y } = { x: event.clientX, y: event.clientY };
        createMaterial(x, y, currentMaterial, engine.world);
    });

    // Run the engine and renderer
    Matter.Engine.run(engine);
    Matter.Render.run(render);
});

