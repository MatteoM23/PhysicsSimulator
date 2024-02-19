import Matter from 'https://cdn.skypack.dev/matter-js';
import { interactionRules, handleCollisions } from './interactions.js';
import { screenToWorld } from './utils.js';


let engine, render, world, runner; // Declare all needed variables at the top
let isMouseDown = false; // Define isMouseDown at the top of your script
let fountainInterval;
let particles = [];
let teleportationActive = false;
let placingGateA = false, placingGateB = false;
let gateA, gateB;
let gates = [];
let currentMaterial = 'sand';


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

document.addEventListener('DOMContentLoaded', () => {
    initPhysics();
    setupEventListeners();
    // Additional setup logic can go here
});

function initPhysics() {
    // Initialize engine
    engine = Matter.Engine.create();
    world = engine.world;

    // Initialize renderer
    render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'transparent',
        },
    });

    // Initialize runner
    runner = Matter.Runner.create(); // Make sure this is properly initialized

    // Add walls or other static bodies
    addBoundaries();

    // Setup event listeners AFTER initializing engine
    setupEventListeners();

    // Start everything
    Matter.Runner.run(runner, engine); // Use the initialized runner
    Matter.Render.run(render);
}



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
        button.classList.remove('selected'); // Remove the class from all buttons
        if (button.textContent === materials[key].label) {
            button.classList.add('selected'); // Add class to the selected one
        }
    });
    console.log(`Material ${key} selected`);
}


function setupEventListeners() {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
}

function handleMouseDown(event) {
    if (!event.target.matches('.materialButton') && !teleportationActive) {
        isMouseDown = true;
        placeMaterial(event.clientX, event.clientY);
    }
}

function handleMouseUp() {
    isMouseDown = false;
}

function handleMouseMove(event) {
    if (isMouseDown) {
        placeMaterial(event.clientX, event.clientY);
    }
}

function placeMaterial(screenX, screenY) {
    const point = screenToWorld(screenX, screenY, render);
    createBody(point.x, point.y, currentMaterial);
}

function createBody(x, y, materialKey) {
    const material = materials[materialKey];
    const body = Matter.Bodies.circle(x, y, material.size / 2, {
        density: material.density,
        friction: material.friction,
        restitution: material.restitution,
        render: { fillStyle: material.color },
        material: materialKey
    });
    Matter.World.add(world, body);
}

function addBoundaries() {
    const thickness = 50;
    const walls = [
        // Bottom
        Matter.Bodies.rectangle(render.options.width / 2, render.options.height, render.options.width, thickness, { isStatic: true }),
        // Top
        Matter.Bodies.rectangle(render.options.width / 2, 0, render.options.width, thickness, { isStatic: true }),
        // Left
        Matter.Bodies.rectangle(0, render.options.height / 2, thickness, render.options.height, { isStatic: true }),
        // Right
        Matter.Bodies.rectangle(render.options.width, render.options.height / 2, thickness, render.options.height, { isStatic: true })
    ];
    Matter.World.add(world, walls);
}


function createRenderer() {
    const existingCanvas = document.querySelector('canvas');
    if (existingCanvas) {
        existingCanvas.remove(); // Remove any existing canvas
    }

    render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false, // Set to true if you prefer wireframe view
            background: 'linear-gradient(135deg, #333333, #1b2838)', // Adjust the background as needed
        }
    });
}


function addEnvironment() {
    // Clear existing static bodies to avoid duplicates
    Matter.World.clear(world, false); // false ensures only non-static bodies are removed

    // Ground
    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 20, {
        isStatic: true,
        render: { fillStyle: '#868e96' }
    });

    // Left Wall
    const leftWall = Matter.Bodies.rectangle(0, window.innerHeight / 2, 20, window.innerHeight, {
        isStatic: true,
        render: { fillStyle: '#868e96' }
    });

    // Right Wall
    const rightWall = Matter.Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 20, window.innerHeight, {
        isStatic: true,
        render: { fillStyle: '#868e96' }
    });

    // Adding ground and walls to the world
    Matter.World.add(world, [ground, leftWall, rightWall]);
}


function handleResize() {
    // Update renderer dimensions
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
    render.options.width = window.innerWidth;
    render.options.height = window.innerHeight;

    // Re-adjust the environment elements to fit the new size
    addEnvironment();
}


