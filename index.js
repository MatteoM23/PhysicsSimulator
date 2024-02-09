import Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/mode=imports/optimized/matter-js.js';
import { engine, world, initPhysics, addWalls } from './physics.js';
import { handleInteractions } from './interactions.js';
import { screenToWorld, calculateMagnitude, applyForceTowardsPoint } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    initPhysics(); // Initialize the physics environment with ground and default settings
    addWalls(engine, render); // Add invisible walls to contain particles

    const materials = {
    sand: { label: 'Sand', color: '#f4e04d', density: 0.002, size: 5 },
    water: { label: 'Water', color: '#3498db', density: 0.0001, size: 6, friction: 0, restitution: 0.1 },
    oil: { label: 'Oil', color: '#34495e', density: 0.0012, size: 6, friction: 0.05, restitution: 0.05, flammable: true },
    rock: { label: 'Rock', color: '#7f8c8d', density: 0.004, size: 8, friction: 0.6, restitution: 0.1 },
    lava: { label: 'Lava', color: '#e74c3c', density: 0.003, size: 7, friction: 0.2, restitution: 0.4, temperature: 1200 },
    antimatter: { label: 'Antimatter', color: '#8e44ad', density: 0.001, size: 10, friction: 0.0, restitution: 1.0, isAntimatter: true },
};

    let currentMaterial = 'sand'; // Default material

    // UI for material selection at the bottom of the screen
    const materialSelector = document.createElement('div');
    materialSelector.style.position = 'fixed';
    materialSelector.style.bottom = '10px';
    materialSelector.style.left = '50%';
    materialSelector.style.transform = 'translateX(-50%)';
    materialSelector.style.display = 'flex';
    document.body.appendChild(materialSelector);

    Object.keys(materials).forEach(key => {
        const material = materials[key];
        const button = document.createElement('button');
        button.innerText = material.label;
        button.addEventListener('click', () => currentMaterial = key);
        materialSelector.appendChild(button);
    });

    // Feature buttons for gravity inversion and time dilation
    const gravityBtn = document.createElement('button');
    gravityBtn.innerText = 'Invert Gravity';
    gravityBtn.addEventListener('click', () => engine.world.gravity.y *= -1);
    document.body.appendChild(gravityBtn);

    const timeBtn = document.createElement('button');
    timeBtn.innerText = 'Toggle Time Dilation';
    timeBtn.addEventListener('click', () => engine.timing.timeScale = engine.timing.timeScale === 1 ? 0.5 : 1);
    document.body.appendChild(timeBtn);

    // Continuous particle creation on mouse down
    document.addEventListener('mousedown', event => {
        const onMouseMove = e => {
            if (e.target === render.canvas) {
                const { x, y } = screenToWorld(e.clientX, e.clientY);
                // Use the addParticle function from physics.js with the currentMaterial
                addParticle(x, y, currentMaterial);
            }
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', () => document.removeEventListener('mousemove', onMouseMove), { once: true });
    });

    // Integrate interactions from interactions.js
    handleInteractions(engine, world);

    // Setup and run the Matter.js engine and renderer
    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
        },
    });
    Matter.Engine.run(engine);
    Matter.Render.run(render);
});
