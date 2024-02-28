// Assuming createBody function is correctly defined in materialManager.js
import { materials  } from './materialManager.js';
import { screenToWorld } from './utils.js'; // Make sure this utility is correctly defined to convert screen to world coordinates

export const createBody = (x, y, materialName = 'steel') => {
    const material = materials[materialName];
    if (!material) {
        console.error(`Material '${materialName}' not found.`);
        return;
    }

    // Example: Creating a circle body with properties from the specified material
    const body = Matter.Bodies.circle(x, y, 10, {
        density: material.density,
        friction: material.friction,
        restitution: material.restitution,
        render: { fillStyle: material.color },
    });

    Matter.World.add(engine.world, body);
};

export const setupEventListeners = () => {
    const canvas = document.getElementById('physicsCanvas');
    
    if (!canvas) {
        console.error("Canvas not found. Ensure your canvas ID is correct.");
        return;
    }

    console.log("Canvas found, attaching event listeners.");

    canvas.addEventListener('mousedown', event => {
        console.log("Mouse down detected.");
        handleMouseEvent(event, 'steel'); // Example material name passed
    });

    canvas.addEventListener('mousemove', event => {
        if (isMouseDown) {
            handleMouseEvent(event, 'wood'); // Different example material name passed for demonstration
        }
    });

    window.addEventListener('mouseup', () => {
        console.log("Mouse up detected. Stopping body creation.");
        isMouseDown = false;
    });
};

let isMouseDown = false; // Track the mouse button state

function handleMouseEvent(event, materialName) {
    isMouseDown = true;
    const { x, y } = screenToWorld(event.clientX, event.clientY); // Convert to world coordinates if necessary
    console.log(`Creating body at: x=${x}, y=${y} with material: ${materialName}`);
    createBody(x, y, materialName); // Call createBody with world coordinates and material name
}
