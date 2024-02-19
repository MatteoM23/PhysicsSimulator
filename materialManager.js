import Matter from 'https://cdn.skypack.dev/matter-js';
import { engine, render } from './physicsInit.js';
import { screenToWorld } from './utils.js';
import { currentMaterial } from './dropdown.js'; // Ensure this import is correct

// Expanded list of materials with detailed properties.
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
    cosmicDust: { color: '#6c7b8b', density: 0.002, size: 20, friction: 0.7, restitution: 0.3 },
    magneticField: { color: '#1e90ff', density: 0.0001, size: 40, friction: 0.0, restitution: 1.05 },
    photonGel: { color: '#ffa07a', density: 0.0008, size: 25, friction: 0.05, restitution: 0.9 },
    // Feel free to add or modify materials as you see fit for your simulation's requirements.
};

export const createBody = (clientX, clientY) => {
    // Use currentMaterial directly instead of materialKey parameter
    const { x, y } = screenToWorld(clientX, clientY, render);
    const material = materials[currentMaterial]; // Use currentMaterial here

    if (!material) {
        console.error(`Material '${currentMaterial}' not found.`);
        return;
    }

    const body = Matter.Bodies.circle(x, y, material.size || 20, {
        isStatic: material.isStatic || false,
        render: { fillStyle: material.color },
        density: material.density,
        friction: material.friction,
        restitution: material.restitution
    });

    Matter.World.add(engine.world, body);
};


export const handleTeleportationCollision = (event) => {
    // Example implementation
    event.pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
        // Additional logic for teleportation collisions could be implemented here,
        // such as checking for special material interactions or teleportation gate logic.
    });
};
