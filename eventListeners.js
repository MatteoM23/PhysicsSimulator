import Matter from 'https://cdn.skypack.dev/matter-js';
import { engine } from './physicsInit.js';
import { materials } from './materialManager.js';
import { currentMaterial } from './dropdown.js'; // Ensure this imports the currentMaterial as a variable

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

export function createBodyAtMouse(event) {
    const { clientX, clientY } = event;
    const radius = 20; // Adjust as needed
    const materialName = currentMaterial; // Assuming currentMaterial is a string that matches a key in materials
    const materialProperties = materials[materialName];

    if (!materialProperties) {
        console.error(`Material '${materialName}' is not defined in materials.`);
        return;
    }

    const bodyOptions = {
        density: materialProperties.density,
        friction: materialProperties.friction,
        restitution: materialProperties.restitution,
        render: { fillStyle: materialProperties.color }
    };

    const body = Matter.Bodies.circle(clientX, clientY, radius, bodyOptions);
    body.materialName = materialName; // Assigning the material name to the body for later reference
    Matter.World.add(engine.world, body);
}

// Call setupEventListeners to activate the event listeners
setupEventListeners();
