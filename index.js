import Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/mode=imports/optimized/matter-js.js';
import { initPhysics, addWalls, addParticle } from './physics.js'; // Assumed exports from physics.js
import { screenToWorld, normalizeVector } from './utils.js'; // Assumed exports from utils.js
import { handleInteractions } from './interactions.js'; // Assumed export from interactions.js

// Initialize the physics environment
const { engine, world, render } = initPhysics({
    width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
});

// Add boundaries to the world
addWalls(world, render);

// Material definitions
const materials = {
    sand: { label: 'Sand', color: '#f4e04d', density: 0.002, size: 5 },
    water: { label: 'Water', color: '#3498db', density: 0.0001, size: 6, friction: 0, restitution: 0.1 },
    oil: { label: 'Oil', color: '#34495e', density: 0.0012, size: 6, friction: 0.05, restitution: 0.05, flammable: true },
    rock: { label: 'Rock', color: '#7f8c8d', density: 0.004, size: 8, friction: 0.6, restitution: 0.1 },
    lava: { label: 'Lava', color: '#e74c3c', density: 0.003, size: 7, friction: 0.2, restitution: 0.4, temperature: 1200 },
    antimatter: { label: 'Antimatter', color: '#8e44ad', density: 0.001, size: 10, friction: 0.0, restitution: 1.0, isAntimatter: true },
};

let currentMaterial = 'sand';

// UI Setup for Material Selection
setupMaterialSelector(materials);

// Feature Buttons Setup for Gravity Inversion and Time Dilation
setupFeatureButtons(engine);

// Handling continuous particle creation on mouse interaction
handleMouseEvents(render, materials);

// Integrate handling interactions between materials
handleInteractions(engine, world);

// Start the engine and renderer
Matter.Engine.run(engine);
Matter.Render.run(render);

function setupMaterialSelector(materials) {
    const materialSelector = document.createElement('div');
    materialSelector.style.position = 'fixed';
    materialSelector.style.bottom = '20px';
    materialSelector.style.left = '50%';
    materialSelector.style.transform = 'translateX(-50%)';
    materialSelector.style.display = 'flex';
    materialSelector.style.zIndex = '1000';
    document.body.appendChild(materialSelector);

    Object.entries(materials).forEach(([materialKey, material]) => {
        const button = document.createElement('button');
        button.innerText = material.label;
        button.style.margin = '0 5px';
        button.onclick = () => {
            currentMaterial = materialKey;
        };
        materialSelector.appendChild(button);
    });
}


function setupFeatureButtons(engine) {
    const featureButtons = document.createElement('div');
    featureButtons.style.position = 'fixed';
    featureButtons.style.bottom = '60px';
    featureButtons.style.left = '50%';
    featureButtons.style.transform = 'translateX(-50%)';
    featureButtons.style.display = 'flex';
    featureButtons.style.zIndex = '1000';
    document.body.appendChild(featureButtons);

    // Gravity Inversion Button
    const gravityBtn = document.createElement('button');
    gravityBtn.innerText = 'Invert Gravity';
    gravityBtn.style.margin = '0 5px';
    gravityBtn.onclick = () => {
        engine.world.gravity.y *= -1;
    };
    featureButtons.appendChild(gravityBtn);

    // Time Dilation Button
    const timeBtn = document.createElement('button');
    timeBtn.innerText = 'Toggle Time Dilation';
    timeBtn.style.margin = '0 5px';
    timeBtn.onclick = () => {
        engine.timing.timeScale = engine.timing.timeScale === 1 ? 0.5 : 1;
    };
    featureButtons.appendChild(timeBtn);
}


function handleMouseEvents(render, materials) {
    let isMouseDown = false;

    document.addEventListener('mousedown', event => {
        if (event.target === render.canvas) {
            isMouseDown = true;
            createParticle(event, materials);
        }
    });

    document.addEventListener('mousemove', event => {
        if (isMouseDown && event.target === render.canvas) {
            createParticle(event, materials);
        }
    });

    document.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    function createParticle(event, materials) {
        const bounds = render.canvas.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        const material = materials[currentMaterial];
        
        // Assuming addParticle is defined in your physics.js to accept these parameters
        addParticle(x, y, material);
    }
}

