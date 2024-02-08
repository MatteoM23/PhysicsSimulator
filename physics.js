// Import Matter.js and custom modules for interactions and material creation.
import Matter from 'https://cdn.skypack.dev/matter-js';
import { handleInteractions } from './interactions.js';
import { createMaterial } from './materials.js';

// Create a Matter.js engine and world.
let engine = Matter.Engine.create();
let world = engine.world;
// Set the gravity for the simulation.
engine.world.gravity.y = 1;

function initPhysics() {
    // Add ground to prevent particles from falling out of view.
    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 20, { isStatic: true, render: { fillStyle: 'grey' } });
    Matter.World.add(world, ground);

    // Initialize custom interactions between materials.
    handleInteractions(engine);
}

// Function to add a particle with a specified material type at the given (x, y) position.
function addParticle(x, y, materialType) {
    // Utilize createMaterial from 'materials.js' to add a new material particle to the world.
    createMaterial(x, y, materialType, world);
}

// Function to update the engine. This should be called in a loop or driven by a rendering loop.
function update() {
    Matter.Engine.update(engine, 1000 / 60); // Update the engine at 60 fps.
}

// Immediately initialize the physics engine upon script execution.
initPhysics();

// Expose functions for external use, if necessary.
export { initPhysics, addParticle, update, engine, world };
