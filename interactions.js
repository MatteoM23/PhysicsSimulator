p// Import Matter.js from a CDN
import Matter, * as MatterImports from '/-/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/dist=es2020,mode=imports/optimized/matter-js.js';

// Function to create a new body with given properties
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

// Function to simulate an explosion
export function simulateExplosion(centerPosition, world, explosionOptions) {
    const { numberOfParticles, spread, color, forceScale } = explosionOptions;

    for (let i = 0; i < numberOfParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 2 + 2;
        const distance = Math.random() * spread;
        const forceMagnitude = Math.random() * forceScale;
        const forceDirection = { x: Math.cos(angle) * forceMagnitude, y: Math.sin(angle) * forceMagnitude };

        const particleOptions = {
            radius: radius,
            restitution: 0.6 + Math.random() * 0.2,
            density: 0.001,
            render: {
                fillStyle: color,
                strokeStyle: 'yellow',
                lineWidth: 1,
            },
        };

        const particle = createNewBody(
            { x: centerPosition.x + Math.cos(angle) * distance, y: centerPosition.y + Math.sin(angle) * distance },
            radius,
            particleOptions
        );

        Matter.World.add(world, particle);
        Matter.Body.applyForce(particle, particle.position, forceDirection);

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

// Interaction rules for different material combinations
export const interactionRules = {
    // Interaction rule for oil + lava (simulated explosion)
    'oil+lava': (bodyA, bodyB, world) => {
        simulateExplosion(bodyA.position, world, {
            numberOfParticles: 50,
            spread: 100,
            color: '#FFA500',
            forceScale: 0.005,
        });
        Matter.World.remove(world, [bodyA, bodyB]);
    },
    // Interaction rule for water + lava (produces obsidian)
    'water+lava': (bodyA, bodyB, world) => {
        const centerPosition = {
            x: (bodyA.position.x + bodyB.position.x) / 2,
            y: (bodyA.position.y + bodyB.position.y) / 2,
        };
        const obsidianOptions = {
            restitution: 0.1,
            density: 0.004,
            friction: 0.6,
            render: {
                fillStyle: '#808080',
            },
        };
        const obsidian = createNewBody(centerPosition, 10, obsidianOptions);
        Matter.World.add(world, obsidian);
        Matter.World.remove(world, [bodyA, bodyB]);
    },
    // Interaction rule for lava + water (produces stone)
    'lava+water': (bodyA, bodyB, world) => {
        const centerPosition = {
            x: (bodyA.position.x + bodyB.position.x) / 2,
            y: (bodyA.position.y + bodyB.position.y) / 2,
        };
        const stoneOptions = {
            restitution: 0.1,
            density: 0.004,
            friction: 0.6,
            render: {
                fillStyle: '#333',
            },
        };
        const stone = createNewBody(centerPosition, 10, stoneOptions);
        Matter.World.add(world, stone);
        Matter.World.remove(world, [bodyA, bodyB]);
    },
    // Add more interaction rules for other material combinations here
};

// Function to handle interactions between bodies
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
