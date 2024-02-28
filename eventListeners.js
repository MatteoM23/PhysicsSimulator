import { createBody } from './materialManager.js';
import { screenToWorld } from './utils.js'; // Assuming this function is correctly set up to convert coordinates

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('physicsCanvas');
    
    if (!canvas) {
        console.error("Canvas not found. Ensure your canvas ID is correct.");
        return;
    }

    console.log("Canvas found, attaching event listeners.");

    function handleMouseDown(event) {
        console.log("Mouse down detected.");
        const { x, y } = screenToWorld(event.clientX, event.clientY, canvas);
        console.log(`Creating body at world coordinates: x=${x}, y=${y}`);
        createBody(x, y);
    }

    canvas.addEventListener('mousedown', handleMouseDown);

    canvas.addEventListener('mousemove', event => {
        // Only create bodies if the mouse is down (isMouseDown is true)
    });

    window.addEventListener('mouseup', () => {
        // Set isMouseDown to false when the mouse is released
    });
});
