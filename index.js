import Matter from 'https://cdn.skypack.dev/matter-js';
import { initPhysics, engine, render } from './physicsInit.js';
import { setupEventListeners } from './eventListeners.js';
import { initFeatureButtons } from './featureButton.js';
import { initDropdown, currentMaterial } from './dropdown.js';
import { materials, createBody } from './materialManager.js';
import { interactionRules, handleCollisions } from './interactions.js';
import { screenToWorld, invertColor, padZero } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the physics engine and the renderer
    initPhysics();

    // Setup UI interactions and feature buttons
    initDropdown(); // Initializes the dropdown for material selection
    initFeatureButtons(); // Initializes feature buttons for user interactions

    // Setup event listeners for user actions and physics events
    setupEventListeners();

    // Register global collision event listener for handling custom material interactions
    Matter.Events.on(engine, 'collisionStart', (event) => {
        event.pairs.forEach((pair) => {
            // Execute interaction rules based on the materials of the colliding bodies
            handleCollisions(event, engine);
        });
    });

    // Log to indicate successful initialization
    console.log("Physics simulation initialized and ready for interaction.");
});
