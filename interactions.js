import Matter from 'https://cdn.skypack.dev/matter-js';

document.addEventListener('DOMContentLoaded', function() {
    const materials = ["Sand", "Water", "Oil", "Rock", "Lava", "Ice", "Rubber", "Steel", "Glass", "Wood", "Antimatter", "Dark Matter", "Neutronium", "Quantum Foam", "Exotic Matter", "Plasma Crystal", "Void Essence", "Ether", "Solar Flare", "Cosmic Dust", "Magnetic Field", "Photon Gel"];
    const dropdown = document.getElementById('materialDropdown');

    materials.forEach(material => {
        const link = document.createElement('a');
        link.textContent = material;
        dropdown.appendChild(link);
    });

    const toggleButton = document.getElementById('toggleMaterials');
    toggleButton.addEventListener('click', function() {
        dropdown.classList.toggle('show');
        this.querySelector('.arrow').classList.toggle('up');
        this.querySelector('.arrow').classList.toggle('down');
    });
});


// Define new material interactions with advanced effects
export const interactionRules = (bodyA, bodyB, engine) => {
    const typeA = bodyA.material;
    const typeB = bodyB.material;
    const interactionKey = [typeA, typeB].sort().join('+');

    switch (interactionKey) {
        case 'water+lava':
            convertToSteamAndObsidian(bodyA, bodyB, typeA, typeB, engine);
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
    }
};

function convertToSteamAndObsidian(bodyA, bodyB, typeA, typeB, engine) {
    // Assume bodyA is water and bodyB is lava, or vice versa
    // Implementation would remove the water body and change the material of the lava body to 'obsidian'
    let waterBody = typeA === 'water' ? bodyA : bodyB;
    let lavaBody = typeA === 'lava' ? bodyA : bodyB;

    // Convert water to steam (effectively remove or replace with steam particles)
    Matter.World.remove(engine.world, waterBody);

    // Convert lava to obsidian
    lavaBody.render.fillStyle = '#555'; // Example color for obsidian
    lavaBody.material = 'obsidian';
}

function convertLavaToRockRemoveIce(bodyA, bodyB, engine) {
    // Similar to the above, remove ice and convert lava to rock
    let iceBody = bodyA.material === 'ice' ? bodyA : bodyB;
    let lavaBody = bodyA.material === 'lava' ? bodyA : bodyB;

    Matter.World.remove(engine.world, iceBody);
    lavaBody.render.fillStyle = '#7f8c8d';
    lavaBody.material = 'rock';
}

function simulateExplosion(bodyA, bodyB, world, radius, force) {
    const explosionPoint = { x: (bodyA.position.x + bodyB.position.x) / 2, y: (bodyA.position.y + bodyB.position.y) / 2 };
    Matter.Composite.allBodies(world).forEach(body => {
        if (!body.isStatic) {
            const dx = body.position.x - explosionPoint.x;
            const dy = body.position.y - explosionPoint.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < radius) {
                const forceMagnitude = (force * (1 - distance / radius)) / distance; // Adjust for more realistic fall-off
                Matter.Body.applyForce(body, body.position, {
                    x: dx * forceMagnitude,
                    y: dy * forceMagnitude,
                });
            }
        }
    });
}




function createMud(bodyA, bodyB, engine) {
    // Determine the collision point. For simplicity, we'll just use the midpoint between the two bodies.
    const collisionPoint = {
        x: (bodyA.position.x + bodyB.position.x) / 2,
        y: (bodyA.position.y + bodyB.position.y) / 2,
    };

    // Define properties for the mud. You might want to adjust these based on your game's physics.
    const mudProperties = {
        isStatic: false, // Mud can be non-static if you want it to move or static if it should stay in place.
        render: {
            fillStyle: '#70543E', // A brown color to represent mud.
        },
        friction: 1.0, // Higher friction to simulate the sticky nature of mud.
        restitution: 0.1, // Low restitution, as mud isn't very bouncy.
        density: 0.002, // Density of mud. Adjust as necessary.
    };

    // Create a new mud body at the collision point. Adjust the size as necessary.
    const mudBody = Matter.Bodies.circle(collisionPoint.x, collisionPoint.y, 25, mudProperties);

    // Add the mud body to the world.
    Matter.World.add(engine.world, mudBody);
}


function increaseRestitution(bodyA, bodyB) {
    // Temporarily increase restitution for high bounce effects
    bodyA.restitution = 0.9;
    bodyB.restitution = 0.9;
    // Reset restitution after a short delay if needed
}

function makeSlippery(bodyA, bodyB) {
    // Reduce friction significantly to simulate a slippery surface
    bodyA.friction = 0.01;
    bodyB.friction = 0.01;
}

