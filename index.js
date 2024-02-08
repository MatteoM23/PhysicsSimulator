// Assuming this script is correctly marked with type="module" in your HTML
// and that you have a proper setup for importing functions from other scripts

import { initPhysics, addParticle, createGravityInversionField, createTimeDilationField } from './physics.js';

let currentMaterial = 'sand'; // Default material

document.addEventListener('DOMContentLoaded', () => {
    setup();
});

function setup() {
    // Assuming p5.js is globally available and used for creating canvas and drawing
    createCanvas(windowWidth, windowHeight);
    initPhysics(); // Initialize the physics engine from physics.js
    setupUI(); // Setup the UI for material selection and feature activation
}

function draw() {
    // p5.js draw loop
    background(51); // Set the background color of the canvas
}

function mousePressed() {
    // Ensure clicks within the canvas area trigger particle creation
    if (mouseY < height - 50 && mouseX < width && mouseX > 0 && mouseY > 0) {
        addParticle(mouseX, mouseY, currentMaterial);
    }
}

function setupUI() {
    const materialSelector = document.getElementById('materialSelector');
    if (!materialSelector) {
        console.error('Material selector div not found');
        return;
    }

    const materials = ['sand', 'water', 'oil', 'rock', 'lava']; // Define available materials
    materials.forEach(material => {
        let button = document.createElement('button');
        button.innerText = material;
        button.addEventListener('click', () => setCurrentMaterial(material));
        materialSelector.appendChild(button);
    });

    // Assuming buttons for gravity inversion and time dilation already exist in your HTML
    document.getElementById('gravityInversionBtn').addEventListener('click', () => createGravityInversionField(windowWidth / 2, windowHeight / 2, 200, 1.5));
    document.getElementById('timeDilationBtn').addEventListener('click', () => createTimeDilationField(windowWidth / 2, windowHeight / 2, 150, 0.5));
}

function setCurrentMaterial(material) {
    currentMaterial = material;
    console.log(`Current material set to: ${currentMaterial}`); // For debugging
}
