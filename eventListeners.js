import { engine } from './physicsInit.js';
import { createBody } from './materialManager.js';
import Matter from 'https://cdn.skypack.dev/matter-js';

let isMouseDown = false;
let mousePosition = { x: 0, y: 0 };

export const setupEventListeners = () => {
    // Ensuring event listeners are attached to the canvas element
    const canvas = document.getElementById('physicsCanvas');
    
    if (!canvas) {
        console.error("physicsCanvas not found.");
        return;
    } else {
        console.log("physicsCanvas found, attaching event listeners.");
    }

    canvas.addEventListener('mousedown', (event) => {
        isMouseDown = true;
        // Adjusting to get mouse position relative to the canvas
        const rect = canvas.getBoundingClientRect();
        mousePosition = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
        console.log(`mousedown at: x=${mousePosition.x}, y=${mousePosition.y}`);
        createBody(mousePosition.x, mousePosition.y); // currentMaterial is handled within createBody
    });

    canvas.addEventListener('mousemove', (event) => {
        if (isMouseDown) {
            const rect = canvas.getBoundingClientRect();
            mousePosition = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
            console.log(`mousemove with mousedown at: x=${mousePosition.x}, y=${mousePosition.y}`);
            createBody(mousePosition.x, mousePosition.y); // currentMaterial is handled within createBody
        }
    });

    window.addEventListener('mouseup', () => {
        isMouseDown = false;
        console.log(`mouseup - mouse is no longer down.`);
    });
};

// Debug statement to confirm the file was loaded
console.log("Event listener script loaded. Waiting for DOMContentLoaded to setup event listeners.");

// It's important to ensure this function is called at an appropriate time,
// such as after the DOM has fully loaded to ensure all elements are available.
// This could be handled in your main script file or directly within a <script> tag in your HTML.
