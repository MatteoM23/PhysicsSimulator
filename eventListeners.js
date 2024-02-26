import { engine } from './physicsInit.js';
import { createBody } from './materialManager.js';
import Matter from 'https://cdn.skypack.dev/matter-js';

let currentMaterial = 'sand'; // Default material
let isMouseDown = false;
let mousePosition = { x: 0, y: 0 };

export const setupEventListeners = () => {
    document.addEventListener('mousedown', (event) => {
        // Check if the click was on the canvas
        if (event.target.id === 'physicsCanvas') {
            isMouseDown = true;
            const canvasBounds = event.target.getBoundingClientRect();
            mousePosition = {
                x: event.clientX - canvasBounds.left,
                y: event.clientY - canvasBounds.top
            };
            createBodyAtMouse();
        }
    });

    document.addEventListener('mousemove', (event) => {
        if (event.target.id === 'physicsCanvas' && isMouseDown) {
            const canvasBounds = event.target.getBoundingClientRect();
            mousePosition = {
                x: event.clientX - canvasBounds.left,
                y: event.clientY - canvasBounds.top
            };
            createBodyAtMouse();
        }
    });

    document.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case '1':
                currentMaterial = 'sand';
                break;
            case '2':
                currentMaterial = 'water';
                break;
            // Add cases for other materials or actions
        }
    });

    // Collision event listener setup
    Matter.Events.on(engine, 'collisionStart', (event) => {
        event.pairs.forEach(pair => {
            // Custom logic to handle collisions based on materials
            // Implement collision handling logic here
        });
    });
};

const createBodyAtMouse = () => {
    // Assuming createBody function exists and can create bodies based on currentMaterial
    // This function needs to properly implement body creation
    createBody(mousePosition.x, mousePosition.y, currentMaterial);
};
