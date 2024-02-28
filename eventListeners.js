// Assuming this is eventListeners.js
import { engine, world } from './physicsInit.js'; // Import both engine and world
import { currentMaterial } from './dropdown.js'; // Import the shared currentMaterial variable
import { materials } from './materialManager.js';
import Matter from 'https://cdn.skypack.dev/matter-js'; // Import Matter.js directly if not already globally available

let isMouseDown = false;
let mousePosition = { x: 0, y: 0 };

export const setupEventListeners = () => {
    document.addEventListener('mousedown', (event) => {
        isMouseDown = true;
        mousePosition = { x: event.clientX, y: event.clientY };
        createBodyAtMouse();
    });

    document.addEventListener('mousemove', (event) => {
        mousePosition = { x: event.clientX, y: event.clientY };
        if (isMouseDown) {
            createBodyAtMouse();
        }
    });

    document.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    // Additional event listeners as needed
};

const createBodyAtMouse = () => {
    const { x, y } = mousePosition; // Convert these to world coordinates if necessary
    createBody(x, y, currentMaterial);
};

function createBody(x, y, options, material) {
    let body = Matter.Bodies.circle(x, y, radius, options);
    body.material = material;

    // Debugging: Verify material assignment
    if (!body.material) {
        console.error("Material assignment failed for body", body);
    }

    Matter.World.add(engine.world, body);
    return body;
}


// Initial setup call
setupEventListeners();
