// Import Matter.js from CDN
import Matter from 'https://cdn.skypack.dev/matter-js';

// Assuming initPhysics, addWalls, handleInteractions are defined in your physics.js and interactions.js
import { initPhysics, addWalls } from './physics.js';
import { handleInteractions } from './interactions.js';
import { screenToWorld } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the physics environment
    const { engine, world } = initPhysics();
    addWalls(engine, world);

    // Define materials with properties
    const materials = {
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

    let currentMaterial = 'sand'; // Default material

    // Setup material selector UI
    setupMaterialSelector(materials);

    // Setup feature buttons UI
    setupFeatureButtons(engine);

    // Register mouse event for creating particles
    document.addEventListener('mousedown', (event) => {
        const { x, y } = screenToWorld(event.clientX, event.clientY);
        // Create particle based on currentMaterial
        createParticle(x, y, currentMaterial, materials[currentMaterial], world);
    });

    // Start the engine
    Matter.Engine.run(engine);

    function setupMaterialSelector(materials) {
        const selector = document.getElementById('materialSelector');
        Object.entries(materials).forEach(([key, material]) => {
            const button = document.createElement('button');
            button.innerText = key;
            button.onclick = () => currentMaterial = key;
            selector.appendChild(button);
        });
    }

    function setupFeatureButtons(engine) {
        const buttonsContainer = document.getElementById('featureButtons');

        const gravityBtn = document.createElement('button');
        gravityBtn.innerText = 'Invert Gravity';
        gravityBtn.onclick = () => engine.world.gravity.y *= -1;
        buttonsContainer.appendChild(gravityBtn);

        const timeBtn = document.createElement('button');
        timeBtn.innerText = 'Toggle Time Dilation';
        timeBtn.onclick = () => engine.timing.timeScale = engine.timing.timeScale === 1 ? 0.5 : 1;
        buttonsContainer.appendChild(timeBtn);
    }

    function createParticle(x, y, materialKey, material, world) {
        const particle = Matter.Bodies.circle(x, y, 5, {
            density: material.density,
            friction: material.friction,
            restitution: material.restitution || 0,
            render: { fillStyle: material.color },
        });
        Matter.World.add(world, particle);
    }

    // Handle interactions between materials
    handleInteractions(engine, world);
});
