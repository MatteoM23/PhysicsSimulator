import { engine } from './physicsInit.js';
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

    canvas.addEventListener('mousedown', (event) => {
        isMouseDown = true;
        const rect = canvas.getBoundingClientRect();
        mousePosition = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
        console.log(`mousedown at: x=${mousePosition.x}, y=${mousePosition.y}`); // Log for mouse down
        createBody(mousePosition.x, mousePosition.y);
    });

    canvas.addEventListener('mousemove', (event) => {
        if (isMouseDown) {
            const rect = canvas.getBoundingClientRect();
            mousePosition = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
            console.log(`mousemove with mousedown at: x=${mousePosition.x}, y=${mousePosition.y}`); // Log for mouse move
            createBody(mousePosition.x, mousePosition.y);
        }
    });

    window.addEventListener('mouseup', () => {
        isMouseDown = false;
        console.log(`mouseup - mouse is no longer down.`);
    });
};

console.log("Event listener script loaded. Waiting for DOMContentLoaded to setup event listeners.");
