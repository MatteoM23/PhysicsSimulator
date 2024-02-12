import Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/mode=imports/optimized/matter-js.js';

export function createNewBody(position, radius, options) {
    const defaults = {
        restitution: 0.9,
        density: 0.001,
        friction: 0.1,
    };
    const bodyOptions = { ...defaults, ...options, render: { ...options.render } };

    // Explicitly pass radius to Matter.Bodies.circle
    return Matter.Bodies.circle(position.x, position.y, radius, bodyOptions);
}

export function simulateExplosion(centerPosition, world, explosionOptions) {
    const { numberOfParticles, spread, color, forceScale } = explosionOptions;
    for (let i = 0; i < numberOfParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 2 + 2; // Random radius for variability
        const distance = Math.random() * spread;
        const position = {
            x: centerPosition.x + Math.cos(angle) * distance,
            y: centerPosition.y + Math.sin(angle) * distance,
        };
        const forceMagnitude = Math.random() * forceScale;
        const forceDirection = { x: Math.cos(angle) * forceMagnitude, y: Math.sin(angle) * forceMagnitude };

        const particleOptions = {
            radius: radius,
            restitution: 0.6 + Math.random() * 0.2, // Slightly bouncy
            density: 0.001,
            render: {
                fillStyle: color,
                strokeStyle: 'yellow',
                lineWidth: 1,
            },
        };
        const particle = createNewBody(position, radius, particleOptions);
        Matter.World.add(world, particle);

        // Apply an initial force to each particle to simulate explosion effect
        Matter.Body.applyForce(particle, position, forceDirection);

        // Gradually fade out the particle
        Matter.Events.on(world.engine, 'beforeUpdate', function fadeOut() {
            if (particle.render.opacity > 0) {
                particle.render.opacity -= 0.005; // Adjust fade speed as needed
            } else {
                Matter.World.remove(world, particle);
                Matter.Events.off(world.engine, 'beforeUpdate', fadeOut);
            }
        });
    }
}

const interactionRules = {
    // Interaction rule for oil + lava
    'oil+lava': (bodyA, bodyB, world) => {
        simulateExplosion(bodyA.position, world, {
            numberOfParticles: 50, // More particles for a cooler effect
            spread: 100, // Larger spread
            color: '#FFA500', // Fiery color
            forceScale: 0.005, // Scale of the initial force applied to particles
        });
        Matter.World.remove(world, [bodyA, bodyB]);
    },
    // Interaction rule for water + lava (produces stone)
    'water+lava': (bodyA, bodyB, world) => {
        simulateExplosion(bodyA.position, world, {
            numberOfParticles: 30, // Number of stone particles
            spread: 50, // Spread of stone particles
            color: '#808080', // Stone color
            forceScale: 0.002, // Scale of the initial force applied to particles
        });
        Matter.World.remove(world, [bodyA, bodyB]);
    },
    // Interaction rule for lava + water (produces obsidian)
    'lava+water': (bodyA, bodyB, world) => {
        simulateExplosion(bodyA.position, world, {
            numberOfParticles: 20, // Number of obsidian particles
            spread: 40, // Spread of obsidian particles
            color: '#333', // Obsidian color
            forceScale: 0.003, // Scale of the initial force applied to particles
        });
        Matter.World.remove(world, [bodyA, bodyB]);
    },
};

export function handleInteractions(engine, world) {
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

