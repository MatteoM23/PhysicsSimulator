// Import Matter.js library
import Matter from 'https://cdn.skypack.dev/matter-js';

// Import interaction functions from interactions.js
import { interactionRules, handleCollisions } from './interactions.js';

// Define global variables for the physics engine and renderer
let engine, render;

// Define the current selected material (default: sand)
let currentMaterial = 'sand';

// Define various materials with their properties
const materials = {
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
    photonGel: { label: 'Photon Gel', color: '#ffa07a', density: 0.0008, size: 25, friction: 0.05, restitution: 0.9 }
};

// Function to initialize the physics engine and renderer
function initPhysicsEngine() {
    // Create engine
    engine = Matter.Engine.create();

    // Create renderer
    render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'linear-gradient(135deg, #333333, #1b2838)'
        },
    });

    // Add ground and walls
    addStaticBodies();

    // Run engine and renderer
    Matter.Engine.run(engine);
    Matter.Render.run(render);

    // Handle window resizing
    window.addEventListener('resize', handleResize);
}

// Function to set up the material dropdown menu
function setupMaterialDropdown() {
    const dropdown = document.getElementById('materialDropdown');
    const toggleButton = document.getElementById('toggleMaterials');

    toggleButton.addEventListener('click', () => dropdown.classList.toggle('show'));

    // Loop through materials and create dropdown options
    Object.entries(materials).forEach(([key, { label }]) => {
        const option = document.createElement('a');
        option.textContent = label;
        option.href = 'javascript:void(0);';
        option.addEventListener('click', () => {
            currentMaterial = key;
            console.log(`${label} selected`);
            dropdown.classList.remove('show');
        });
        dropdown.appendChild(option);
    });
}

// Function to add static bodies (ground and walls) to the world
function addStaticBodies() {
    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 20, { isStatic: true });
    const walls = [
        Matter.Bodies.rectangle(0, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true }),
        Matter.Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true })
    ];
    Matter.World.add(engine.world, [ground, ...walls]);
}

// Function to handle window resizing
function handleResize() {
    Matter.Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: window.innerWidth, y: window.innerHeight }
    });
}

// Function to set up feature buttons
function setupFeatureButtons() {
    const featuresDiv = document.getElementById('featureButtons');
    // Define buttons and their actions
    const buttons = [
        { title: 'Invert Gravity', action: () => engine.world.gravity.y *= -1 },
        { title: 'Clear World', action: () => clearWorld() },
        // Add additional feature buttons here
    ];

    // Create buttons and attach actions
    buttons.forEach(({ title, action }) => {
        const button = document.createElement('button');
        button.innerText = title;
        button.addEventListener('click', action);
        featuresDiv.appendChild(button);
    });
}

// Function to clear the world of all bodies
function clearWorld() {
    Matter.Composite.allBodies(engine.world).forEach(body => {
        if (!body.isStatic) {
            Matter.World.remove(engine.world, body);
        }
    });
}

// Function to create a material body at a specific position
document.addEventListener('mousedown', (event) => {
    const { x, y } = screenToWorld(event.clientX, event.clientY);
    createMaterialBody(x, y, currentMaterial);
});

// Function to convert screen coordinates to world coordinates
function screenToWorld(clientX, clientY) {
    // Simplified conversion for demonstration
    return { x: clientX, y: clientY };
}

// Function to create a material body at a given position with the current material
function createMaterialBody(x, y, materialKey) {
    const { color, density, size, friction, restitution } = materials[materialKey];
    const body = Matter.Bodies.circle(x, y, size / 2, {
        density,
        friction,
        restitution,
        render: { fillStyle: color }
    });
    Matter.World.add(engine.world, body);
}

// Initialize the physics engine and setup the UI elements
document.addEventListener('DOMContentLoaded', () => {
    initPhysicsEngine();
    setupMaterialDropdown();
    setupFeatureButtons();
});
