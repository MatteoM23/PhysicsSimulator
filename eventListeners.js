import { engine, render } from './physicsInit.js'; // Ensure render is correctly imported for debug
import { createBody } from './materialManager.js';
import Matter from 'https://cdn.skypack.dev/matter-js';

let isMouseDown = false;
let mousePosition = { x: 0, y: 0 };

export const setupEventListeners = () => {
    const canvas = document.getElementById('physicsCanvas');

    if (!canvas) {
        console.error("physicsCanvas not found.");
        return;
    } else {
        console.log("physicsCanvas found, attaching event listeners.");
    }

    // Enhanced mouse down event listener with additional debug
    canvas.addEventListener('mousedown', (event) => {
        isMouseDown = true;
        const rect = canvas.getBoundingClientRect();
        mousePosition = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
        console.log(`mousedown - Creating body at x: ${mousePosition.x}, y: ${mousePosition.y}`);
        createBody(mousePosition.x, mousePosition.y); // Confirming call to createBody on mousedown
    });

    // Enhanced mouse move event listener to create body only when mouse is down
    canvas.addEventListener('mousemove', (event) => {
        if (isMouseDown) {
            const rect = canvas.getBoundingClientRect();
            mousePosition = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
            console.log(`mousemove - Creating body at x: ${mousePosition.x}, y: ${mousePosition.y}`);
            createBody(mousePosition.x, mousePosition.y); // Confirming continuous body creation on mousemove
        }
    });

    // Enhanced mouse up event listener with additional debug
    window.addEventListener('mouseup', () => {
        isMouseDown = false;
        console.log(`mouseup - Mouse is now up. Stopping body creation.`);
    });
};

console.log("Event listener script enhanced and loaded. Ready for interaction.");
