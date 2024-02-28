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

// Adjusted createBody function to accept radius as a parameter
function createBody(x, y, radius, options, material) {
    let body = Matter.Bodies.circle(x, y, radius, options);
    body.material = material;
    Matter.World.add(engine.world, body);
    return body;
}

// When calling createBody, ensure radius is provided
function createBodyAtMouse(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const material = getCurrentMaterial(); // Assuming a function that gets the current material
    const radius = 20; // Example fixed radius, or you could calculate this dynamically

    createBody(mouseX, mouseY, radius, { isStatic: false }, material);
}


// Initial setup call
setupEventListeners();
