import Matter from 'https://cdn.skypack.dev/matter-js';

// Define new material interactions with advanced effects
export const interactionRules = (bodyA, bodyB, engine) => {
    const typeA = bodyA.material;
    const typeB = bodyB.material;
    const interactionKey = [typeA, typeB].sort().join('+');

    switch (interactionKey) {
        case 'water+lava':
            convertToSteamAndObsidian(bodyA, bodyB, engine);
            break;
        case 'ice+lava':
            convertLavaToRockRemoveIce(bodyA, bodyB, engine);
            break;
        case 'oil+lava':
            simulateExplosion(bodyA, bodyB, engine.world, 150, 0.1);
            break;
        case 'sand+water':
            createMud(bodyA, bodyB, engine);
            break;
        case 'rubber+steel':
            increaseRestitution(bodyA, bodyB);
            break;
        case 'ice+steel':
            makeSlippery(bodyA, bodyB);
            break;
        case 'glass+rock':
            shatterGlass(bodyA, bodyB, engine);
            break;
        case 'antimatter+any':
            simulateExplosion(bodyA, bodyB, engine.world, 200, 0.2);
            break;
        case 'darkMatter+any':
            gravitationalPull(bodyA, bodyB, engine);
            break;
        case 'lava+wood':
            igniteWood(bodyA, bodyB, engine);
            break;
        // Add more interaction cases as needed
    }
};

function convertToSteamAndObsidian(bodyA, bodyB, engine) {
    let waterBody = bodyA.material === 'water' ? bodyA : bodyB;
    let lavaBody = bodyA.material === 'lava' ? bodyA : bodyB;
    Matter.World.remove(engine.world, waterBody); // Remove water body to simulate steam
    lavaBody.render.fillStyle = '#555'; // Change color to represent obsidian
    lavaBody.material = 'obsidian'; // Change material type
}

function convertLavaToRockRemoveIce(bodyA, bodyB, engine) {
    let iceBody = bodyA.material === 'ice' ? bodyA : bodyB;
    let lavaBody = bodyA.material === 'lava' ? bodyA : bodyB;
    Matter.World.remove(engine.world, iceBody); // Remove ice body
    lavaBody.render.fillStyle = '#7f8c8d'; // Change color to represent rock
    lavaBody.material = 'rock'; // Change material type
}

function simulateExplosion(bodyA, bodyB, world, radius, force) {
    const explosionCenter = Matter.Vector.add(bodyA.position, bodyB.position);
    explosionCenter.x /= 2;
    explosionCenter.y /= 2;
    Matter.Composite.allBodies(world).forEach(body => {
        const dx = body.position.x - explosionCenter.x;
        const dy = body.position.y - explosionCenter.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < radius && !body.isStatic) {
            const forceMagnitude = force * (1 - distance / radius);
            Matter.Body.applyForce(body, body.position, {
                x: (dx / distance) * forceMagnitude,
                y: (dy / distance) * forceMagnitude,
            });
        }
    });
}

function createMud(bodyA, bodyB, engine) {
    const collisionPoint = Matter.Vector.add(bodyA.position, bodyB.position);
    collisionPoint.x /= 2;
    collisionPoint.y /= 2;
    const mud = Matter.Bodies.circle(collisionPoint.x, collisionPoint.y, 50, {
        isStatic: false,
        render: { fillStyle: '#70543E' },
        friction: 1.0,
        restitution: 0.1,
        density: 0.002,
    });
    Matter.World.add(engine.world, mud);
}

function increaseRestitution(bodyA, bodyB) {
    bodyA.restitution = bodyB.restitution = 0.9;
}

function makeSlippery(bodyA, bodyB) {
    bodyA.friction = bodyB.friction = 0.01;
}

function shatterGlass(bodyA, bodyB, engine) {
    const glassBody = bodyA.material === 'glass' ? bodyA : bodyB;
    Matter.World.remove(engine.world, glassBody); // Simulate glass shattering by removing it
    // Additional effect for glass shattering could be implemented here
}

function gravitationalPull(bodyA, bodyB, engine) {
    const darkMatterBody = bodyA.material === 'darkMatter' ? bodyA : bodyB;
    Matter.Composite.allBodies(engine.world).forEach(body => {
        if (body !== darkMatterBody && !body.isStatic) {
            const forceDirection = Matter.Vector.sub(darkMatterBody.position, body.position);
            const distance = Matter.Vector.magnitude(forceDirection);
            const forceMagnitude = 0.0001 * (darkMatterBody.mass * body.mass) / (distance * distance);
            Matter.Body.applyForce(body, body.position, Matter.Vector.mult(forceDirection, forceMagnitude));
        }
    });
}

function igniteWood(bodyA, bodyB, engine) {
    const woodBody = bodyA.material === 'wood' ? bodyA : bodyB;
    Matter.World.remove(engine.world, woodBody); // Simulate wood burning by removing it
    // Additional effect for burning wood could be implemented here
}

// Handling collisions and interactions
export function handleCollisions(event, engine) {
    event.pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
        interactionRules(bodyA, bodyB, engine);
        // Additional handling for specific cases like antimatter interactions can be included here
    });
}
