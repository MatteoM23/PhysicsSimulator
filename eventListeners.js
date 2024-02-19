import { engine, world, render } from './physicsInit.js';
import { createBody } from './materialManager.js';
import Matter from 'https://cdn.skypack.dev/matter-js';

let currentMaterial = 'sand'; // Default material
let isMouseDown = false;
let mousePosition = { x: 0, y: 0 };

export const setupEventListeners = () => {
    // Mouse down to start creating bodies or initiate other actions
    document.addEventListener('mousedown', (event) => {
        isMouseDown = true;
        mousePosition = { x: event.clientX, y: event.clientY };
        createBodyAtMouse(); // Create body at mouse down for immediate feedback
    });

    // Mouse move to update position or draw with materials
    document.addEventListener('mousemove', (event) => {
        mousePosition = { x: event.clientX, y: event.clientY };
        if (isMouseDown) {
            // Example: create bodies continuously while mouse is pressed
            createBodyAtMouse();
        }
    });

    // Mouse up to stop creating bodies
    document.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    // Example: Key press events to change materials or trigger other features
    document.addEventListener('keydown', (event) => {
        // Switch case or if-else to handle different key codes
        // E.g., change currentMaterial based on pressed key
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

    // Add additional custom event listeners as needed for your application

    // Collision event listener setup, if using teleportation or other collision-based features
    Matter.Events.on(engine, 'collisionStart', (event) => {
        event.pairs.forEach(pair => {
            // Example teleportation collision logic, or handle as needed
            // handleTeleportationCollision(pair);
        });
    });
};

const createBodyAtMouse = () => {
    // Convert mouse screen position to world position and create a body with the current material
    const { x, y } = mousePosition; // Assuming you have a function to convert these to world coordinates if necessary
    createBody(x, y, currentMaterial);
};
