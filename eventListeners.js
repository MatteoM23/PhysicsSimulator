import Matter from 'https://cdn.skypack.dev/matter-js'; // Import Matter.js
import { engine } from './physicsInit.js'; // Ensure engine is correctly imported
import { materials } from './materialManager.js'; // Import materials definition
import { currentMaterial } from './dropdown.js'; // Import currentMaterial selection mechanism

// Track mouse state
let isMouseDown = false;

// Setup event listeners for mouse interactions
export const setupEventListeners = () => {
    document.addEventListener('mousedown', (event) => {
        isMouseDown = true; // Set mouse state to down
        createBodyAtMouse(event);
    });

    document.addEventListener('mousemove', (event) => {
        if (isMouseDown) { // Check if the mouse is down
            createBodyAtMouse(event);
        }
    });

    document.addEventListener('mouseup', () => {
        isMouseDown = false; // Reset mouse state when released
    });

    // Additional logic to prevent body creation when the mouse is outside the browser window
    document.addEventListener('mouseleave', () => {
        isMouseDown = false;
    });
};

// Create a body at the mouse position with the currently selected material
export function createBodyAtMouse(event) {
    const { clientX, clientY } = event; // Destructure clientX and clientY from the event
    const radius = 20; // Example: fixed value or dynamically determined based on the use case
    const materialName = currentMaterial(); // Assuming currentMaterial is a function that returns the current material name
    const materialProperties = materials[materialName]; // Retrieve material properties from the materials object

    const options = {
        density: materialProperties.density,
        friction: materialProperties.friction,
        restitution: materialProperties.restitution,
        render: {
            fillStyle: materialProperties.color
        }
    };

    // Ensure the mouse position is converted to the Matter.js world coordinates if needed
    let body = Matter.Bodies.circle(clientX, clientY, radius, options);
    body.material = materialName; // Assign material name for interaction handling
    Matter.World.add(engine.world, body);
}

// Initial setup call to activate event listeners
setupEventListeners();
