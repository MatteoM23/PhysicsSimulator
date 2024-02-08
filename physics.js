// Import necessary components from Matter.js
import { Engine, World, Bodies, Events, Body } from 'matter-js';
import { createMaterial } from './materials.js';

let engine, world;

function initPhysics() {
    engine = Engine.create();
    world = engine.world;
    engine.world.gravity.y = 1; // Set gravity for the simulation

    // Setup advanced collision handling
    setupCollisionHandling();
}

function addParticle(x, y, materialType) {
    createMaterial(x, y, materialType, world);
}

function setupCollisionHandling() {
    Events.on(engine, 'collisionStart', function(event) {
        event.pairs.forEach(pair => {
            const { bodyA, bodyB } = pair;
            // Example for specific interactions, such as explosion on lava and oil collision
            if ((bodyA.plugin && bodyA.plugin.materialType === 'lava' && bodyB.plugin && bodyB.plugin.materialType === 'oil') ||
                (bodyA.plugin && bodyA.plugin.materialType === 'oil' && bodyB.plugin && bodyB.plugin.materialType === 'lava')) {
                triggerExplosion(bodyA.position.x, bodyA.position.y);
            }
            // Implement more interactions as required
        });
    });
}

function triggerExplosion(x, y) {
    for (let i = 0; i < 20; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const speed = Math.random() * 5 + 5; // Adjust speed for visual effect
        let particle = Bodies.circle(x, y, 2, {
            density: 0.0005,
            frictionAir: 0.05,
            restitution: 0.9,
            render: { fillStyle: '#ff4136' }
        });
        Body.setVelocity(particle, { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed });
        World.add(world, particle);
    }
}

function update() {
    Engine.update(engine, 1000 / 60); // Update the engine at 60 fps
}

export { initPhysics, addParticle, update, triggerExplosion, engine, world };
