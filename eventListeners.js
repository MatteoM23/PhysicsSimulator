import { createBody } from './materialManager.js';

let isMouseDown = false;

export const setupEventListeners = () => {
    document.addEventListener('DOMContentLoaded', () => {
        const canvas = document.getElementById('physicsCanvas');
        
        if (!canvas) {
            console.error("Canvas not found. Ensure your canvas ID is correct.");
            return;
        }

        console.log("Canvas found, attaching event listeners.");

        canvas.addEventListener('mousedown', event => {
            isMouseDown = true;
            console.log("Mouse down detected.");
            createBodyAtMousePosition(event);
        });

        canvas.addEventListener('mousemove', event => {
            if (isMouseDown) {
                console.log("Mouse move detected with button down.");
                createBodyAtMousePosition(event);
            }
        });

        window.addEventListener('mouseup', () => {
            if (isMouseDown) {
                console.log("Mouse up detected. Stopping body creation.");
                isMouseDown = false;
            }
        });
    });
};

function createBodyAtMousePosition(event) {
    const rect = event.target.getBoundingClientRect();
    const clientX = event.clientX - rect.left;
    const clientY = event.clientY - rect.top;

    console.log(`Attempting to create body at: x=${clientX}, y=${clientY}`);

    createBody(clientX, clientY);
}

// Ensuring setupEventListeners is called after DOM content has fully loaded.
setupEventListeners();
