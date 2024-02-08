// index.js
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
            if (sketch.mouseY < sketch.height - 100) { // Adjust based on your UI's actual positioning
                addParticle(sketch.mouseX, sketch.mouseY, currentMaterial);
            }
        };
    });
});

function setupUI() {
    const materials = ['sand', 'water', 'oil', 'rock', 'lava']; // Define available materials
    const materialSelector = document.getElementById('materialSelector');
    materials.forEach(material => {
        const button = document.createElement('button');
        button.innerText = material;
        button.addEventListener('click', () => setCurrentMaterial(material));
        materialSelector.appendChild(button);
    });

    // Adding a spacer div between material and feature buttons
    const spacer = document.createElement('div');
    spacer.style.flex = '1';
    materialSelector.parentNode.insertBefore(spacer, materialSelector.nextSibling);

    // Feature buttons setup already assumed to be in HTML
}

function setCurrentMaterial(material) {
    currentMaterial = material;
}