function setButtonTextColorBasedOnBackground() {
    const buttons = document.querySelectorAll('.materialButton');
    buttons.forEach(button => {
        const bgColor = getComputedStyle(button).backgroundColor;
        const color = invertColor(bgColor, true);
        button.style.color = color;
    });
}

function invertColor(rgb, bw) {
    if (/^rgb/.test(rgb)) {
        let [r, g, b] = rgb.match(/\d+/g).map(Number);
        if (bw) {
            // http://stackoverflow.com/a/3943023/112731
            return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF';
        }
        // invert color components
        r = (255 - r).toString(16);
        g = (255 - g).toString(16);
        b = (255 - b).toString(16);
        // pad each with zeros and return
        return "#" + padZero(r) + padZero(g) + padZero(b);
    }
    return rgb;
}

function padZero(str, len = 2) {
    const zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

// Call this function after your buttons are created or when the document is fully loaded
document.addEventListener('DOMContentLoaded', setButtonTextColorBasedOnBackground);


// Enhance the features in the setupFeatureButtons() function
function setupFeatureButtons() {
    const buttonsContainer = document.querySelector('.feature-buttons');
    if (!buttonsContainer) {
        console.error('Feature buttons container not found');
        return;
    }

    // Existing buttons
    const clearWorldButton = document.createElement('button');
    clearWorldButton.textContent = 'Clear World';
    clearWorldButton.onclick = clearMaterialBodiesWithEffect;
    buttonsContainer.appendChild(clearWorldButton);

    const invertGravityButton = createFeatureButton('Invert Gravity', () => {
        engine.world.gravity.y *= -1;
    });
    buttonsContainer.appendChild(invertGravityButton);

    // Teleportation Gates Button
    const teleportGatesButton = createFeatureButton('Toggle Teleport Gates', toggleTeleportationGates);
    buttonsContainer.appendChild(teleportGatesButton);
}

function toggleTeleportationGates() {
    teleportationActive = !teleportationActive;
    if (teleportationActive) {
        document.body.style.cursor = 'crosshair'; // Visual cue for placement mode
    } else {
        clearTeleportationGates();
        document.body.style.cursor = 'default';
    }
}

function clearTeleportationGates() {
    if (gateA) Matter.World.remove(world, gateA);
    if (gateB) Matter.World.remove(world, gateB);
    gateA = gateB = null;
    gates = [];
    placingGateA = placingGateB = false;
}

document.addEventListener('mousemove', function(event) {
    if (!teleportationActive || !placingGateA && !placingGateB) return;
    const mousePos = { x: event.clientX, y: event.clientY };
    const options = {
        isSensor: true,
        render: {
            strokeStyle: placingGateA ? 'rgba(0,255,0,0.5)' : 'rgba(255,0,0,0.5)',
            lineWidth: 1
        }
    };
    // Preview placement for Gate A or B
    if (!gateA || !gateB) {
        let tempGate = Matter.Bodies.rectangle(mousePos.x, mousePos.y, 100, 20, options);
        Matter.Render.lookAt(render, tempGate.bounds);
    }
});

document.addEventListener('click', function(event) {
    if (!teleportationActive) return;
    if (placingGateA || placingGateB) {
        placeTeleportGate(event.clientX, event.clientY);
    }
});

function placeTeleportGate(x, y) {
    if (placingGateA) {
        gateA = createGate(x, y, 'gateA');
        placingGateA = false;
        placingGateB = true;
    } else if (placingGateB) {
        gateB = createGate(x, y, 'gateB');
        teleportationActive = false; // Disable teleportation gate placement
        placingGateB = false;
        gates = [gateA, gateB];
    }
}


function createGate(x, y, label) {
    // Ensure gateA and gateB are properly initialized before using them
    if (!gateA || !gateB) {
        console.error('Error: GateA or GateB is not initialized.');
        return null; // Return null if gateA or gateB is not initialized
    }

    let gate = Matter.Bodies.rectangle(x, y, 100, 20, {
        isStatic: true,
        isSensor: true,
        label: label,
        render: { fillStyle: label === 'gateA' ? 'green' : 'red' }
    });
    Matter.World.add(world, gate);
    return gate;
}

// Ensure engine is properly initialized before using it
if (engine) {
    Matter.Events.on(engine, 'collisionStart', function(event) {
        event.pairs.forEach(function(pair) {
            if ((pair.bodyA === gateA && pair.bodyB !== gateB) || (pair.bodyA === gateB && pair.bodyB !== gateA)) {
                let otherGate = pair.bodyA === gateA ? gateB : gateA;
                Matter.Body.setPosition(pair.bodyB, { x: otherGate.position.x, y: otherGate.position.y - 100 });
            }
        });
    });
} else {
    console.error('Error: Engine is not initialized.');
}



function setupCustomMaterialCreator() {
    const customMaterialButton = createFeatureButton('Create Material', openMaterialCreator);
    document.querySelector('.feature-buttons').appendChild(customMaterialButton);
}

function openMaterialCreator() {
    // Open a modal or a side panel where users can input properties for a new material
    // For simplicity, this could be a series of prompts or a form in a modal
    const name = prompt("Enter material name:");
    const color = prompt("Enter material color (hex):");
    const density = parseFloat(prompt("Enter material density:"));
    const friction = parseFloat(prompt("Enter material friction:"));
    const restitution = parseFloat(prompt("Enter material restitution:"));

    // Add the new material to the materials object
    materials[name] = { label: name, color, density, friction, restitution, size: 25 }; // Default size provided

    // Refresh the material selector UI to include the new material
    setupMaterialSelector(materials);
}

function shakeScreen(duration, intensity) {
    let start = performance.now();
    function shake() {
        const elapsed = performance.now() - start;
        const randomX = intensity * (Math.random() - 0.5) * 2;
        const randomY = intensity * (Math.random() - 0.5) * 2;
        window.scrollBy(randomX, randomY);
        if (elapsed < duration) requestAnimationFrame(shake);
        else window.scrollTo(0, 0); // Reset view after shaking
    }
    requestAnimationFrame(shake);
}


function createParticleBurst(position, color, numParticles, size) {
    const explosionForce = 0.02;
    for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = {
            x: Math.cos(angle) * explosionForce,
            y: Math.sin(angle) * explosionForce
        };
        const particle = Matter.Bodies.circle(position.x, position.y, size / 2, {
            frictionAir: 0,
            restitution: 1,
            render: {
                fillStyle: color,
                strokeStyle: 'transparent'
            }
        });
        particles.push(particle);
        Matter.World.add(world, particle);
        Matter.Body.setVelocity(particle, velocity);
    }
}

