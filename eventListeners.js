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

export const createBody = (x, y, materialName) => {
    const material = materials[materialName];
    if (!material) {
        console.error(`Material '${materialName}' not found.`);
        return;
    }

    const body = Matter.Bodies.circle(x, y, 10, {
        density: material.density,
        friction: material.friction,
        restitution: material.restitution,
        render: { fillStyle: material.color },
    });

    Matter.World.add(world, body); // Add body to the world
};

// Initial setup call
setupEventListeners();
