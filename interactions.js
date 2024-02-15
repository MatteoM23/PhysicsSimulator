import Matter from 'https://cdn.skypack.dev/matter-js';

// Revised interaction rules with Matter.js integration, including antimatter and dark matter
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
            Matter.World.remove(engine.world, [typeA === 'water' ? bodyA : bodyB]); // Remove the water body
            break;
        case 'ice+lava':
            // Cooling effect: convert lava into rock
            if (typeA === 'lava') {
                bodyA.render.fillStyle = '#7f8c8d'; // Change color to gray for rock
            } else {
                bodyB.render.fillStyle = '#7f8c8d';
            }
            Matter.World.remove(engine.world, [typeA === 'ice' ? bodyA : bodyB]); // Remove the ice body
            break;
        case 'oil+lava':
            simulateExplosion(bodyA, bodyB, engine.world);
            break;
        case 'antimatter+any':
            // Antimatter interacts with any matter (excluding dark matter directly handled below)
            if (typeA === 'antimatter' || typeB === 'antimatter') {
                simulateAnnihilation(engine.world, bodyA, bodyB);
            }
            break;
        case 'antimatter+darkMatter':
            // Special interaction: Antimatter and Dark Matter neutralize each other
            Matter.World.remove(engine.world, [bodyA, bodyB]);
            break;
    }
};

function simulateExplosion(bodyA, bodyB, world) {
    const explosionCenter = {
        x: (bodyA.position.x + bodyB.position.x) / 2,
        y: (bodyA.position.y + bodyB.position.y) / 2,
    };
    const explosionRadius = 100;
    const explosionForce = 0.05;

    Matter.Composite.allBodies(world).forEach(body => {
        if (!body.isStatic && body !== bodyA && body !== bodyB) { // Exclude the interacting bodies
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
        }
    });

    Matter.World.remove(world, [bodyA, bodyB]);
}

function simulateAnnihilation(world, bodyA, bodyB) {
    // Check if either body is static, and if so, do not remove
    if (!bodyA.isStatic && !bodyB.isStatic) {
        Matter.World.remove(world, [bodyA, bodyB]);
    } else {
        // If one of the bodies is static, only remove the non-static body (antimatter)
        if (bodyA.isStatic) {
            Matter.World.remove(world, bodyB);
        } else if (bodyB.isStatic) {
            Matter.World.remove(world, bodyA);
        }
    }
}


export function handleCollisions(event, engine) {
    const pairs = event.pairs;

    pairs.forEach(pair => {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;
        const types = [bodyA.material, bodyB.material];

        // Special case for antimatter with any type except dark matter handled in the switch
        if (types.includes('antimatter') && !types.every(type => type === 'antimatter' || type === 'darkMatter')) {
            simulateAnnihilation(engine.world, bodyA, bodyB);
        } else {
            interactionRules(bodyA, bodyB, engine);
        }
    });
}
