import { engine } from './physicsInit.js';
import { createBody } from './materialManager.js';
import Matter from 'https://cdn.skypack.dev/matter-js';

let isMouseDown = false;
let mousePosition = { x: 0, y: 0 };

export const setupEventListeners = () => {
    document.addEventListener('mousedown', (event) => {
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
        // Example of handling material change with keyboard
        switch (event.key) {
            case '1':
                console.log('Material set to sand'); // Placeholder action
                break;
            case '2':
                console.log('Material set to water'); // Placeholder action
                break;
            // Extend this switch to change materials as required
        }
    });

    Matter.Events.on(engine, 'collisionStart', (event) => {
        event.pairs.forEach(pair => {
            console.log(`Collision detected between: ${pair.bodyA.label} and ${pair.bodyB.label}`);
            // Placeholder for collision handling logic
        });
    });
};

const createBodyAtMouse = () => {
    console.log('Attempting to create body at:', mousePosition.x, mousePosition.y, 'with material:', 'currentMaterial');
    if (mousePosition && typeof mousePosition.x === 'number' && typeof mousePosition.y === 'number') {
        createBody(mousePosition.x + window.scrollX, mousePosition.y + window.scrollY, 'currentMaterial'); // Assuming 'currentMaterial' is handled correctly
    } else {
        console.error('Mouse position is not defined or incorrect.');
    }
};


setupEventListeners(); // Activates the event listeners when the script is loaded
