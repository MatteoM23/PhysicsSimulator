import { engine } from './physicsInit.js';
import { createBody } from './materialManager.js';
import { currentMaterial } from './dropdown.js'; // Ensure this is correctly imported and used
import Matter from 'https://cdn.skypack.dev/matter-js';

let isMouseDown = false;
let mousePosition = { x: 0, y: 0 };

export const setupEventListeners = () => {
    document.addEventListener('mousedown', (event) => {
        if (event.target.id === 'physicsCanvas') {
            isMouseDown = true;
            mousePosition = {
                x: event.clientX,
                y: event.clientY
            };
            createBody(mousePosition.x, mousePosition.y, currentMaterial);
        }
    });

    document.addEventListener('mousemove', (event) => {
        if (isMouseDown) {
            mousePosition = {
                x: event.clientX,
                y: event.clientY
            };
            createBody(mousePosition.x, mousePosition.y, currentMaterial);
        }
    });

    document.addEventListener('mouseup', () => {
        isMouseDown = false;
    });
};

setupEventListeners();
