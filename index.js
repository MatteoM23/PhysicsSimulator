import Matter from 'https://cdn.skypack.dev/matter-js';
import { initPhysics, engine } from './physicsInit.js';
import { setupEventListeners } from './eventListeners.js';
import { setupFeatureButtons } from './featureButtons.js';
import { interactionRules, handleCollisions } from './interactions.js'; // Assuming interaction rules are encapsulated here
import { screenToWorld, invertColor, padZero } from './utils.js';
import { materials, createBody, handleTeleportationCollision } from './materialManager.js';

// Assuming you have a function `initDropdown` that wasn't explicitly imported.
// This function should be defined in another module (e.g., 'dropdown.js') to handle dropdown UI interactions.
// import { initDropdown } from './dropdown.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the physics engine and rendering
    initPhysics();

    // Setup UI interactions for dropdowns and feature buttons
    // initDropdown(); // Uncomment if you have this function defined
    setupFeatureButtons();
    
    // Setup event listeners for user interactions
    setupEventListeners();

    // Register global collision event listener for handling custom interactions
    Matter.Events.on(engine, 'collisionStart', (event) => {
        event.pairs.forEach((pair) => {
            const { bodyA, bodyB } = pair;
            // Execute interaction rules based on the materials of the colliding bodies
            interactionRules(bodyA, bodyB, engine);
        });
    });

    // Additional initialization code can be added as needed
    console.log("Physics simulation initialized and ready.");
});
