import Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/mode=imports/optimized/matter-js.js';

// A utility function to create new bodies as a result of interactions
function createNewBody(position, options) {
    return Matter.Bodies.circle(position.x, position.y, options.radius, {
        restitution: options.restitution,
        density: options.density,
        render: { fillStyle: options.color }
    });
}

// A utility function to simulate an explosion effect by creating multiple small particles
function simulateExplosion(centerPosition, world, explosionOptions) {
    const { numberOfParticles, spread, color } = explosionOptions;
    for (let i = 0; i < numberOfParticles; i++) {
        const angle = Math.random() * Math.PI * 2; // Random angle
        const radius = 3; // Fixed radius for explosion particles
        const distance = Math.random() * spread; // Random distance within the spread
        const position = {
            x: centerPosition.x + Math.cos(angle) * distance,
            y: centerPosition.y + Math.sin(angle) * distance,
        };
        const particleOptions = {
            radius: radius,
            restitution: 0.3,
            density: 0.001,
            color: color,
        };
        const particle = createNewBody(position, particleOptions);
        Matter.World.add(world, particle);
    }
}

// Define custom interactions between materials
const interactionRules = {
    'water+lava': (bodyA, bodyB, world) => {
        // Creating obsidian where water meets lava
        const obsidianOptions = { radius: 5, restitution: 0.1, density: 0.004, color: '#333' };
        const obsidian = createNewBody(bodyA.position, obsidianOptions);
        Matter.World.add(world, obsidian);
        Matter.World.remove(world, [bodyA, bodyB]);
    },
    'oil+lava': (bodyA, bodyB, world) => {
        // Creating an explosion effect where oil meets lava
        simulateExplosion(bodyA.position, world, {
            numberOfParticles: 20, // Number of particles generated in the explosion
            spread: 100, // Maximum spread of explosion particles
            color: '#FFA500', // Explosion particles color
        });
        Matter.World.remove(world, [bodyA, bodyB]);
    },
    // Additional interactions can be defined here
};

// Handling interactions based on collision events
export function handleInteractions(engine, world) {
    Matter.Events.on(engine, 'collisionStart', (event) => {
        event.pairs.forEach((pair) => {
            const bodyA = pair.bodyA;
            const bodyB = pair.bodyB;

            // Construct a key to identify the interaction
            const materials = [bodyA.materialType, bodyB.materialType].sort().join('+');
            const interactionHandler = interactionRules[materials];

            // If an interaction rule exists for these materials, execute it
            if (interactionHandler) {
                interactionHandler(bodyA, bodyB, world);
            }
        });
    });
}
