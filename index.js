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
            sketch.background(51);
        };

        sketch.mousePressed = () => {
            // Ensure clicks within the canvas but not on the UI trigger material placement
            if (sketch.mouseY < sketch.height - 100) { // Adjust based on your UI's actual positioning
                addParticle(sketch.mouseX, sketch.mouseY, currentMaterial);
            }
        };
    });
});

function setupUI() {
    // Ensure the materialSelector div is cleared before adding buttons to avoid duplication
    const materialSelector = document.getElementById('materialSelector');
    materialSelector.innerHTML = ''; // Clear existing content

    const materials = ['sand', 'water', 'oil', 'rock', 'lava']; // Define available materials
    materials.forEach(material => {
        const button = document.createElement('button');
        button.innerText = material;
        button.addEventListener('click', () => setCurrentMaterial(material));
        materialSelector.appendChild(button);
    });

    // Check if the spacer already exists to avoid duplicating it
    let spacer = document.querySelector('#materialSelector + .spacer');
    if (!spacer) {
        spacer = document.createElement('div');
        spacer.className = 'spacer'; // Use a class to identify the spacer
        spacer.style.flex = '1';
        materialSelector.parentNode.insertBefore(spacer, materialSelector.nextSibling);
    }

    // Assuming feature buttons setup is correctly managed elsewhere or already in HTML
}

function setCurrentMaterial(material) {
    currentMaterial = material;
    console.log(`Current material set to: ${currentMaterial}`); // Debugging: Check material change
}
