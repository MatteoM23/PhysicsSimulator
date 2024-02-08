// Assuming Matter.js is available globally
// Remove the import statement for Matter.js components if Matter is included via a script tag
const { Engine, World, Bodies, Events } = Matter;

// Import createMaterial from materials.js if using ES6 modules, otherwise ensure it's globally accessible
import { createMaterial } from './materials.js';

let engine;
let world;

function initPhysics() {
    engine = Engine.create();
    world = engine.world;

    // Properly access the gravity property of the engine
    engine.world.gravity.y = 1; // Set default gravity
}


function addParticle(x, y, materialType) {
    // Utilizes createMaterial from materials.js, passing in Matter.js world object
    createMaterial(x, y, materialType, world);
}

function createGravityInversionField(x, y, radius, strength) {
    Events.on(engine, 'beforeUpdate', function(event) {
        World.allBodies(world).forEach(function(body) {
            const dx = body.position.x - x;
            const dy = body.position.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < radius && !body.isStatic) {
                // Apply force in the opposite direction of gravity
                const forceMagnitude = strength * (radius - distance) / radius;
                Body.applyForce(body, body.position, {
                    x: 0, // No horizontal force
                    y: -forceMagnitude * body.mass // Upward force
                });
            }
        });
    });
}

function createTimeDilationField(x, y, radius, dilationFactor) {
    Events.on(engine, 'beforeUpdate', function(event) {
        World.allBodies(world).forEach(function(body) {
            const dx = body.position.x - x;
            const dy = body.position.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < radius && !body.isStatic) {
                // Adjust the body's time scale
                body.timeScale = dilationFactor;
            }
        });
    });
}

function update() {
    Engine.update(engine, 1000 / 60); // Ideally called within a requestAnimationFrame loop or p5.js draw function
}

// Ensure these functions are exported if using ES6 modules
export { initPhysics, addParticle, createGravityInversionField, createTimeDilationField, update };
