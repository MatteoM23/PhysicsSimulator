// Define new material interactions with advanced effects
import Matter from 'https://cdn.skypack.dev/matter-js';
import { engine } from './physicsInit.js'; // Adjust the path as necessary

const { Events, World } = Matter;



export const interactionRules = (bodyA, bodyB, engine, collisionPoint) => {
    console.log('Interaction detected between:', bodyA.material, 'and', bodyB.material); // Debug

    if (bodyA.isStatic || bodyB.isStatic || bodyA.material === bodyB.material) {
        console.log('Skipping interaction due to static bodies or identical materials.'); // Debug
        return;
    }

   
    const typeA = bodyA.material;
    const typeB = bodyB.material;
    const interactionKey = [typeA, typeB].sort().join('+');

    console.log('Processing interaction for:', interactionKey); // Debug

    switch (interactionKey) {
        case 'lava+water':
            console.log('Converting to steam and obsidian');
            convertToSteamAndObsidian(bodyA, bodyB, engine, collisionPoint);
            break;
        case 'ice+lava':
            console.log('Converting lava to rock and removing ice');
            convertLavaToRockRemoveIce(bodyA, bodyB, engine, collisionPoint);
            break;
        case 'lava+oil': // Updated to match the sorted key
            console.log('Simulating explosion and particles for oil and lava interaction');
            simulateExplosionAndParticles(engine.world, explosionForce, explosionRadius, collisionPoint);
            Matter.World.remove(engine.world, bodyA);
            Matter.World.remove(engine.world, bodyB);
            break;
        case 'glass+rock':
            console.log('Forming glassy structures');
            formGlassyStructures(bodyA, bodyB, engine, collisionPoint);
            break;
        case 'antimatter+any':
            console.log('Handling antimatter interactions');
            handleAntimatterInteractions(bodyA, bodyB, engine, collisionPoint);
            break;
        case 'lava+rubber':
            console.log('Creating fireballs and removing involved bodies');
            createFireballs(bodyA, bodyB, engine, collisionPoint);
            Matter.World.remove(engine.world, bodyA);
            Matter.World.remove(engine.world, bodyB);
            break;
        case 'ice+rock':
            console.log('Shattering ice and removing rock');
            shatterIce(bodyA, bodyB, engine, collisionPoint);
            Matter.World.remove(engine.world, bodyB);
            break;
        case 'neutronium+any':
            console.log('Creating gravity well effect');
            createGravityWellEffect(bodyA, engine, collisionPoint);
            break;
        case 'cosmicDust+voidEssence':
            console.log('Creating cosmic storm from cosmicDust and voidEssence interaction');
            createCosmicStorm(collisionPoint, engine);
            Matter.World.remove(engine.world, bodyA);
            break;
        case 'lava+wood':
            console.log('Igniting wood and removing it');
            igniteWood(bodyA, bodyB, engine, collisionPoint);
            Matter.World.remove(engine.world, bodyB);
            break;
        default:
            console.log('No specific interaction for:', interactionKey);
            break;
    }
};

let activeStorms = 0; // Track the number of active storms
const maxActiveStorms = 2; // Maximum number of simultaneous storms

function createCosmicStorm(collisionPoint, engine) {
    // Check if the number of active storms is below the maximum allowed
    if (activeStorms >= maxActiveStorms) {
        console.log("Maximum number of cosmic storms reached.");
        return; // Do not create a new storm if the maximum number is reached
    }

    activeStorms++; // Increment the count of active storms
    const stormRadius = 200; 
    const particleCount = 50; 
    const stormDuration = 3000; 

    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * stormRadius;
        const particle = Matter.Bodies.circle(
            collisionPoint.x + Math.cos(angle) * distance,
            collisionPoint.y + Math.sin(angle) * distance,
            2,
            {
                render: {
                    fillStyle: '#6c7b8b'
                },
                density: 0.001,
                frictionAir: 0.05,
                isSensor: true
            }
        );

        const forceMagnitude = 0.0001 * (Math.random() + 1);
        Matter.Body.applyForce(particle, particle.position, {
            x: Math.cos(angle) * forceMagnitude,
            y: Math.sin(angle) * forceMagnitude
        });

        Matter.World.add(engine.world, particle);

        (function(particle) {
            setTimeout(() => {
                Matter.World.remove(engine.world, particle);

                // Check if all particles of the current storm have been removed
                if (--i === 0) {
                    // Decrement the count of active storms when the last particle of a storm is removed
                    activeStorms--;
                }
            }, stormDuration);
        })(particle);
    }
}



