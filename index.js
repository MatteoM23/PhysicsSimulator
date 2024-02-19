// index.js
import { initPhysics } from './physicsInit.js';
import { setupEventListeners } from './eventListeners.js';
import { materials, createBody, handleTeleportationCollision } from './materialManager.js';
import { setupFeatureButtons } from './featureButtons.js';
import { invertColor, padZero } from './utilities.js';

document.addEventListener('DOMContentLoaded', () => {
    initPhysics();
    setupEventListeners();
    // Additional initialization code can be added here
});
