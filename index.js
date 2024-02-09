// Importing Matter.js from a CDN
import Matter from 'https://cdn.skypack.dev/matter-js';

// Importing local modules
import { initPhysics } from './physics.js';
import { handleInteractions, createNewBody } from './interactions.js';
import { screenToWorld } from './utils.js';

// Materials definition with properties
const materials = {
    sand: { label: 'Sand', color: '#f4e04d', density: 0.002, size: 5 },
    water: { label: 'Water', color: '#3498db', density: 0.0001, size: 6, friction: 0, restitution: 0.1 },
    oil: { label: 'Oil', color: '#34495e', density: 0.0012, size: 6, friction: 0.05, restitution: 0.05 },
    rock: { label: 'Rock', color: '#7f8c8d', density: 0.004, size: 8, friction: 0.6, restitution: 0.1 },
    lava: { label: 'Lava', color: '#e74c3c', density: 0.003, size: 7, friction: 0.2, restitution: 0.4 },
    ice: { label: 'Ice', color: '#a8e0ff', density: 0.0009, size: 6, friction: 0.1, restitution: 0.8 },
    rubber: { label: 'Rubber', color: '#ff3b3b', density: 0.001, size: 7, friction: 1.0, restitution: 0.9 },
    steel: { label: 'Steel', color: '#8d8d8d', density: 0.008, size: 10, friction: 0.4, restitution: 0 },
    glass: { label: 'Glass', color: '#c4faf8', density: 0.0025, size: 5, friction: 0.1, restitution: 0.5 },
    wood: { label: 'Wood', color: '#deb887', density: 0.003, size: 8, friction: 0.6, restitution: 0 }
};

let currentMaterial = 'sand';

// Main initialization function
document.addEventListener('DOMContentLoaded', () => {
    const { engine, render, world } = initPhysics();
    Matter.Render.run(render);

    handleInteractions(engine, world);

    // Setup event listeners for material selection and particle creation
    setupMaterialSelector(materials);
    setupParticleCreation(engine, world, render);

    // Setup additional feature buttons if needed
    setupFeatureButtons(engine, world);
});

function setupParticleCreation(engine, world, render) {
    document.body.addEventListener('mousedown', event => {
        createParticleAtMousePosition(event, render, world, engine);
    });

    document.body.addEventListener('mousemove', event => {
        if (event.buttons === 1) { // Check if left mouse button is pressed
            createParticleAtMousePosition(event, render, world, engine);
        }
    });
}

function createParticleAtMousePosition(event, render, world, engine) {
    const { x, y } = screenToWorld(event.clientX, event.clientY, render);
    createParticle(x, y, currentMaterial, world, engine);
}

function createParticle(x, y, materialKey, world, engine) {
    const material = materials[materialKey];
    const options = {
        restitution: material.restitution ?? 0.1, // Provide default values
        density: material.density,
        friction: material.friction ?? 0.5,
        render: {
            fillStyle: material.color, // Ensure visual properties are passed
        },
    };
    // Ensure radius is explicitly passed
    const particle = createNewBody({ x, y }, material.size, options);
    Matter.World.add(world, particle);
}


function setupMaterialSelector(materials) {
    const selector = document.createElement('div');
    selector.className = 'material-selector';
    document.body.appendChild(selector);

    Object.entries(materials).forEach(([key, material]) => {
        const button = document.createElement('button');
        button.innerText = material.label;
        button.style.backgroundColor = material.color;
        button.onclick = () => {
            currentMaterial = key;
            document.querySelectorAll('.material-selector button').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        };
        selector.appendChild(button);
    });
}

function setupFeatureButtons(engine, world) {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'feature-buttons';
    document.body.appendChild(buttonsContainer);

    const gravityButton = document.createElement('button');
    gravityButton.innerText = 'Invert Gravity';
    gravityButton.onclick = () => {
        engine.world.gravity.y = -engine.world.gravity.y;
    };
    buttonsContainer.appendChild(gravityButton);

    // Additional feature buttons can be added here
}
