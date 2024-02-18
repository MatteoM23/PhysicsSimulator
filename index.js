import Matter from 'https://cdn.skypack.dev/matter-js';
import { interactionRules, handleCollisions } from './interactions.js';
import { screenToWorld } from './utils.js';

let engine, render, world;

// Define materials globally to ensure they are accessible throughout the script
const materials = {
    // Existing materials
    sand: { label: 'Sand', color: '#f4e04d', density: 0.0025, size: 22.5, friction: 0.5, restitution: 0.3 },
    water: { label: 'Water', color: '#3498db', density: 0.001, size: 27, friction: 0.02, restitution: 0.9 },
    oil: { label: 'Oil', color: '#34495e', density: 0.0008, size: 27, friction: 0.05, restitution: 0.05 },
    rock: { label: 'Rock', color: '#7f8c8d', density: 0.005, size: 37.5, friction: 0.8, restitution: 0.2 },
    lava: { label: 'Lava', color: '#e74c3c', density: 0.004, size: 33, friction: 0.4, restitution: 0.6 },
    ice: { label: 'Ice', color: '#a8e0ff', density: 0.0008, size: 27, friction: 0.01, restitution: 0.95 },
    rubber: { label: 'Rubber', color: '#ff3b3b', density: 0.0012, size: 33, friction: 0.9, restitution: 0.8 },
    steel: { label: 'Steel', color: '#8d8d8d', density: 0.008, size: 45, friction: 0.6, restitution: 0.1 },
    glass: { label: 'Glass', color: '#c4faf8', density: 0.002, size: 22.5, friction: 0.4, restitution: 0.7 },
    wood: { label: 'Wood', color: '#deb887', density: 0.003, size: 37.5, friction: 0.6, restitution: 0.3 },
    antimatter: { label: 'Antimatter', color: '#ff4081', density: 0.001, size: 22.5, friction: 0.01, restitution: 0.99 },
    darkMatter: { label: 'Dark Matter', color: '#6200ea', density: 0.0005, size: 22.5, friction: 0.0, restitution: 1.0 },
    neutronium: { label: 'Neutronium', color: '#5c5c8a', density: 0.02, size: 30, friction: 0.5, restitution: 0.1 },
    quantumFoam: { label: 'Quantum Foam', color: '#ffec8b', density: 0.0001, size: 25, friction: 0.0, restitution: 0.98 },
    exoticMatter: { label: 'Exotic Matter', color: '#fa8072', density: -0.001, size: 22.5, friction: 0.01, restitution: 1.1 },
    plasmaCrystal: { label: 'Plasma Crystal', color: '#00ced1', density: 0.003, size: 20, friction: 0.2, restitution: 0.5 },
    voidEssence: { label: 'Void Essence', color: '#000080', density: 0.0005, size: 25, friction: 0.0, restitution: 1.0 },
    ether: { label: 'Ether', color: '#b19cd9', density: 0.0002, size: 30, friction: 0.01, restitution: 0.95 },
    solarFlare: { label: 'Solar Flare', color: '#ffae42', density: 0.001, size: 35, friction: 0.1, restitution: 0.8 },
    cosmicDust: { label: 'Cosmic Dust', color: '#6c7b8b', density: 0.002, size: 20, friction: 0.7, restitution: 0.3 },
    magneticField: { label: 'Magnetic Field', color: '#1e90ff', density: 0.0001, size: 40, friction: 0.0, restitution: 1.05 },
    photonGel: { label: 'Photon Gel', color: '#ffa07a', density: 0.0008, size: 25, friction: 0.05, restitution: 0.9 },
};

let currentMaterial = 'sand';

document.addEventListener('DOMContentLoaded', () => {
    initPhysics(); // Initializes Matter.js engine, render, and world

    setupMaterialSelector(materials);
    setupFeatureButtons();
});

function setupMaterialSelector(materials) {
    const materialsContainer = document.getElementById('materialsContainer') || createMaterialsContainer();
    
    Object.keys(materials).forEach(key => {
        const material = materials[key];
        const button = document.createElement('button');
        button.textContent = material.label;
        button.className = 'materialButton';
        button.style.backgroundColor = material.color;
        button.style.color = '#ffffff'; // Assuming white text for better readability
        button.onclick = () => selectMaterial(key);
        materialsContainer.appendChild(button);
    });
}

function createMaterialsContainer() {
    const uiContainer = document.getElementById('uiContainer');
    const container = document.createElement('div');
    container.id = 'materialsContainer';
    uiContainer.appendChild(container);
    return container;
}

function selectMaterial(key) {
    currentMaterial = key;
    // Update UI to reflect the current selection
    const buttons = document.querySelectorAll('.materialButton');
    buttons.forEach(button => {
        if (button.textContent === materials[key].label) {
            button.classList.add('selected'); // Add a class to highlight the selected button
        } else {
            button.classList.remove('selected'); // Remove the class from non-selected buttons
        }
    });
    console.log(`Material ${key} selected`);
}


function initPhysics() {
    engine = Matter.Engine.create();
    world = engine.world;
    
    render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'linear-gradient(135deg, #333333, #1b2838)'
        }
    });

    // Add bodies like ground, walls, etc., to the world
    // Example: const ground = Matter.Bodies.rectangle(0, 0, 0, 0, { isStatic: true });

    Matter.Runner.run(engine);
    Matter.Render.run(render);

    setupEventListeners();
}

function setupFeatureButtons() {
    const featuresContainer = document.querySelector('.feature-buttons') || createFeatureButtonsContainer();
    
    // Example feature: Clear World
    const clearButton = createFeatureButton('Clear World', () => {
        Matter.Composite.clear(world, true); // Clear all bodies, but keep static ones like ground
        console.log('World cleared');
    });

    // Example feature: Invert Gravity
    const invertGravityButton = createFeatureButton('Invert Gravity', () => {
        engine.world.gravity.y = engine.world.gravity.y * -1; // Invert gravity
        console.log('Gravity inverted');
    });

    featuresContainer.appendChild(clearButton);
    featuresContainer.appendChild(invertGravityButton);
}

function createFeatureButton(text, onClick) {
    const button = document.createElement('button');
    button.innerText = text;
    button.className = 'featureButton';
    button.addEventListener('click', onClick);
    return button;
}

function createFeatureButtonsContainer() {
    const container = document.createElement('div');
    container.className = 'feature-buttons';
    document.body.appendChild(container);
    return container;
}


function setupEventListeners() {
    document.body.addEventListener('mousedown', handleMouseDown);
    document.body.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mousemove', handleMouseMove);
}

function handleMouseDown(event) {
    if (!event.target.closest('.uiElement')) {
        isMouseDown = true;
        createMaterialBody(event);
    }
}

function handleMouseUp() {
    isMouseDown = false;
}

function handleMouseMove(event) {
    if (isMouseDown && !event.target.closest('.uiElement')) {
        createMaterialBody(event);
    }
}

function createMaterialBody(event) {
    const { x, y } = screenToWorld(event.clientX, event.clientY, render);
    // Assuming a function 'createBody' that takes material properties and adds a new body to the world
    createBody(x, y, currentMaterial);
}

function createBody(x, y, materialKey) {
    const material = materials[materialKey];
    const body = Matter.Bodies.circle(x, y, material.size / 2, {
        density: material.density,
        friction: material.friction,
        restitution: material.restitution,
        render: { fillStyle: material.color },
    });
    Matter.World.add(world, body);
}

