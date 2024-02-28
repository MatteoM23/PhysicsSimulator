import { createBody } from './materialManager.js';
import { render } from './physicsInit.js'; // Import render to check bounds if necessary

let isMouseDown = false;

export const setupEventListeners = () => {
    const canvas = document.getElementById('physicsCanvas');
    
    if (!canvas) {
        console.error("Canvas not found. Ensure your canvas ID is correct.");
        return;
    } else {
        console.log("Canvas found, setting up event listeners...");
    }

    canvas.addEventListener('mousedown', event => {
        isMouseDown = true;
        const rect = canvas.getBoundingClientRect();
        const clientX = event.clientX - rect.left;
        const clientY = event.clientY - rect.top;
        console.log(`Mouse down detected at canvas position: x=${clientX}, y=${clientY}`);
        createBodyAtMousePosition(clientX, clientY);
    });

    canvas.addEventListener('mousemove', event => {
        if (isMouseDown) {
            const rect = canvas.getBoundingClientRect();
            const clientX = event.clientX - rect.left;
            const clientY = event.clientY - rect.top;
            console.log(`Mouse move with button down at canvas position: x=${clientX}, y=${clientY}`);
            createBodyAtMousePosition(clientX, clientY);
        }
    });

    window.addEventListener('mouseup', () => {
        if (isMouseDown) {
            console.log("Mouse up detected. Stopping body creation.");
            isMouseDown = false;
        }
    });
};

function createBodyAtMousePosition(clientX, clientY) {
    console.log(`Attempting to create body at canvas position: x=${clientX}, y=${clientY}`);
    
    // Additional check: Ensure coordinates are within canvas bounds
    if (clientX < 0 || clientY < 0 || clientX > render.canvas.width || clientY > render.canvas.height) {
        console.warn(`Attempted to create body outside canvas bounds. x=${clientX}, y=${clientY}`);
        return;
    }

    createBody(clientX, clientY); // Adjusted to pass clientX and clientY directly
}

document.addEventListener('DOMContentLoaded', setupEventListeners);
console.log("Event listeners script loaded and waiting for DOMContentLoaded.");