function createColorChangingParticle(x, y, size, duration) {
    const colors = ['#FF6347', '#FFA500', '#FFFF00', '#32CD32', '#6495ED', '#9370DB']; // Example colors
    const particle = Matter.Bodies.circle(x, y, size / 2, {
        frictionAir: 0,
        restitution: 0.5 // Example restitution
    });
    const initialColor = colors[Math.floor(Math.random() * colors.length)];
    const finalColor = colors[Math.floor(Math.random() * colors.length)];
    let startTime = null;

    function updateColor(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = (currentTime - startTime) / 1000; // Convert milliseconds to seconds
        const t = elapsed / duration;
        const r = Math.floor(initialColor[1] * (1 - t) + finalColor[1] * t);
        const g = Math.floor(initialColor[2] * (1 - t) + finalColor[2] * t);
        const b = Math.floor(initialColor[3] * (1 - t) + finalColor[3] * t);
        const color = `rgb(${r},${g},${b})`;
        particle.render.fillStyle = color;
        if (elapsed < duration * 1000) {
            requestAnimationFrame(updateColor);
        }
    }

    requestAnimationFrame(updateColor);
    particles.push(particle);
    Matter.World.add(world, particle);
}


// Clear World enhancement
function clearMaterialBodiesWithEffect() {
    // Fade out or animate the removal of material bodies for a visually pleasing effect
    const bodies = Matter.Composite.allBodies(world);
    bodies.forEach(body => {
        if (!body.isStatic) { // Check if the body is not static (walls and floor)
            // Example: Animate body removal
            fadeOutBody(body);
        }
    });

    // Clear world after animation completes
    setTimeout(() => {
        // Remove only dynamic bodies, keeping static bodies (walls and floor)
        bodies.forEach(body => {
            if (!body.isStatic) { // Check if the body is not static (walls and floor)
                Matter.Composite.remove(world, body); // Remove the body from the world
            }
        });
    }, 1000); // Adjust delay as needed for animation duration
}


function fadeOutBody(body) {
    // Example: Animate fading out of body
    // You can use CSS animations or libraries like GSAP for animation
    body.render.fillStyle = 'rgba(255, 255, 255, 0)'; // Example fading to transparent
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






