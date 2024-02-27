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
    }

    canvas.addEventListener('mousedown', (event) => {
        isMouseDown = true;
        // Adjusting to get mouse position relative to the canvas
        const rect = canvas.getBoundingClientRect();
        mousePosition = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
        createBody(mousePosition.x, mousePosition.y); // currentMaterial is handled within createBody
    });

    canvas.addEventListener('mousemove', (event) => {
        if (isMouseDown) {
            const rect = canvas.getBoundingClientRect();
            mousePosition = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
            createBody(mousePosition.x, mousePosition.y); // currentMaterial is handled within createBody
        }
    });

    window.addEventListener('mouseup', () => {
        isMouseDown = false;
    });
};

// Call setupEventListeners() where appropriate, for example, after the DOM has fully loaded.
// This might be done in your main script file where the rest of your initialization code resides.
