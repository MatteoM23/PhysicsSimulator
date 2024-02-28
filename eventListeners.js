// Assuming this is eventListeners.js
import { engine } from './physicsInit.js';
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

    // Optional: Add event listener for keydown if you want to change materials using keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case '1':
                currentMaterial = 'sand';
                break;
            case '2':
                currentMaterial = 'water';
                break;
            // Add more cases as needed
        }
    });
};

const createBodyAtMouse = () => {
    const { x, y } = mousePosition; // Convert these to world coordinates if necessary
    createBody(x, y, currentMaterial);
};

const createBody = (x, y, materialName) => {
    const material = materials[materialName];
    if (!material) {
        console.error(`Material '${materialName}' not found.`);
        return;
    }

    // Assuming a function to convert screen coordinates to world coordinates exists
    // Let's say it's called screenToWorld and defined in utils.js
    // const { x: worldX, y: worldY } = screenToWorld(x, y);

    const body = Matter.Bodies.circle(x, y, 10, {
        density: material.density,
        friction: material.friction,
        restitution: material.restitution,
        render: { fillStyle: material.color },
    });

    Matter.World.add(world, body); // Ensure 'world' is imported or defined within this script or imported from 'physicsInit.js'
};

// Initial setup call
setupEventListeners();
