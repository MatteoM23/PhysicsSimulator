// Import necessary components from Matter.js
const { Engine, World, Bodies, Events } = Matter;
import { createMaterial } from './materials.js'; // Ensure this import matches your project structure

// Initialize engine and world
let engine = Engine.create();
let world = engine.world;

// Initialize physics settings
function initPhysics() {
    engine.gravity.y = 1; // Default gravity, can be adjusted as needed
}

// Add a particle with specified material properties to the world
function addParticle(x, y, materialType) {
    // Directly utilize the createMaterial function from materials.js
    createMaterial(x, y, materialType, world);
}

// Create a gravity inversion field effect
function createGravityInversionField(x, y, radius, strength) {
    Events.on(engine, 'beforeUpdate', function() {
        World.allBodies(world).forEach(body => {
            const distance = Math.sqrt(Math.pow(body.position.x - x, 2) + Math.pow(body.position.y - y, 2));
            if (distance < radius && !body.isStatic) {
                // Invert gravity within the specified radius
                const forceDirection = Math.atan2(body.position.y - y, body.position.x - x);
                const forceMagnitude = strength * (radius - distance) / radius;
                body.force.x += Math.cos(forceDirection) * forceMagnitude * body.mass;
                body.force.y += Math.sin(forceDirection) * forceMagnitude * body.mass;
            }
        });
    });
}

// Create a time dilation field effect
function createTimeDilationField(x, y, radius, dilationFactor) {
    Events.on(engine, 'beforeUpdate', function() {
        World.allBodies(world).forEach(body => {
            const distance = Math.sqrt(Math.pow(body.position.x - x, 2) + Math.pow(body.position.y - y, 2));
            if (distance < radius && !body.isStatic) {
                // Slow down time by reducing velocity
                body.velocity.x *= dilationFactor;
                body.velocity.y *= dilationFactor;
            }
        });
    });
}

// Update the engine
function update() {
    Engine.update(engine, 1000 / 60); // Update the engine at 60 fps
}

export { initPhysics, addParticle, createGravityInversionField, createTimeDilationField, update };
