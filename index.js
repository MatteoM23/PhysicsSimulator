import Matter from 'https://cdn.skypack.dev/matter-js';
import { interactionRules, handleCollisions } from './interactions.js';
import { screenToWorld } from './utils.js';

let engine, render, world;
let isMouseDown = false; // Define isMouseDown at the top of your script
let fountainInterval;
let particles = [];



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
        button.classList.remove('selected'); // Remove the class from all buttons
        if (button.textContent === materials[key].label) {
            button.classList.add('selected'); // Add class to the selected one
        }
    });
    console.log(`Material ${key} selected`);
}

let engine, render, world;

function initPhysics() {
    engine = Matter.Engine.create();
    world = engine.world;

    // Create the renderer with dynamic size
    createRenderer();

    // Add the initial environment
    addEnvironment();

    // Start the engine and rendering
    Matter.Runner.run(engine);
    Matter.Render.run(render);

    // Handle window resize
    window.addEventListener('resize', handleResize);
}

function createRenderer() {
    const existingCanvas = document.querySelector('canvas');
    if (existingCanvas) {
        existingCanvas.remove(); // Prevents multiple canvases from being created
    }

    render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'linear-gradient(135deg, #333333, #1b2838)',
        }
    });
}

function handleResize() {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
    render.options.width = window.innerWidth;
    render.options.height = window.innerHeight;

    // Recreate the environment to adjust to new dimensions
    addEnvironment();
}



function addEnvironment() {
    // Clear existing environment elements before adding new ones
    Matter.World.clear(world);
    
    // Recalculate positions based on the current window size
    const groundHeight = 50; // Fixed ground height
    const groundY = window.innerHeight - groundHeight / 2; // Adjust ground position to bottom

    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, groundY, window.innerWidth, groundHeight, {
        isStatic: true,
        render: { fillStyle: '#868e96' }
    });

    const leftWall = Matter.Bodies.rectangle(0, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true });
    const rightWall = Matter.Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true });

    Matter.World.add(world, [ground, leftWall, rightWall]);
}

document.addEventListener('DOMContentLoaded', initPhysics);


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
    // Ensure the feature buttons container is targeted specifically
    const buttonsContainer = document.querySelector('.feature-buttons');
    if (!buttonsContainer) {
        console.error('Feature buttons container not found');
        return;
    }

    const clearWorldButton = document.createElement('button');
    clearWorldButton.textContent = 'Clear World';
    clearWorldButton.onclick = clearMaterialBodiesWithEffect; // Updated onclick event handler
    buttonsContainer.appendChild(clearWorldButton);

    const invertGravityButton = createFeatureButton('Invert Gravity', () => {
        engine.world.gravity.y *= -1; // Inverts gravity
    });
    buttonsContainer.appendChild(invertGravityButton);

    const materialFountainButton = createFeatureButton('Material Fountain', startMaterialFountainWithEffect);
    buttonsContainer.appendChild(materialFountainButton);

    // Add more feature buttons as needed, appending them to buttonsContainer
}

function startMaterialFountainWithEffect() {
    // Clear existing particles to prevent accumulation over time
    particles.forEach(particle => {
        Matter.World.remove(world, particle);
    });
    particles = [];

    // Start fountain interval
    fountainInterval = setInterval(() => {
        const x = window.innerWidth / 2; // Fixed x position (center of the screen)
        const velocity = { x: Math.random() * 2 - 1, y: -Math.random() * 5 }; // Randomized velocity for realistic fountain effect
        createBodyWithVelocity(x, window.innerHeight, currentMaterial, velocity); // Spawn material body with velocity at the bottom of the screen

        // Create color-changing and varying-sized particles for visual effect
        createColorChangingParticle(x, window.innerHeight, 5 + Math.random() * 15, 0.5 + Math.random() * 0.5); // Example function to create color-changing particles
    }, 100); // Adjust interval as desired
}

function stopMaterialFountain() {
    clearInterval(fountainInterval);
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
    // Corrected to use the existing createBody function
    createBody(x, y, currentMaterial);
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
        // Add a material property to the body
        material: materialKey // This is important for interactions.js to identify the body's material
    });
    Matter.World.add(world, body);
}



