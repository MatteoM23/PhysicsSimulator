import { Engine, World, Bodies, Events } from 'matter-js';
import { createMaterial, materialProperties } from './materials.js';

let engine = Engine.create();
let world = engine.world;
engine.world.gravity.y = 1; // Standard gravity

function initPhysics() {
    engine = Engine.create();
    world = engine.world;

    Events.on(engine, 'collisionStart', event => {
        event.pairs.forEach(pair => {
            const { bodyA, bodyB } = pair;
            handleMaterialInteractions(bodyA, bodyB);
        });
    });
}

function handleMaterialInteractions(bodyA, bodyB) {
    if (bodyA.plugin.materialType === 'antimatter' || bodyB.plugin.materialType === 'antimatter') {
        const otherBody = bodyA.plugin.materialType === 'antimatter' ? bodyB : bodyA;
        // Add specific antimatter interaction logic here
        // For example, annihilate the other body
        World.remove(world, otherBody);
    }
    // Additional interactions can be handled here
}

function addParticle(x, y, materialType) {
    createMaterial(x, y, materialType, world);
}

function triggerExplosion(x, y) {
    // Explosion logic that creates multiple particles around (x, y)
}

function update() {
    Engine.update(engine, 1000 / 60);
}

export { initPhysics, addParticle, update, world };
