import { initPhysics, addParticle, update } from './physics.js';

// Assuming materialProperties is defined in 'materials.js' and needs to be imported
import { materialProperties } from './materials.js';

let currentMaterial = 'sand';

new p5((sketch) => {
    sketch.setup = () => {
        sketch.createCanvas(window.innerWidth, window.innerHeight);
        initPhysics();
        setupUI();
    };

    sketch.draw = () => {
        sketch.background(51);
        if (sketch.mouseIsPressed && sketch.mouseY < sketch.height - 100) { // Checks if the mouse is pressed and not over the UI
            addParticle(sketch.mouseX, sketch.mouseY, currentMaterial);
        }
        update(); // Ensures the physics world is updated each frame
    };
});

function setupUI() {
    const materialSelector = document.getElementById('materialSelector');
    if (!materialSelector) {
        console.error('Material selector container not found!');
        return;
    }
    materialSelector.innerHTML = ''; // Clear any existing content

    Object.keys(materialProperties).forEach(material => {
        let button = document.createElement('button');
        button.innerText = material;
        button.onclick = () => setCurrentMaterial(material);
        materialSelector.appendChild(button);
    });
}

function setCurrentMaterial(material) {
    currentMaterial = material;
    console.log(`Current material set to: ${currentMaterial}`); // Helpful for debugging
}
