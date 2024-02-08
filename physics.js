// Import necessary components from Matter.js
import { createMaterial } from './materials.js';
// Assuming Matter.js is globally available, otherwise adjust import as per your setup
const { Engine, World, Bodies, Events, Body } = Matter;

// Global variables for the engine and world
let engine, world;

// Initialize the physics engine and world
function initPhysics() {
    engine = Engine.create();
    world = engine.world;
    engine.world.gravity.y = 1; // Default gravity

    // Setup collision handling for advanced interactions
    setupCollisionHandling();
}

// Function to add a particle with specified material properties
function addParticle(x, y, materialType) {
    // Utilizes createMaterial from materials.js
    // Please ensure createMaterial is defined to accept these parameters
    createMaterial(x, y, materialType, world);
}

// Setup collision handling for material interactions
function setupCollisionHandling() {
    Events.on(engine, 'collisionStart', function(event) {
        event.pairs.forEach(pair => {
            const bodyA = pair.bodyA, bodyB = pair.bodyB;

            // Example: Trigger an explosion when lava and oil collide
            if ((bodyA.plugin.materialType === 'lava' && bodyB.plugin.materialType === 'oil') ||
                (bodyA.plugin.materialType === 'oil' && bodyB.plugin.materialType === 'lava')) {
                triggerExplosion(bodyA.position.x, bodyA.position.y);
            }
            // Add more interactions as needed
        });
    });
}

// Implement explosion mechanic for specific interactions
function triggerExplosion(x, y) {
    // Example: Create particles to simulate an explosion
    for (let i = 0; i < 20; i++) { // Number of particles generated in the explosion
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 10 + 5; // Random speed for explosion effect
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        let particle = Bodies.circle(x, y, 2, { // Small particles
            restitution: 0.5,
            density: 0.001,
            frictionAir: 0.05,
        });

        Body.setVelocity(particle, { x: vx, y: vy });
        World.add(world, particle);
    }
}

// Regularly update the physics engine
function update() {
    Engine.update(engine, 1000 / 60); // Update the engine at 60fps
}

// Export functions for use in other modules
export { world, initPhysics, addParticle, update, triggerExplosion };
