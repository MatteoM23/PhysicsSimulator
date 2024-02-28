import Matter from 'https://cdn.skypack.dev/matter-js';
import { engine } from './physicsInit.js';
import { materials } from './materialManager.js';
import { currentMaterial } from './dropdown.js'; // Assuming currentMaterial is correctly exported as a variable

let isMouseDown = false;

export const setupEventListeners = () => {
    document.addEventListener('mousedown', (event) => {
        isMouseDown = true;
        createBodyAtMouse(event);
    });

    document.addEventListener('mousemove', (event) => {
        if (isMouseDown) {
            createBodyAtMouse(event);
        }
    });

    document.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    document.addEventListener('mouseleave', () => {
        isMouseDown = false;
    });
};

function createBodyAtMouse(event) {
    const { clientX, clientY } = event;
    const radius = 20; // Adjust as needed
    const materialName = currentMaterial; // Use currentMaterial directly if it's a variable
    const materialProperties = materials[materialName];

    const bodyOptions = {
        density: materialProperties.density,
        friction: materialProperties.friction,
        restitution: materialProperties.restitution,
        render: { fillStyle: materialProperties.color }
    };

    const body = Matter.Bodies.circle(clientX, clientY, radius, bodyOptions);
    Matter.World.add(engine.world, body);
}

setupEventListeners();