function createGravityWellEffect(neutroniumBody, engine, collisionPoint) {
    const gravityWellRadius = 200; // Define the effective radius of the gravity well

    Matter.Events.on(engine, 'beforeUpdate', function() {
        Matter.Composite.allBodies(engine.world).forEach(function(body) {
            if (body === neutroniumBody || body.isStatic) return; // Skip the neutronium body itself and static bodies

            const dx = neutroniumBody.position.x - body.position.x;
            const dy = neutroniumBody.position.y - body.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < gravityWellRadius) {
                const forceMagnitude = 0.0005 * neutroniumBody.mass / (distance * distance);
                const force = {
                    x: (dx / distance) * forceMagnitude,
                    y: (dy / distance) * forceMagnitude,
                };

                Matter.Body.applyForce(body, body.position, force);
            }
        });
    });
}


function shatterIce(bodyA, bodyB, engine, collisionPoint) {
    let iceBody;
    
    // Check both bodies for the 'ice' material property
    if (bodyA.material === 'ice') {
        iceBody = bodyA;
    } else if (bodyB.material === 'ice') {
        iceBody = bodyB;
    }

    // Proceed only if an ice body has been identified
    if (iceBody) {
        // Verify iceBody is valid and exists in the world before attempting removal
        if (Matter.Composite.get(engine.world, iceBody.id, 'body')) {
            console.log('Ice body shattered:', iceBody);

            // Remove the ice body safely
            Matter.Composite.remove(engine.world, iceBody, true); // The true flag for deep removal

            // Simulate shattering by creating smaller ice fragments
            const numberOfFragments = 5; // Example value
            console.log('Creating ice fragments for ice body:', iceBody);

            for (let i = 0; i < numberOfFragments; i++) {
                // Calculate position and size for each fragment
                let fragment = Matter.Bodies.polygon(
                    iceBody.position.x + Math.random() * 10 - 5, // Random position near original ice body
                    iceBody.position.y + Math.random() * 10 - 5,
                    3, // Triangle fragments for example
                    5, // Size
                    {
                        render: {
                            fillStyle: iceBody.render.fillStyle
                        },
                        density: iceBody.density,
                        friction: iceBody.friction,
                        restitution: iceBody.restitution
                    }
                );

                // Add each fragment to the world
                Matter.World.add(engine.world, fragment);
            }
        } else {
            console.error('Ice body not found in world:', iceBody);
        }
    } else {
        // Log a message or handle cases where no ice body is involved in the collision
        console.log('No ice body involved in the collision.');
    }
}


function createFireballs(bodyA, bodyB, engine, collisionPoint) {
    if (!bodyA || !bodyB || !bodyA.position || !bodyB.position) {
        console.error('Invalid bodies for creating fireballs');
        return;
    }

    const midpoint = {
        x: (bodyA.position.x + bodyB.position.x) / 2,
        y: (bodyA.position.y + bodyB.position.y) / 2,
    };

    for (let i = 0; i < 1; i++) { // Create 5 fireballs as an example
        const angle = Math.random() * 2 * Math.PI; // Random angle for direction
        const speed = 0.01; // Speed of the fireballs
        const fireball = Matter.Bodies.circle(midpoint.x, midpoint.y, 3, {
            density: 0.001,
            frictionAir: 0.05,
            restitution: 0.5,
            render: { fillStyle: '#ff4500' } // Fireball color
        });

        Matter.Body.setVelocity(fireball, {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        });

        Matter.World.add(engine.world, fireball);
    }
}



function convertToSteamAndObsidian(bodyA, bodyB, engine, collisionPoint) {
    let waterBody = bodyA.material === 'water' ? bodyA : bodyB;
    let lavaBody = bodyA.material === 'lava' ? bodyA : bodyB;

    // Remove water to simulate evaporation
    Matter.World.remove(engine.world, waterBody);

    // Change color to simulate obsidian and update material property
    if (lavaBody.render) {
        lavaBody.render.fillStyle = '#504A4B'; // Dark gray color for obsidian
    }
    lavaBody.material = 'obsidian';

    // Ensure updates are applied
    Matter.Body.set(lavaBody, {
        render: lavaBody.render
    });

    // Create steam where water evaporated
    createSteamParticles(engine, waterBody.position);
}


function createSteamParticles(engine, position) {
    const numberOfParticles = 10; // Number of steam particles to create
    const upwardForceMagnitude = -0.0005; // Upward force magnitude to simulate inverted gravity

    for (let i = 0; i < numberOfParticles; i++) {
        let angle = Math.random() * Math.PI * 2;
        let radius = Math.random() * 5 + 5; // Random radius for spread
        let particle = Matter.Bodies.circle(position.x + Math.cos(angle) * radius, position.y + Math.sin(angle) * radius, 2, {
            isStatic: false,
            render: { fillStyle: '#aaa' }, // Light grey for steam
            density: 0.0005, // Lower density for a floaty effect
            isSteam: true, // Custom property to identify steam particles
        });
        Matter.World.add(engine.world, particle);
    }

    // Apply continuous upward force to steam particles
    Matter.Events.on(engine, 'beforeUpdate', function(event) {
        Matter.Composite.allBodies(engine.world).forEach(function(body) {
            if (body.isSteam) {
                Matter.Body.applyForce(body, { x: body.position.x, y: body.position.y }, { x: 0, y: upwardForceMagnitude });
            }
        });
    });
}



