import Matter from 'https://cdn.skypack.dev/matter-js';
import { engine } from './physicsInit.js';
import { screenToWorld } from './utils.js'; // Import screenToWorld function
import { render } from './physicsInit.js'; // Import render object for canvas context
// Expanded list of materials with detailed properties.
let currentMaterial = 'sand'

export const materials = {
    sand: { color: '#f4e04d', density: 0.0025, friction: 0.5, restitution: 0.3 },
    water: { color: '#3498db', density: 0.001, friction: 0.02, restitution: 0.9 },
    oil: { color: '#34495e', density: 0.0008, friction: 0.05, restitution: 0.05 },
    rock: { color: '#7f8c8d', density: 0.005, friction: 0.8, restitution: 0.1 },
    lava: { color: '#cf1020', density: 0.004, friction: 0.4, restitution: 0.6 },
    ice: { color: '#a8e0ff', density: 0.0009, friction: 0.01, restitution: 0.95 },
    rubber: { color: '#555', density: 0.0012, friction: 0.9, restitution: 0.8 },
    steel: { color: '#8d8d8d', density: 0.008, friction: 0.6, restitution: 0.1 },
    glass: { color: '#c4faf8', density: 0.002, friction: 0.4, restitution: 0.7 },
    wood: { color: '#deb887', density: 0.003, friction: 0.6, restitution: 0.3 },
    antimatter: { color: '#ff4081', density: 0.001, friction: 0.01, restitution: 0.99 },
    darkMatter: { color: '#6200ea', density: 0.0005, friction: 0.0, restitution: 1.0 },
    neutronium: { color: '#5c5c8a', density: 0.02, friction: 0.5, restitution: 0.1 },
    quantumFoam: { color: '#ffec8b', density: 0.0001, friction: 0.0, restitution: 0.98 },
    exoticMatter: { color: '#fa8072', density: -0.001, friction: 0.01, restitution: 1.1 },
    plasmaCrystal: { color: '#00ced1', density: 0.003, friction: 0.2, restitution: 0.5 },
    voidEssence: { color: '#000080', density: 0.0005, friction: 0.0, restitution: 1.0 },
    ether: { color: '#b19cd9', density: 0.0002, friction: 0.01, restitution: 0.95 },
    solarFlare: { color: '#ffae42', density: 0.001, friction: 0.1, restitution: 0.8 },
    cosmicDust: { color: '#6c7b8b', density: 0.002, friction: 0.7, restitution: 0.3 },
    magneticField: { color: '#1e90ff', density: 0.0001, friction: 0.0, restitution: 1.05 },
    photonGel: { color: '#ffa07a', density: 0.0008, friction: 0.05, restitution: 0.9 },
};

export const createBody = (clientX, clientY) => {
    // Verify render object's availability
    if (!render || !render.canvas) {
        console.error("Render object or canvas not available in createBody function.");
        return;
    }

    // Convert screen coordinates to world coordinates
    const { x, y } = screenToWorld(clientX, clientY, render);

    // Ensure material exists
    const material = materials[currentMaterial];
    if (!material) {
        console.error(`Material '${currentMaterial}' not found.`);
        return;
    }

    // Debugging: log material being used
    console.log(`Creating body with material: ${currentMaterial}`, material);

    // Determine body size based on material density (example logic)
    const baseSize = 20; // Base size for bodies
    const size = material.density < 0.001 ? 10 : (material.density < 0.005 ? 15 : 20);

    // Body options
    const bodyOptions = {
        density: material.density,
        friction: material.friction,
        restitution: material.restitution,
        render: { fillStyle: material.color },
    };

    // Create a circle body; could be extended to other shapes based on material
    const body = Matter.Bodies.circle(x, y, size, bodyOptions);

    // Add the body to the Matter.js world
    Matter.World.add(engine.world, body);

    // Debugging: Confirm body addition
    console.log(`Body created and added to world:`, body);
};
