import Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/mode=imports/optimized/matter-js.js';

export function createNewBody(position, options) {
    return Matter.Bodies.circle(position.x, position.y, options.radius, {
        restitution: options.restitution,
        density: options.density,
        render: { fillStyle: options.color }
    });
}

export function simulateExplosion(centerPosition, world, explosionOptions) {
    const { numberOfParticles, spread, color } = explosionOptions;
    for (let i = 0; i < numberOfParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 3;
        const distance = Math.random() * spread;
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

const interactionRules = {
    'water+lava': (bodyA, bodyB, world) => {
        const obsidianOptions = { radius: 5, restitution: 0.1, density: 0.004, color: '#333' };
        const obsidian = createNewBody(bodyA.position, obsidianOptions);
        Matter.World.add(world, obsidian);
        Matter.World.remove(world, [bodyA, bodyB]);
    },
    'oil+lava': (bodyA, bodyB, world) => {
        simulateExplosion(bodyA.position, world, {
            numberOfParticles: 20,
            spread: 100,
            color: '#FFA500',
        });
        Matter.World.remove(world, [bodyA, bodyB]);
    },
    // Define more interactions here as needed
};

export function handleInteractions(engine, world) {
    Matter.Events.on(engine, 'collisionStart', (event) => {
        event.pairs.forEach((pair) => {
            const bodyA = pair.bodyA;
            const bodyB = pair.bodyB;
            // Ensure your bodies have labels that match keys in interactionRules
            const materials = [bodyA.label, bodyB.label].sort().join('+');
            const interactionHandler = interactionRules[materials];
            if (interactionHandler) {
                interactionHandler(bodyA, bodyB, world);
            }
        });
    });
}
