import Matter from 'https://cdn.skypack.dev/matter-js';
import { interactionRules, handleCollisions } from './interactions.js';

// Define global variables for the engine and renderer
let engine, render;

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
            wireframeBackground: '#0f0f13',
            wireframes: false,
            background: 'linear-gradient(135deg, #333333, #1b2838)',
        },
    });

    // Add ground and walls
    addStaticBodies();

    // Run engine and renderer
    Matter.Runner.run(engine);
    Matter.Render.run(render);

    // Handle window resizing
    window.addEventListener('resize', handleResize);
}

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

let currentMaterial = 'sand'; // Default material

document.addEventListener('DOMContentLoaded', () => {
    initPhysicsEngine();
    setupMaterialDropdown();
    setupFeatureButtons();
});

function setupMaterialDropdown() {
    const dropdown = document.getElementById('materialDropdown');
    const toggleButton = document.getElementById('toggleMaterials');

    toggleButton.addEventListener('click', () => {
        dropdown.classList.toggle('show');
    });

    Object.entries(materials).forEach(([key, material]) => {
        const option = document.createElement('a');
        option.textContent = material.label;
        option.href = '#';
        option.addEventListener('click', (event) => {
            event.preventDefault();
            currentMaterial = key;
            console.log(`${materials[currentMaterial].label} selected`);
            dropdown.classList.remove('show'); // Optionally close the dropdown
        });
        dropdown.appendChild(option);
    });
}

function addStaticBodies() {
    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 10, window.innerWidth, 20, { isStatic: true, render: { fillStyle: '#868e96' }});
    const leftWall = Matter.Bodies.rectangle(0, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true });
    const rightWall = Matter.Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true });
    Matter.World.add(engine.world, [ground, leftWall, rightWall]);
}

function handleResize() {
    Matter.Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: window.innerWidth, y: window.innerHeight }
    });
}

function setupFeatureButtons() {
    const featuresDiv = document.getElementById('featureButtons');
    const buttons = [
        { id: 'invertGravity', title: 'Invert Gravity', action: invertGravity },
        { id: 'clearWorld', title: 'Clear World', action: () => clearWorld(false) }, // false to keep static bodies
        { id: 'createBlackHole', title: 'Create Black Hole', action: createBlackHole },
        // Define other buttons here
    ];

    buttons.forEach(({ id, title, action }) => {
        let button = document.createElement('button');
        button.id = id;
        button.innerText = title;
        button.addEventListener('click', action);
        featuresDiv.appendChild(button);
    });
}

function invertGravity() {
    engine.world.gravity.y = -engine.world.gravity.y;
}

function clearWorld(keepStatic) {
    Matter.Composite.allBodies(engine.world).forEach(body => {
        if (!body.isStatic || !keepStatic) {
            Matter.World.remove(engine.world, body);
        }
    });
}

function createBlackHole() {
    const blackHole = Matter.Bodies.circle(window.innerWidth / 2, window.innerHeight / 2, 50, {
        isStatic: true,
        render: {
            sprite: {
                texture: 'path/to/blackhole.png',
                xScale: 1,
                yScale: 1
            }
        }
    });
    Matter.World.add(engine.world, blackHole);

    // Add gravitational attraction
    Matter.Events.on(engine, 'beforeUpdate', function() {
        attractBodiesToBlackHole(blackHole);
    });
}

function attractBodiesToBlackHole(blackHole) {
    const forceMagnitude = 1e-4; // Adjust based on desired strength
    Matter.Composite.allBodies(engine.world).forEach(body => {
        if (body === blackHole || body.isStatic) return;
        const dx = blackHole.position.x - body.position.x;
        const dy = blackHole.position.y - body.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const force = { x: (dx / distance) * forceMagnitude, y: (dy / distance) * forceMagnitude };
        Matter.Body.applyForce(body, body.position, force);
    });
}

document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mouseup', handleMouseUp);

function handleMouseDown(event) {
    createParticle(event.clientX, event.clientY);
    document.addEventListener('mousemove', handleMouseMove);
}

function handleMouseMove(event) {
    createParticle(event.clientX, event.clientY);
}

function handleMouseUp() {
    document.removeEventListener('mousemove', handleMouseMove);
}

function createParticle(x, y) {
    const material = materials[currentMaterial];
    const particle = Matter.Bodies.circle(x, y, material.size, {
        render: { fillStyle: material.color },
        ...material
    });
    Matter.World.add(engine.world, particle);
}
