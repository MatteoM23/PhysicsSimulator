import Matter from 'https://cdn.skypack.dev/matter-js';
import { interactionRules, handleCollisions } from './interactions.js';
import { screenToWorld } from './utils.js';

let engine, render, world;
let isMouseDown = false; // Define isMouseDown at the top of your script

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
    const buttons = document.querySelectorAll('.materialButton');
    buttons.forEach(button => {
        if (button.textContent === materials[key].label) {
            button.classList.add('selected');
            button.style.backgroundColor = materials[key].color; // Highlight with material color
            button.style.color = 'white'; // Ensure text contrast
        } else {
            button.classList.remove('selected');
            button.style.backgroundColor = ''; // Reset to default or initial color
            button.style.color = ''; // Reset text color
        }
    });
    console.log(`Material ${key} selected`);
}



function initPhysics() {
    engine = Matter.Engine.create();
    world = engine.world;

    render = Matter.Render.create({
        element: document.body, // Ensure this element is suitable for your page layout
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'linear-gradient(135deg, #333333, #1b2838)'
        }
    });

    // Define basic environment elements
    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 20, { 
        isStatic: true,
        render: {
            fillStyle: '#868e96' // Aesthetic choice for ground color
        }
    });

    const leftWall = Matter.Bodies.rectangle(0, window.innerHeight / 2, 20, window.innerHeight, { 
        isStatic: true,
        render: {
            fillStyle: '#868e96'
        }
    });

    const rightWall = Matter.Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 20, window.innerHeight, { 
        isStatic: true,
        render: {
            fillStyle: '#868e96'
        }
    });

    // Add elements to the world
    Matter.World.add(world, [ground, leftWall, rightWall]);

    // Setup collision handling
    Matter.Events.on(engine, 'collisionStart', function(event) {
        handleCollisions(event, engine);
    });

    // Start the engine and rendering
    Matter.Runner.run(engine);
    Matter.Render.run(render);

    // Setup event listeners for user interaction
    setupEventListeners();
}



function setupFeatureButtons() {
    const buttonsContainer = document.getElementById('uiContainer') || document.body; // Fallback to body if container not found
    const clearWorldButton = document.createElement('button');
    clearWorldButton.textContent = 'Clear World';
    clearWorldButton.onclick = () => clearDynamicBodies(world); // Assumes clearDynamicBodies function is defined
    buttonsContainer.appendChild(clearWorldButton);

    const invertGravityButton = document.createElement('button');
    invertGravityButton.textContent = 'Invert Gravity';
    invertGravityButton.onclick = () => {
        engine.world.gravity.y *= -1; // Inverts gravity
    };
    buttonsContainer.appendChild(invertGravityButton);

    // Add more feature buttons as needed
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
    if (!event.target.closest('.materialButton')) { // Prevents interaction if clicking on a material button
        isMouseDown = true;
        createBodyAtMousePosition(event); // Assumes this function is defined to handle body creation
    }
}

function handleMouseUp() {
    isMouseDown = false;
}

function handleMouseMove(event) {
    if (isMouseDown) {
        createBodyAtMousePosition(event); // Create or move body based on currentMaterial and mouse position
    }
}

function createBodyAtMousePosition(event) {
    const { x, y } = screenToWorld(event.clientX, event.clientY, render);
    // Assumes a function like createNewBody exists and utilizes x, y, and currentMaterial
    createNewBody(x, y, currentMaterial); // Adjust based on your createNewBody function's parameters
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

