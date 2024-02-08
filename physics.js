// If Matter.js is included via a script tag, it's globally available
const { Engine, World, Bodies, Events } = Matter;

// Import the createMaterial function from materials.js
import { createMaterial } from './materials.js';

// Initialize the engine and world variables
let engine = Engine.create();
let world = engine.world;

function initPhysics() {
    engine = Engine.create();
    world = engine.world;
    engine.world.gravity.y = 1; // Set the default gravity in the Y direction
}

function addParticle(x, y, materialType) {
    console.log(`Adding particle at ${x}, ${y} of type ${materialType}`);
    createMaterial(x, y, materialType, world);
}


function createGravityInversionField(x, y, radius, strength) {
    Events.on(engine, 'beforeUpdate', function() {
        World.allBodies(world).forEach(function(body) {
            const dx = body.position.x - x;
            const dy = body.position.y - y;
            const distance = Math.sqrt(dx*dx + dy*dy);
            
            if (distance < radius && !body.isStatic) {
                // Calculate force direction and magnitude
                const forceDirection = Math.atan2(dy, dx);
                const forceMagnitude = strength * (1 - (distance / radius));
                
                // Apply a force opposite to gravity
                Body.applyForce(body, body.position, {
                    x: Math.cos(forceDirection) * forceMagnitude, 
                    y: Math.sin(forceDirection) * forceMagnitude - engine.world.gravity.y
                });
            }
        });
    });
}

function createTimeDilationField(x, y, radius, dilationFactor) {
    Events.on(engine, 'beforeUpdate', function() {
        World.allBodies(world).forEach(function(body) {
            const dx = body.position.x - x;
            const dy = body.position.y - y;
            const distance = Math.sqrt(dx*dx + dy*dy);
            
            if (distance < radius && !body.isStatic) {
                // Slow down or speed up body's time perception based on dilationFactor
                body.timeScale = dilationFactor;
            }
        });
    });
}

function update() {
    Engine.update(engine, 1000 / 60); // Update the engine at 60 fps
}

// Export functions for use in other modules
export { initPhysics, addParticle, createGravityInversionField, createTimeDilationField, update };
