import { engine } from './physicsInit.js';
import { createBody } from './materialManager.js';
import Matter from 'https://cdn.skypack.dev/matter-js';

let currentMaterial = 'sand'; // Default material
let isMouseDown = false;
let mousePosition = { x: 0, y: 0 };

export const setupEventListeners = () => {
    document.addEventListener('mousedown', (event) => {
        console.log('Mousedown event detected');
        if (event.target.id === 'physicsCanvas') {
            console.log('Mousedown on canvas');
            isMouseDown = true;
            const canvasBounds = event.target.getBoundingClientRect();
            mousePosition = {
                x: event.clientX - canvasBounds.left,
                y: event.clientY - canvasBounds.top
            };
            console.log(`Mouse position set to: ${mousePosition.x}, ${mousePosition.y}`);
            createBodyAtMouse();
        }
    });

    document.addEventListener('mousemove', (event) => {
        console.log('Mousemove event detected');
        if (event.target.id === 'physicsCanvas' && isMouseDown) {
            console.log('Mousemove on canvas with mousedown');
            const canvasBounds = event.target.getBoundingClientRect();
            mousePosition = {
                x: event.clientX - canvasBounds.left,
                y: event.clientY - canvasBounds.top
            };
            console.log(`Updated mouse position to: ${mousePosition.x}, ${mousePosition.y}`);
            createBodyAtMouse();
        }
    });

    document.addEventListener('mouseup', () => {
        console.log('Mouseup event detected, stopping body creation');
        isMouseDown = false;
    });

    document.addEventListener('keydown', (event) => {
        console.log(`Keydown event detected: ${event.key}`);
        switch (event.key) {
            case '1':
                currentMaterial = 'sand';
                console.log('Current material set to sand');
                break;
            case '2':
                currentMaterial = 'water';
                console.log('Current material set to water');
                break;
            // Add cases for other materials or actions
        }
    });

    // Collision event listener setup
    Matter.Events.on(engine, 'collisionStart', (event) => {
        console.log('Collision start event detected');
        event.pairs.forEach(pair => {
            // Custom logic to handle collisions based on materials
            console.log(`Collision detected between: ${pair.bodyA.label} and ${pair.bodyB.label}`);
            // Implement collision handling logic here
        });
    });
};

const createBodyAtMouse = () => {
    console.log(`Attempting to create body at: ${mousePosition.x}, ${mousePosition.y} with material: ${currentMaterial}`);
    createBody(mousePosition.x, mousePosition.y);
};
