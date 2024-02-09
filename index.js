import Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/mode=imports/optimized/matter-js.js';
import { initPhysics, addParticle, addWalls } from './physics.js';
import { screenToWorld } from './utils.js';
import { handleInteractions } from './interactions.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize the physics environment with your setup
    const { engine, world, render } = await initPhysics({
        width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    });

    // Add walls to contain particles
    addWalls(world);

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

    let currentMaterial = 'sand'; // Default material selection

    // UI setup for material selection
    setupMaterialSelector(materials);

    // Feature buttons setup for gravity inversion and time dilation
    setupFeatureButtons(engine);

    // Handling continuous particle creation on mouse interaction
    handleMouseEvents(render, materials, world);

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
        materialSelector.id = 'materialSelector'; // Assigning an ID for potential CSS styling
        document.body.appendChild(materialSelector);

        Object.entries(materials).forEach(([key, value]) => {
            const button = document.createElement('button');
            button.innerText = key;
            button.onclick = () => currentMaterial = key;
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
        featureButtons.id = 'featureButtons'; // Assigning an ID for potential CSS styling
        document.body.appendChild(featureButtons);

        // Gravity Inversion Button
        const gravityBtn = document.createElement('button');
        gravityBtn.innerText = 'Invert Gravity';
        gravityBtn.onclick = () => engine.world.gravity.y *= -1;
        featureButtons.appendChild(gravityBtn);

        // Time Dilation Button
        const timeBtn = document.createElement('button');
        timeBtn.innerText = 'Toggle Time Dilation';
        timeBtn.onclick = () => engine.timing.timeScale = engine.timing.timeScale === 1 ? 0.5 : 1;
        featureButtons.appendChild(timeBtn);
    }

    function handleMouseEvents(render, materials, world) {
        document.addEventListener('mousedown', event => {
            const { x, y } = screenToWorld(event.clientX, event.clientY, render.canvas);
            addParticle(x, y, currentMaterial, materials[currentMaterial], world);
        });
    }
});
