import Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/mode=imports/optimized/matter-js.js';
import { materials, createMaterial } from './materials.js';
import { engine, world, initPhysics, addWalls } from './physics.js'; // Correct the import based on the provided `addWalls` function
import { handleInteractions } from './interactions.js';

document.addEventListener('DOMContentLoaded', () => {
    initPhysics(engine, world); // Initialize physics settings, ensure this function is correctly defined in `physics.js`
    addWalls(engine, render); // Add walls around the canvas

    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
        },
    });

    // Dynamic Material Selector
    const materialSelector = document.createElement('div');
    materialSelector.style.position = 'fixed';
    materialSelector.style.top = '10px';
    materialSelector.style.left = '50%';
    materialSelector.style.transform = 'translateX(-50%)';
    materialSelector.style.zIndex = 100;
    document.body.appendChild(materialSelector);

    Object.keys(materials).forEach(key => {
        const material = materials[key];
        const btn = document.createElement('button');
        btn.textContent = material.label;
        btn.onclick = () => { currentMaterial = key; };
        materialSelector.appendChild(btn);
    });

    let currentMaterial = 'sand'; // Default material

    // Mouse event for continuous particle creation
    let isMouseDown = false;
    document.addEventListener('mousedown', (event) => {
        isMouseDown = true;
        document.addEventListener('mousemove', onMouseMove);
        onMouseMove(event); // Create a particle immediately
    });
    document.addEventListener('mouseup', () => {
        isMouseDown = false;
        document.removeEventListener('mousemove', onMouseMove);
    });

    function onMouseMove(event) {
        if (!isMouseDown || event.target.tagName.toLowerCase() === 'button') {
            return; // Prevent particle creation when clicking buttons
        }
        const { x, y } = { x: event.clientX, y: event.clientY };
        createMaterial(x, y, currentMaterial, engine.world); // Adjust this function as necessary
    }

    handleInteractions(engine, world); // Ensure interactions are handled

    Matter.Engine.run(engine);
    Matter.Render.run(render);
});
