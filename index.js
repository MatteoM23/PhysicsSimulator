// Import necessary functions from your physics module
import { initPhysics, addParticle } from './physics.js';

let currentMaterial = 'sand'; // Default material

document.addEventListener('DOMContentLoaded', () => {
    new p5((sketch) => {
        sketch.setup = () => {
            sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
            initPhysics(); // Initialize the physics engine
            setupUI();
        };

        sketch.draw = () => {
            sketch.background(51); // A simple background to visualize particles
        };

        sketch.mousePressed = () => {
            // Only add particles if the click is within bounds to avoid UI overlap
            if (sketch.mouseY < sketch.height - 100) {
                addParticle(sketch.mouseX, sketch.mouseY, currentMaterial);
            }
        };
    });
});

function setupUI() {
    const materialSelector = document.getElementById('materialSelector');
    materialSelector.innerHTML = ''; // Clear previous UI to prevent duplication
    const materials = ['sand', 'water', 'oil', 'rock', 'lava'];

    materials.forEach(material => {
        const button = document.createElement('button');
        button.innerText = material;
        button.onclick = () => setCurrentMaterial(material);
        materialSelector.appendChild(button);
    });
}

function setCurrentMaterial(material) {
    currentMaterial = material;
    console.log(`Material set to: ${currentMaterial}`); // Helpful for debugging
}
