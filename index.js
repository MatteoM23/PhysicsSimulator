import * as Matter from 'https://cdn.skypack.dev/matter-js';
import { materials, createMaterial } from './materials.js';
import { handleInteractions } from './interactions.js';
import { engine, world, initPhysics } from './physics.js';
import { screenToWorld } from './utils.js';

// Initialize the simulation environment
initPhysics();

// Setup the renderer to show the simulation
const render = Matter.Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
    },
});

// Populate the material selector UI
const materialSelector = document.getElementById('materialSelector');
Object.keys(materials).forEach((key) => {
    const material = materials[key];
    const button = document.createElement('button');
    button.innerHTML = material.label;
    button.onclick = () => { currentMaterial = key; };
    button.style.background = material.render.fillStyle;
    materialSelector.appendChild(button);
});

let currentMaterial = 'sand'; // Default material

// Add event listener for adding particles on mouse down
window.addEventListener('mousedown', (event) => {
    const { x, y } = screenToWorld(event.clientX, event.clientY);
    createMaterial(x, y, currentMaterial, world);
});

// Handling custom interactions defined in interactions.js
handleInteractions(engine, world);

// Start the simulation
Matter.Engine.run(engine);
Matter.Render.run(render);
