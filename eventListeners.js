// Assuming physicsInit.js exports 'engine' and 'world', and these are correctly set up
import { engine, world } from './physicsInit.js';
// Assuming materials is an exported object from materialManager.js that contains material properties
import { materials } from './materialManager.js';

let currentMaterial = 'sand'; // Default material
let isMouseDown = false;
let mousePosition = { x: 0, y: 0 };

export const setupEventListeners = () => {
    document.addEventListener('mousedown', (event) => {
        isMouseDown = true;
        mousePosition = { x: event.clientX, y: event.clientY };
        createBodyAtMouse();
    });

    document.addEventListener('mousemove', (event) => {
        mousePosition = { x: event.clientX, y: event.clientY };
        if (isMouseDown) {
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
            // Add more cases as needed
        }
    });

    Matter.Events.on(engine, 'collisionStart', (event) => {
        event.pairs.forEach(pair => {
            // Handle collisions if necessary
        });
    });
};

const createBodyAtMouse = () => {
    const { x, y } = mousePosition; // Convert these to world coordinates if necessary
    createBody(x, y, currentMaterial);
};

export const createBody = (x, y, materialName) => {
    const material = materials[materialName];
    if (!material) {
        console.error(`Material '${materialName}' not found.`);
        return;
    }

    const body = Matter.Bodies.circle(x, y, material.radius || 10, {
        density: material.density,
        friction: material.friction,
        restitution: material.restitution,
        render: {
            fillStyle: material.color,
        },
    });

    Matter.World.add(world, body);
};
