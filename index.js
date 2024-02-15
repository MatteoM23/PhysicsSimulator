// Assuming import statements are at the top of your script file
import Matter from 'https://cdn.skypack.dev/matter-js';
import { interactionRules, handleCollisions } from './interactions.js';

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
let engine, render; // Define engine and render at a higher scope for access

document.addEventListener('DOMContentLoaded', function() {
    initPhysics();
    setupMaterialSelector();
    setupFeatureButtons();
});

function initPhysics() {
    engine = Matter.Engine.create();
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

    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 20, { isStatic: true });
    const walls = [
        Matter.Bodies.rectangle(0, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true }),
        Matter.Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true })
    ];
    Matter.World.add(engine.world, [ground, ...walls]);
    Matter.Events.on(engine, 'collisionStart', handleCollisions);
    adjustPerformanceBasedOnOS(engine);
    Matter.Runner.run(engine);
    Matter.Render.run(render);
}

function adjustPerformanceBasedOnOS(engine) {
    const platform = navigator.platform.toLowerCase();
    if (platform.includes('mac')) {
        engine.timing.timeScale = 0.8;
    } else if (platform.includes('win')) {
        engine.timing.timeScale = 1;
    }
}

function setupMaterialSelector() {
    // Correct the ID to match your HTML
    const selector = document.getElementById('material-Selector'); 
    if (!selector) return; // Check if the selector exists to avoid errors

    Object.entries(materials).forEach(([key, value]) => {
        const button = document.createElement('button');
        button.textContent = value.label;
        button.style.backgroundColor = value.color;
        button.onclick = () => {
            currentMaterial = key;
            document.querySelectorAll('#material-Selector button').forEach(btn => {
                btn.classList.remove('selected');
            });
            button.classList.add('selected');
        };
        selector.appendChild(button);
    });
}


function setupFeatureButtons() {
    const featuresDiv = document.getElementById('featureButtons'); // Adjust this ID based on your HTML
    if (!featuresDiv) return; // Guard clause if featuresDiv doesn't exist

    // Invert Gravity Button
    const invertGravityButton = document.createElement('button');
    invertGravityButton.innerText = 'Invert Gravity';
    invertGravityButton.onclick = () => engine.world.gravity.y *= -1;
    featuresDiv.appendChild(invertGravityButton);

    // Clear World Button
    const clearWorldButton = document.createElement('button');
    clearWorldButton.innerText = 'Clear World';
    clearWorldButton.onclick = () => {
        Matter.World.clear(engine.world);
        Matter.Engine.clear(engine);
        initPhysics(); // You may need to adjust this based on your setup
    };
    featuresDiv.appendChild(clearWorldButton);
}

document.body.addEventListener('mousedown', mouseControl);
document.body.addEventListener('mousemove', mouseControl);
document.body.addEventListener('mouseup', () => isMouseDown = false);

let isMouseDown = false;
function mouseControl(event) {
    if (event.type === 'mousedown') isMouseDown = true;
    if (isMouseDown) {
        const { x, y } = screenToWorld(event.clientX, event.clientY);
        createNewBody({ x, y }, currentMaterial);
    }
}

function screenToWorld(clientX, clientY) {
    const bounds = render.canvas.getBoundingClientRect();
    return {
        x: (clientX - bounds.left) * (render.canvas.width / bounds.width),
        y: (clientY - bounds.top) * (render.canvas.height / bounds.height)
    };
}

function createNewBody(position, materialKey) {
    const material = materials[materialKey];
    const body = Matter.Bodies.circle(position.x, position.y, material.size / 2, {
        density: material.density,
        friction: material.friction,
        restitution: material.restitution,
        render: { fillStyle: material.color }
    });
    Matter.World.add(engine.world, body);
}
