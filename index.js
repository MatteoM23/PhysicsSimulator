import { Engine, Render, World, Bodies } from 'https://cdn.skypack.dev/matter-js';
import { createMaterial, materialProperties } from './materials.js';
import { screenToWorld } from './utils.js';
import { handleInteractions } from './interactions.js';

document.addEventListener('DOMContentLoaded', () => {
    const engine = Engine.create();
    const render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false
        }
    });

    // Add ground to prevent particles from falling indefinitely
    const ground = World.add(engine.world, [
        // Ground
        { type: 'rectangle', x: window.innerWidth / 2, y: window.innerHeight, width: window.innerWidth, height: 40, isStatic: true }
    ].map(spec => {
        return Bodies[spec.type](spec.x, spec.y, spec.width, spec.height, { isStatic: spec.isStatic });
    })[0]);

    // Initialize custom interactions
    handleInteractions(engine, engine.world);

    let currentMaterial = 'sand'; // Default material

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

    window.addEventListener('mousedown', function(event) {
        const { x, y } = screenToWorld(event.clientX, event.clientY); // Adjust based on actual utils function
        createMaterial(x, y, currentMaterial, engine.world);
    });

    Engine.run(engine);
    Render.run(render);
});