function convertLavaToRockRemoveIce(bodyA, bodyB, engine, collisionPoint) {
    // Determine the ice and lava bodies
    let iceBody = bodyA.material === 'ice' ? bodyA : bodyB;
    let lavaBody = bodyA.material === 'lava' ? bodyA : bodyB;

    // Remove ice body and convert lava to rock gradually
    Matter.World.remove(engine.world, iceBody);
    lavaBody.render.fillStyle = '#7f8c8d'; // Initial color change to simulate cooling
    lavaBody.material = 'rock';

    // Fade out effect for lava
    let fadeOutInterval = setInterval(() => {
        let currentColor = hexToRgb(lavaBody.render.fillStyle);
        if (currentColor.g < 140) {
            lavaBody.render.fillStyle = `rgb(${currentColor.r}, ${currentColor.g + 5}, ${currentColor.b + 5})`; // Gradually change color
        } else {
            clearInterval(fadeOutInterval); // Stop fading when color reaches a certain point
        }
    }, 100);

    // Generate water particles for the ice melting
    createWaterParticles(collisionPoint, engine.world);

    // Create bubble particles to simulate evaporation
    createBubbleParticles(collisionPoint, engine.world);
}

// Helper function to convert HEX color to RGB
function hexToRgb(hex) {
    let r = 0, g = 0, b = 0;
    if (hex.length == 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }
    return { r, g, b };
}

function createWaterParticles(position, world) {
    for (let i = 0; i < 10; i++) {
        const particle = Matter.Bodies.circle(position.x + (Math.random() - 0.5) * 10, position.y + (Math.random() - 0.5) * 10, 5, {
            render: { fillStyle: '#3498db' },
            isSensor: true,
        });
        Matter.World.add(world, particle);
    }
}

function createBubbleParticles(position, world) {
    for (let i = 0; i < 5; i++) {
        const bubble = Matter.Bodies.circle(position.x + (Math.random() - 0.5) * 20, position.y + (Math.random() - 0.5) * 20, 3, {
            render: { fillStyle: 'transparent', strokeStyle: '#FFFFFF', lineWidth: 1 },
            isSensor: true,
        });
        Matter.World.add(world, bubble);
    }
}

const explosionForce = 0.03; // A balanced value for significant yet manageable explosions.
const explosionRadius = 100; // A moderate radius to simulate the explosion's extensive impact.

function simulateExplosionAndParticles(engine, explosionForce, explosionRadius, collisionPoint) {
    // Ensure that 'engine' is the current instance of Matter.Engine where your bodies exist
    const allBodies = Matter.Composite.allBodies(engine.world);

    allBodies.forEach(body => {
        // Calculate distance between the body and the collision point
        const dx = body.position.x - collisionPoint.x;
        const dy = body.position.y - collisionPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < explosionRadius && !body.isStatic) {
            // Calculate the direction of the force
            const forceDirection = Matter.Vector.normalise({ x: dx, y: dy });
            const forceMagnitude = explosionForce / (distance || 1);
            const force = Matter.Vector.mult(forceDirection, forceMagnitude);

            // Apply the force to the body
            Matter.Body.applyForce(body, body.position, force);
        }
    });

    // Debug: Log the action
    console.log('Explosion simulated at', collisionPoint, 'with force', explosionForce, 'affecting', allBodies.length, 'bodies');
}


    // Create and schedule removal of explosion particles
    const numberOfParticles = 30;
    for (let i = 0; i < numberOfParticles; i++) {
        let angle = Math.random() * 2 * Math.PI;
        let distance = Math.random() * explosionRadius * 0.5;
        let particle = Matter.Bodies.circle(
            collisionPoint.x + Math.cos(angle) * distance, 
            collisionPoint.y + Math.sin(angle) * distance, 
            2, {
                render: { fillStyle: '#ff0' },
                isSensor: true,
            }
        );

        const particleForceMagnitude = Math.random() * 0.005 + 0.002;
        Matter.Body.applyForce(particle, particle.position, {
            x: Math.cos(angle) * particleForceMagnitude,
            y: Math.sin(angle) * particleForceMagnitude,
        });

        Matter.World.add(world, particle);

        // Schedule particle removal after 2 seconds
        setTimeout(() => {
            Matter.World.remove(world, particle);
        }, 2000); // 2000 milliseconds = 2 seconds
    }



