import { initPhysics, addParticle, update } from './physics.js';

let currentMaterial = 'sand';

new p5((sketch) => {
    sketch.setup = () => {
        sketch.createCanvas(window.innerWidth, window.innerHeight);
        initPhysics();
        setupUI();
    };

    sketch.draw = () => {
        sketch.background(51);
        handleContinuousParticleCreation(sketch);
        update();
    };
});

function handleContinuousParticleCreation(sketch) {
    if (sketch.mouseIsPressed && sketch.mouseY < sketch.height - 100) {
        addParticle(sketch.mouseX, sketch.mouseY, currentMaterial);
    }
}

function setupUI() {
    const materialSelector = document.getElementById('materialSelector');
    materialSelector.innerHTML = '';

    Object.keys(materialProperties).forEach(material => {
        let button = document.createElement('button');
        button.innerText = material;
        button.addEventListener('click', () => setCurrentMaterial(material));
        materialSelector.appendChild(button);
    });
}

function setCurrentMaterial(material) {
    currentMaterial = material;
}
