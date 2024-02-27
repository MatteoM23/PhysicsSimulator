import { createBody } from './materialManager.js';

// Assuming render and engine are correctly set up and accessible as needed
let isMouseDown = false;

export const setupEventListeners = () => {
    const canvas = document.getElementById('physicsCanvas');
    
    if (!canvas) {
        console.error("Canvas not found. Ensure your canvas ID is correct.");
        return;
    }

    // Listen for mousedown events to start creating bodies
    canvas.addEventListener('mousedown', event => {
        isMouseDown = true;
        console.log("Mouse down detected.");
        createBodyAtMousePosition(event);
    });

    // Optional: If you want bodies to be created continuously while the mouse moves
    canvas.addEventListener('mousemove', event => {
        if (isMouseDown) {
            console.log("Mouse move detected with button down.");
            createBodyAtMousePosition(event);
        }
    });

    // Listen for mouseup anywhere in the window to stop creating bodies
    window.addEventListener('mouseup', () => {
        if (isMouseDown) {
            console.log("Mouse up detected. Stopping body creation.");
            isMouseDown = false;
        }
    });
};

function createBodyAtMousePosition(event) {
    // Adjust coordinates for canvas position and scale
    const rect = event.target.getBoundingClientRect();
    const clientX = event.clientX - rect.left;
    const clientY = event.clientY - rect.top;

    // Logging for debugging
    console.log(`Creating body at: x=${clientX}, y=${clientY}`);

    // Call your createBody function with adjusted coordinates
    createBody(clientX, clientY);
}

// Make sure to call setupEventListeners somewhere in your initialization code
document.addEventListener('DOMContentLoaded', setupEventListeners);
