// Import Matter.js directly without using a CDN
import * as Matter from 'matter-js';

// Define constants for interaction colors
const INTERACTION_COLORS = {
    'oil+lava': '#FFA500',  // Fiery color
    'water+lava': '#808080', // Stone color
    'lava+water': '#333',    // Obsidian color
};

// Define a function to handle interactions
function handleInteractions(engine, world) {
    const interactionsHandled = new Set(); // Keep track of handled interactions

    Matter.Events.on(engine, 'collisionStart', (event) => {
        event.pairs.forEach((pair) => {
            const bodyA = pair.bodyA;
            const bodyB = pair.bodyB;
            const materials = [bodyA.label, bodyB.label].sort().join('+');

            // Check if the interaction has already been handled
            if (!interactionsHandled.has(materials)) {
                const interactionHandler = interactionRules[materials];
                if (interactionHandler) {
                    interactionHandler(bodyA, bodyB, world);
                    interactionsHandled.add(materials);
                }
            }
        });
    });

    // Clear handled interactions on collision end
    Matter.Events.on(engine, 'collisionEnd', (event) => {
        event.pairs.forEach((pair) => {
            const bodyA = pair.bodyA;
            const bodyB = pair.bodyB;
            const materials = [bodyA.label, bodyB.label].sort().join('+');

            // Remove interaction from handled set if both bodies are still present
            if (world.bodies.includes(bodyA) && world.bodies.includes(bodyB)) {
                interactionsHandled.delete(materials);
            }
        });
    });
}

// Define a function to simulate explosions and handle interactions
function simulateExplosion(centerPosition, world, explosionOptions) {
    const { numberOfParticles, spread, color, forceScale } = explosionOptions;

    for (let i = 0; i < numberOfParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 2 + 2;
        const distance = Math.random() * spread;
        const forceMagnitude = Math.random() * forceScale;
        const forceDirection = { x: Math.cos(angle) * forceMagnitude, y: Math.sin(angle) * forceMagnitude };

        const particle = Matter.Bodies.circle(centerPosition.x + Math.cos(angle) * distance, centerPosition.y + Math.sin(angle) * distance, radius, {
            restitution: 0.6 + Math.random() * 0.2,
            density: 0.001,
            render: {
                fillStyle: color,
                strokeStyle: 'yellow',
                lineWidth: 1,
            },
        });

        Matter.World.add(world, particle);
        Matter.Body.applyForce(particle, particle.position, forceDirection);

        // Handle interactions between particles and existing bodies
        Matter.Events.on(world, 'collisionStart', (event) => {
            event.pairs.forEach((pair) => {
                const bodyA = pair.bodyA;
                const bodyB = pair.bodyB;

                // Check for interactions between particles and other bodies
                if ((bodyA === particle && bodyB !== particle) || (bodyA !== particle && bodyB === particle)) {
                    const materials = [bodyA.label, bodyB.label].sort().join('+');
                    const interactionHandler = interactionRules[materials];
                    if (interactionHandler) {
                        interactionHandler(bodyA, bodyB, world);
                    }
                }
            });
        });

        Matter.Events.on(world.engine, 'beforeUpdate', function fadeOut() {
            if (particle.render.opacity > 0) {
                particle.render.opacity -= 0.005;
            } else {
                Matter.World.remove(world, particle);
                Matter.Events.off(world.engine, 'beforeUpdate', fadeOut);
            }
        });
    }
}

