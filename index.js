// Ensure you've imported necessary functions from other scripts
import { initPhysics, addParticle, createGravityInversionField, createTimeDilationField } from './physics.js';

// Current selected material
let currentMaterial = 'sand';

function setupUI() {
    const selector = document.getElementById('materialSelector');
    const materials = ['sand', 'water', 'oil', 'rock', 'lava'];

    materials.forEach(material => {
        let button = document.createElement('button');
        button.textContent = material;
        button.addEventListener('click', () => setCurrentMaterial(material));
        selector.appendChild(button);
    });
}


function draw() {
    background(51); // Set the background color of the canvas
}

function mousePressed() {
    // Check if the mouse press is within the canvas and not on the UI
    if (mouseY < height - 100) { // Adjust based on your UI's actual positioning
        // Add a particle at the mouse position with the current selected material
        addParticle(mouseX, mouseY, currentMaterial);
    }
}

function setupUI() {
    const materialSelector = document.getElementById('materialSelector');
    const materials = ['sand', 'water', 'oil', 'rock', 'lava']; // Available materials

    materials.forEach(material => {
        let button = document.createElement('button');
        button.innerText = material;
        button.onclick = () => setCurrentMaterial(material);
        materialSelector.appendChild(button);
    });

    // Setup feature buttons
    document.getElementById('gravityInversionBtn').onclick = () => {
        createGravityInversionField(windowWidth / 2, windowHeight / 2, 200, 0.5);
    };

    document.getElementById('timeDilationBtn').onclick = () => {
        createTimeDilationField(windowWidth / 2, windowHeight / 2, 150, 0.1);
    };
}

function setCurrentMaterial(material) {
    currentMaterial = material;
    console.log(`Current material set to: ${currentMaterial}`);
}

// This script tag should include type="module" when referenced in your HTML to support ES6 module syntax