function igniteWood(bodyA, bodyB, engine, collisionPoint) {
    // Determine which body is wood
    const woodBody = bodyA.material === 'wood' ? bodyA : bodyB;

    // Remove the wood body to simulate burning
    Matter.World.remove(engine.world, woodBody);

    // Create fire particles at the wood body's last position
    const numberOfParticles = 4;
    const particles = []; // Store created fire particles for tracking
    for (let i = 0; i < numberOfParticles; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const speed = 0.01; // Speed of the fire particles
        const fireParticle = Matter.Bodies.circle(woodBody.position.x, woodBody.position.y, 3, {
            render: { fillStyle: 'orange', opacity: 1 }, // Initialize opacity for fade out
            density: 0.001,
            frictionAir: 0.05,
            restitution: 0.5,
            circleRadius: 3, // Initial radius, needed for shrinking
        });

        Matter.Body.setVelocity(fireParticle, {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        });

        particles.push(fireParticle); // Add to tracking array
        Matter.World.add(engine.world, fireParticle);
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


function handleAntimatterInteractions(bodyA, bodyB, engine, collisionPoint) {
    const antimatterBody = bodyA.material === 'antimatter' ? bodyA : bodyB.material === 'antimatter' ? bodyB : null;
    const otherBody = antimatterBody === bodyA ? bodyB : bodyA;

    if (!antimatterBody) return; // No antimatter involved

    if (otherBody.material === 'darkMatter') {
        console.log('Antimatter and dark matter interaction detected.');
        simulateDarkMatterAntimatterInteraction(antimatterBody, otherBody, engine.world, collisionPoint);
    } else if (!otherBody.isStatic) {
        // Destroy the other body, excluding walls and floors
        Matter.World.remove(engine.world, otherBody);
    }
}


function simulateDarkMatterAntimatterInteraction(antimatterBody, darkMatterBody, world, collisionPoint) {
    // Trigger a significant explosion effect with a larger radius and force for dramatic impact
    simulateExplosion(antimatterBody, darkMatterBody, world, 300, 0.5);

    // Remove both antimatter and dark matter bodies from the simulation
    Matter.World.remove(world, antimatterBody);
    Matter.World.remove(world, darkMatterBody);
}

function increaseIceSize(bodyA, bodyB, collisionPoint) {
    // Identify the ice body and increase its size
    const iceBody = bodyA.material === 'ice' ? bodyA : bodyB;
    iceBody.circleRadius += 5; // Adjust the size increment as needed
}


function fadeOutAndRemoveBody(engine, body, fadeDuration, startDelay = 0, collisionPoint) {
    setTimeout(() => {
        let opacity = 1; // Start with full opacity
        const intervalTime = 100; // Interval time in ms for opacity reduction
        const steps = fadeDuration / intervalTime;
        let currentStep = 0;

        const fadeInterval = setInterval(() => {
            opacity = 1 - (++currentStep / steps);
            if (body.render) {
                body.render.opacity = opacity > 0 ? opacity : 0;
            }
            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                Matter.World.remove(engine.world, body);
            }
        }, intervalTime);
    }, startDelay);
}


function formGlassyStructures(bodyA, bodyB, engine, collisionPoint) {
    // Create glassy structures at the collision point to simulate formation of glass
    const numberOfParticles = 5;
    const glassColor = '#FFFFFF'; // Color representing glass

    // Add debug statement
    console.log('Creating glassy structures at collision point:', collisionPoint);

    for (let i = 0; i < numberOfParticles; i++) {
        const distance = Math.random() * 30 + 20;
        const angle = Math.random() * Math.PI * 2;
        const position = { x: collisionPoint.x + Math.cos(angle) * distance, y: collisionPoint.y + Math.sin(angle) * distance };
        const particle = Matter.Bodies.rectangle(position.x, position.y, 10, 10, {
            isStatic: false,
            render: { fillStyle: glassColor, opacity: 0.7 },
            friction: 0.2,
            restitution: 0.5,
            density: 0.001,
        });
        Matter.World.add(engine.world, particle);
    }
}


/**
 * Handles collision events by processing each pair of colliding bodies.
 * @param {Matter.IEventCollision<Matter.Engine>} event - The collision event object from Matter.js.
 */
export function handleCollisions(event) {
    // Destructure pairs from the event, ensuring a fallback empty array if undefined
    const { pairs = [] } = event;

    // Iterate over each pair to process interactions
    pairs.forEach(({ bodyA, bodyB }) => {
        // Calculate the collision point as the midpoint between the positions of bodyA and bodyB
        const collisionPoint = {
            x: (bodyA.position.x + bodyB.position.x) / 2,
            y: (bodyA.position.y + bodyB.position.y) / 2,
        };

        // Invoke the interaction rules with the colliding bodies, the engine, and the collision point
        interactionRules(bodyA, bodyB, Matter.Engine, collisionPoint);
    });
}


// Assuming 'engine' is your Matter.Engine instance
Matter.Events.on(engine, 'collisionStart', handleCollisions);


