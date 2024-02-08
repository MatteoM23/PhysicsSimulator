// Assuming you have Matter.js and p5.js correctly included in your project
import { initPhysics, addParticle } from './physics.js';

let currentMaterial = 'sand'; // Default material

document.addEventListener('DOMContentLoaded', () => {
    new p5((sketch) => {
        // Setup the sketch
        sketch.setup = () => {
            sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
            initPhysics(); // Initialize the physics engine
            setupUI(); // Setup the UI for material selection
        };

        sketch.draw = () => {
            sketch.background(51); // Set a dark background
        };

        // Add a particle at the mouse position upon click, if not on the UI
        sketch.mousePressed = () => {
            // Ensure the click is not on the UI by checking mouseY position
            if (sketch.mouseY < sketch.height - 100) {
                addParticle(sketch.mouseX, sketch.mouseY, currentMaterial);
            }
        };
    });
});

function setupUI() {
    const materialSelector = document.getElementById('materialSelector');
    if (!materialSelector) {
        console.error('Material selector element not found.');
        return;
    }
    materialSelector.innerHTML = ''; // Clear existing buttons to avoid duplicates

    // Define available materials
    const materials = ['sand', 'water', 'oil', 'rock', 'lava'];

    // Create and append a button for each material
    materials.forEach(material => {
        const button = document.createElement('button');
        button.innerText = material;
        button.addEventListener('click', function() {
            setCurrentMaterial(material);
        });
        materialSelector.appendChild(button);
    });
}

// Function to set the current material based on user selection
function setCurrentMaterial(material) {
    currentMaterial = material;
    console.log(`Current material set to: ${currentMaterial}`); // Helpful for debugging
}
