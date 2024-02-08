// Import necessary modules from the Skypack CDN
import Matter from 'https://cdn.skypack.dev/matter-js';

// Since the detailed code for creating materials and handling interactions is not provided,
// it's assumed that `createMaterial`, `materialProperties`, and `handleInteractions`
// are defined in separate files and are correctly importing Matter from the CDN as well.

// Assuming `createMaterial`, `materialProperties`, and `handleInteractions`
// are exported from their respective modules correctly.
import { createMaterial, materialProperties } from './materials.js';
import { handleInteractions } from './interactions.js';

document.addEventListener('DOMContentLoaded', () => {
    // Create an engine and a renderer
    const engine = Matter.Engine.create();
    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false
        }
    });

    // Create ground to prevent particles from falling indefinitely
    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 40, { isStatic: true });
    Matter.World.add(engine.world, ground);

    // Initialize custom interactions
    handleInteractions(engine, engine.world);

    // Default material
    let currentMaterial = 'sand';

    // Create UI for material selection
    const materialSelector = document.createElement('div');
    materialSelector.id = 'materialSelector';
    document.body.appendChild(materialSelector);

    Object.keys(materialProperties).forEach(material => {
        const button = document.createElement('button');
        button.innerText = material;
        button.addEventListener('click', () => currentMaterial = material);
        materialSelector.appendChild(button);
    });

    // Handle mouse down event to create materials
    window.addEventListener('mousedown', function(event) {
        // Convert screen coordinates to world coordinates
        // Assuming `screenToWorld` is defined in your utilities and correctly imported
        const { x, y } = screenToWorld(event.clientX, event.clientY);
        createMaterial(x, y, currentMaterial, engine.world);
    });

    // Run the engine and renderer
    Matter.Engine.run(engine);
    Matter.Render.run(render);
});

function screenToWorld(x, y, render) {
    // Assuming zoom and pan are stored or can be calculated
    // For example purposes, let's say you have these values
    const zoom = render.options.zoom || 1; // Default to 1 if not zoomed
    const pan = render.options.pan || { x: 0, y: 0 }; // Default to no pan

    // Adjust for zoom
    const adjustedX = (x - pan.x) / zoom;
    const adjustedY = (y - pan.y) / zoom;

    return { x: adjustedX, y: adjustedY };
}