function shatterGlass(bodyA, bodyB, engine) {
    // Identify the glass body
    const glassBody = bodyA.material === 'glass' ? bodyA : bodyB;

    // Remove the glass body to simulate it breaking
    Matter.World.remove(engine.world, glassBody);

    // Calculate points for particles around the glass body's position
    const numberOfParticles = 3; // Adjust based on the desired effect
    for (let i = 0; i < numberOfParticles; i++) {
        const angle = (2 * Math.PI) / numberOfParticles * i;
        const radius = 5; // Small radius for glass particles
        const particlePosition = {
            x: glassBody.position.x + Math.cos(angle) * radius,
            y: glassBody.position.y + Math.sin(angle) * radius
        };

        // Define properties for glass particles
        const particleOptions = {
            isStatic: false,
            render: {
                fillStyle: '#C0C0C0' // A color to represent glass particles
            },
            friction: 0.1,
            restitution: 0.6,
            density: 0.001
        };

        // Create and add each particle to the world
        const particle = Matter.Bodies.circle(particlePosition.x, particlePosition.y, 2, particleOptions); // Small size for particles
        Matter.World.add(engine.world, particle);
    }
}


function gravitationalPull(bodyA, bodyB, engine) {
    const darkMatterBody = bodyA.material === 'darkMatter' ? bodyA : bodyB;
    Matter.Composite.allBodies(engine.world).forEach(body => {
        if (body !== darkMatterBody && !body.isStatic) {
            const dx = darkMatterBody.position.x - body.position.x;
            const dy = darkMatterBody.position.y - body.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const forceMagnitude = 0.0005 / (distance * distance); // Adjust gravitational constant as needed
            Matter.Body.applyForce(body, body.position, {
                x: dx * forceMagnitude,
                y: dy * forceMagnitude,
            });
        }
    });
}


function igniteWood(bodyA, bodyB, engine) {
    // Identify the wood body
    const woodBody = bodyA.material === 'wood' ? bodyA : bodyB;

    // Remove the wood body to simulate burning
    Matter.World.remove(engine.world, woodBody);

    // Create fire particles at the wood body's position
    const numberOfParticles = 20; // Number of fire particles
    const particles = [];

    for (let i = 0; i < numberOfParticles; i++) {
        const angle = Math.random() * 2 * Math.PI; // Random direction
        const speed = Math.random() * 0.5 + 0.5; // Random speed for more natural effect

        const particleOptions = {
            isStatic: false,
            render: {
                fillStyle: 'orange',
                opacity: 1
            },
            friction: 0.02,
            restitution: 0.5,
            density: 0.0001,
            force: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }
        };

        // Position particles slightly above the wood position for a starting effect
        const particle = Matter.Bodies.circle(woodBody.position.x, woodBody.position.y - 5, 3, particleOptions);
        particles.push(particle);
        Matter.World.add(engine.world, particle);
    }

    // Fade out and remove particles over time
    const fadeOutInterval = setInterval(() => {
        particles.forEach((particle, index) => {
            // Reduce size and opacity
            if (particle.circleRadius > 0.2) {
                particle.circleRadius *= 0.95; // Shrink
                particle.render.opacity *= 0.95; // Fade

                // Apply upward force to simulate rising
                Matter.Body.applyForce(particle, particle.position, { x: 0, y: -0.0002 });
            } else {
                // Remove particle when it's too small
                Matter.World.remove(engine.world, particle);
                particles.splice(index, 1);

                // Clear interval when all particles are removed
                if (particles.length === 0) {
                    clearInterval(fadeOutInterval);
                }
            }
        });
    }, 100); // Adjust interval timing as needed
}


function handleAntimatterInteractions(pair, engine) {
    const { bodyA, bodyB } = pair;
    let antimatterBody, otherBody;

    if (bodyA.material === 'antimatter') {
        antimatterBody = bodyA;
        otherBody = bodyB;
    } else if (bodyB.material === 'antimatter') {
        antimatterBody = bodyB;
        otherBody = bodyA;
    } else {
        return; // No antimatter involved
    }

    // Check for dark matter interaction
    if (otherBody.material === 'darkMatter') {
        simulateDarkMatterAntimatterInteraction(antimatterBody, otherBody, engine.world);
    } else if (!otherBody.isStatic) {
        // Destroy the other body, excluding walls and floors
        Matter.World.remove(engine.world, otherBody);
    }
}

function simulateDarkMatterAntimatterInteraction(antimatterBody, darkMatterBody, world) {
    // Example: Trigger a unique effect, like a significant explosion or a unique visual effect
    simulateExplosion(antimatterBody, darkMatterBody, world, 300, 0.5); // Larger radius and force for dramatic effect

    // Optionally, remove both antimatter and dark matter bodies
    Matter.World.remove(world, antimatterBody);
    Matter.World.remove(world, darkMatterBody);
}



export function handleCollisions(event, engine) {
    const pairs = event.pairs;

    pairs.forEach(pair => {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;

        // Handle general material interactions
        interactionRules(bodyA, bodyB, engine);

        // Additional handling for antimatter interactions, including special cases with dark matter
        handleAntimatterInteractions(pair, engine);
    });
}
