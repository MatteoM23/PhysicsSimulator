import Matter from 'https://cdn.skypack.dev/matter-js';
import { initPhysics, engine } from './physicsInit.js';
import { setupEventListeners } from './eventListeners.js';
import { setupFeatureButtons } from './featureButtons.js';
import { interactionRules, handleCollisions } from './interactions.js'; // Assuming interaction rules are encapsulated here
import { screenToWorld, invertColor, padZero } from './utils.js';
import { materials, createBody, handleTeleportationCollision } from './materialManager.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the physics engine
    initPhysics();

    // Set up event listeners for user interactions
    setupEventListeners();

    // Initialize UI elements like feature buttons
    setupFeatureButtons();

    // Register global collision event listener for handling custom interactions
    Matter.Events.on(engine, 'collisionStart', function(event) {
        event.pairs.forEach(function(pair) {
            const { bodyA, bodyB } = pair;
            // Execute interaction rules based on the materials of the colliding bodies
            interactionRules(bodyA, bodyB, engine);
        });
    });

    // Additional initialization code can be added as needed
});
