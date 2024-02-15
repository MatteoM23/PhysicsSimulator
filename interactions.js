import Matter from 'https://cdn.skypack.dev/matter-js';

// Revised interaction rules with Matter.js integration
export const interactionRules = (bodyA, bodyB, engine) => {
    const typeA = bodyA.material;
    const typeB = bodyB.material;
    const interactionKey = [typeA, typeB].sort().join('+');

    switch (interactionKey) {
        case 'water+lava':
            // Steam effect: convert water into steam
            if (typeA === 'water') {
                bodyA.render.fillStyle = '#CCCCCC'; // Change color to simulate steam
                Matter.Body.applyForce(bodyA, bodyA.position, { x: 0, y: -0.05 }); // Simulate upward force
            } else {
                bodyB.render.fillStyle = '#CCCCCC';
                Matter.Body.applyForce(bodyB, bodyB.position, { x: 0, y: -0.05 });
            }
            break;
        case 'ice+lava':
            // Cooling effect: convert lava into rock
            if (typeA === 'lava') {
                bodyA.render.fillStyle = '#7f8c8d'; // Change color to gray for rock
            } else {
                bodyB.render.fillStyle = '#7f8c8d';
            }
            break;
        case 'oil+lava':
            simulateExplosion(bodyA, bodyB, engine.world);
            break;
    }
};

function simulateExplosion(bodyA, bodyB, world) {
    const explosionCenter = {
        x: (bodyA.position.x + bodyB.position.x) / 2,
        y: (bodyA.position.y + bodyB.position.y) / 2,
    };
    const explosionRadius = 100; // Define the radius of the explosion effect
    const explosionForce = 0.05; // Define the strength of the explosion

    Matter.Composite.allBodies(world).forEach(body => {
        if (body.isStatic) return; // Ignore static bodies

        const dx = body.position.x - explosionCenter.x;
        const dy = body.position.y - explosionCenter.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < explosionRadius) {
            const forceMagnitude = explosionForce * (1 - distance / explosionRadius);
            const forceDirection = { x: dx / distance, y: dy / distance };
            Matter.Body.applyForce(body, body.position, {
                x: forceDirection.x * forceMagnitude,
                y: forceDirection.y * forceMagnitude,
            });
        }
    });

    // Optionally remove the interacting bodies to simulate consumption in the explosion
    Matter.World.remove(world, [bodyA, bodyB]);
}

// Example of integrating interactionRules within the Matter.js collision event handling
export function handleCollisions(event, engine) {
    const pairs = event.pairs;
    
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;
        
        interactionRules(bodyA, bodyB, engine);
    }
}

// The areParticlesColliding function is not needed when using Matter.js collision events
