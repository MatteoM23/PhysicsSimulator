import Matter from 'https://cdn.skypack.dev/matter-js';

// A utility function to create new bodies as a result of interactions
function createNewBody(position, options) {
    return Matter.Bodies.circle(position.x, position.y, options.radius, {
        restitution: options.restitution,
        density: options.density,
        render: { fillStyle: options.color }
    });
}

// Define custom interactions between materials
const interactionRules = {
    'water+lava': (bodyA, bodyB, world) => {
        // Example of creating obsidian where water meets lava
        const obsidianOptions = { radius: 5, restitution: 0.1, density: 0.004, color: '#333' };
        const obsidian = createNewBody(bodyA.position, obsidianOptions);
        Matter.World.add(world, obsidian);

        // Remove the original particles
        Matter.World.remove(world, [bodyA, bodyB]);
    },
    'oil+lava': (bodyA, bodyB, world) => {
        // Example of creating an explosion effect where oil meets lava
        // This could be more complex, involving creating multiple small particles
        Matter.World.remove(world, [bodyA, bodyB]); // Simplified for this example
    }
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
