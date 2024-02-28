// Assuming createBody function is correctly defined in materialManager.js
import { createBody } from './materialManager.js';
import { screenToWorld } from './utils.js'; // Make sure this utility is correctly defined to convert screen to world coordinates

export const setupEventListeners = () => {
    const canvas = document.getElementById('physicsCanvas');
    
    if (!canvas) {
        console.error("Canvas not found. Ensure your canvas ID is correct.");
        return;
    }

    console.log("Canvas found, attaching event listeners.");

    canvas.addEventListener('mousedown', event => {
        console.log("Mouse down detected.");
        handleMouseEvent(event);
    });

    canvas.addEventListener('mousemove', event => {
        if (isMouseDown) {
            handleMouseEvent(event);
        }
    });

    window.addEventListener('mouseup', () => {
        console.log("Mouse up detected. Stopping body creation.");
        isMouseDown = false;
    });
};

let isMouseDown = false; // Track the mouse button state

function handleMouseEvent(event) {
    isMouseDown = true;
    const { x, y } = screenToWorld(event.clientX, event.clientY); // Convert to world coordinates if necessary
    console.log(`Creating body at: x=${x}, y=${y}`);
    createBody(x, y); // Call createBody with world coordinates
}
