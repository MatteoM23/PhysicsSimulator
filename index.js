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
const materialProperties = {
    sand: { density: 0.002, friction: 0.5, color: '#f4e04d' },
    water: { density: 0.001, friction: 0.0, color: '#3498db', isLiquid: true },
    oil: { density: 0.0012, friction: 0.01, color: '#34495e', isLiquid: true },
    rock: { density: 0.004, friction: 0.6, color: '#7f8c8d' },
    lava: { density: 0.003, friction: 0.2, color: '#e74c3c', isLiquid: true, temperature: 1200 },
    ice: { density: 0.0009, friction: 0.1, color: '#a8e0ff', restitution: 0.8 },
    rubber: { density: 0.001, friction: 1.0, color: '#ff3b3b', restitution: 0.9 },
    steel: { density: 0.008, friction: 0.4, color: '#8d8d8d' },
    glass: { density: 0.0025, friction: 0.1, color: '#c4faf8', restitution: 0.5 },
    wood: { density: 0.003, friction: 0.6, color: '#deb887' },
    antimatter: { density: 0.0, friction: 0.0, color: '#8e44ad', restitution: 1.0, isAntimatter: true }
};


let currentMaterial = 'sand';

// UI Setup for Material Selection
setupMaterialSelector(materialProperties);

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

