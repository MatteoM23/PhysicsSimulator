// Define new material interactions with advanced effects
import Matter from 'https://cdn.skypack.dev/matter-js';


export const interactionRules = (bodyA, bodyB, engine, collisionPoint) => {
    console.log('Interaction detected between:', bodyA.material, 'and', bodyB.material); // Debug

    if (bodyA.isStatic || bodyB.isStatic || bodyA.material === bodyB.material) {
        console.log('Skipping interaction due to static bodies or identical materials.'); // Debug
        return;
    }

    const explosionForce = 0.03; // A balanced value for significant yet manageable explosions.
    const explosionRadius = 100; // A moderate radius to simulate the explosion's extensive impact.
    const typeA = bodyA.material;
    const typeB = bodyB.material;
    const interactionKey = [typeA, typeB].sort().join('+');

    console.log('Processing interaction for:', interactionKey); // Debug

    switch (interactionKey) {
        case 'water+lava':
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
        case 'voidEssence+cosmicDust':
            console.log('Creating cosmic storm');
            createCosmicStorm(collisionPoint, engine);
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

    Matter.World.remove(engine.world, waterBody); // Remove water to simulate evaporation

    lavaBody.render.fillStyle = '#504A4B'; // Change color to simulate obsidian
    lavaBody.material = 'obsidian';

    createSteamParticles(engine, waterBody.position); // Create steam where water evaporated
}


function createSteamParticles(engine, position, collisionPoint) {
    const numberOfParticles = 10; // Number of steam particles to create
    const upwardForceMagnitude = -0.0005; // Negative force to simulate rising

    for (let i = 0; i < numberOfParticles; i++) {
        let angle = Math.random() * Math.PI * 2;
        let radius = Math.random() * 5 + 5; // Random radius for spread
        let particle = Matter.Bodies.circle(position.x + Math.cos(angle) * radius, position.y + Math.sin(angle) * radius, 2, {
            isStatic: false,
            render: { fillStyle: '#aaa' }, // Light grey for steam
            density: 0.0005, // Lower density for a floaty effect
        });
        Matter.World.add(engine.world, particle);

        // Apply an upward force to simulate steam rising
        Matter.Body.applyForce(particle, particle.position, { x: 0, y: upwardForceMagnitude });
    }
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
    const numberOfParticles = 10; // Adjust based on desired effect
    for (let i = 0; i < numberOfParticles; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const speed = Math.random() * 0.05 + 0.05; // Randomize for more natural effect
        const waterParticle = Matter.Bodies.circle(position.x, position.y, 2, {
            render: { fillStyle: 'blue' },
            frictionAir: 0.01,
            restitution: 0.5,
        });

        Matter.Body.setVelocity(waterParticle, {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        });

        Matter.World.add(world, waterParticle);
    }
}

function createBubbleParticles(position, world) {
    const numberOfBubbles = 5; // Adjust for desired amount of bubbles
    for (let i = 0; i < numberOfBubbles; i++) {
        const bubble = Matter.Bodies.circle(position.x, position.y, 3, {
            render: {
                strokeStyle: '#FFFFFF', // White outline for bubbles
                lineWidth: 1, // Thin outline to simulate bubble's edge
                fillStyle: 'transparent' // Clear center
            },
            isSensor: true, // Make bubbles non-collidable
            frictionAir: 0.01,
            density: 0.001,
        });

        // Apply a small upward force to simulate rising bubbles
        Matter.Body.applyForce(bubble, bubble.position, { x: 0, y: -0.0002 });

        Matter.World.add(world, bubble);
    }
}


function simulateExplosionAndParticles(world, explosionForce, explosionRadius, collisionPoint) {
    console.log(`simulateExplosionAndParticles called with explosionForce: ${explosionForce}, explosionRadius: ${explosionRadius}, collisionPoint:`, collisionPoint); // Debug
    // Find all bodies within the explosion radius
    Matter.Composite.allBodies(world).forEach(body => {
        const distance = Matter.Vector.magnitude(Matter.Vector.sub(body.position, collisionPoint));
        if (distance > 0 && distance < explosionRadius) {
            const intensity = Math.max(0, (explosionRadius - distance) / explosionRadius);
            const forceMagnitude = explosionForce * intensity;
            const forceDirection = Matter.Vector.normalise(Matter.Vector.sub(body.position, collisionPoint));
            const force = Matter.Vector.mult(forceDirection, forceMagnitude);
            Matter.Body.applyForce(body, body.position, force);
        }
    });

    // Create explosion particles
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

        const forceMagnitude = Math.random() * 0.005 + 0.002; // Slightly increased for visual effect
        Matter.Body.applyForce(particle, particle.position, {
            x: Math.cos(angle) * forceMagnitude,
            y: Math.sin(angle) * forceMagnitude,
        });

        Matter.World.add(world, particle);
    }
}




function increaseRestitution(bodyA, bodyB, collisionPoint) {
    // Temporarily increase restitution for high bounce effects
    bodyA.restitution = 0.9;
    bodyB.restitution = 0.9;
    // Reset restitution after a short delay if needed
}

function makeSlippery(bodyA, bodyB, collisionPoint) {
    // Reduce friction significantly to simulate a slippery surface
    bodyA.friction = 0.01;
    bodyB.friction = 0.01;
}


function gravitationalPull(bodyA, bodyB, engine, collisionPoint) {
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


function handleAntimatterInteractions(pair, engine, collisionPoint) {
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

function createOilSlickAndDisappear(engine, collisionPoint) {
    const numberOfParticles = 3; // Number of oil particles to create
    const slickColor = '#8B4513'; // Color representing oil
    const particleFadeDelay = 60000; // Delay in milliseconds (1 minute) before starting to fade out particles

    for (let i = 0; i < numberOfParticles; i++) {
        const offset = { x: Math.random() * 20 - 10, y: Math.random() * 20 - 10 };
        const particle = Matter.Bodies.circle(collisionPoint.x + offset.x, collisionPoint.y + offset.y, 3, {
            isStatic: false,
            render: { fillStyle: slickColor, opacity: 1 },
            density: 0.0008,
            friction: 0.01,
            restitution: 0.5,
        });
        Matter.World.add(engine.world, particle);

        // Set a timeout to delay the start of the fade-out process
        setTimeout(() => {
            // Function to gradually fade out the particle
            const fadeOutParticle = (particle, duration) => {
                let opacity = 1; // Start with full opacity
                const intervalTime = 100; // Interval time in ms for opacity reduction
                const interval = setInterval(() => {
                    opacity -= intervalTime / duration;
                    particle.render.opacity = opacity;

                    if (opacity <= 0) {
                        clearInterval(interval);
                        Matter.World.remove(engine.world, particle);
                    }
                }, intervalTime);
            };

            // Call the fade out function for each particle after the delay
            fadeOutParticle(particle, 3000); // Fade out over 3 seconds
        }, particleFadeDelay);
    }
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



function createSplashOrWaves(engine, collisionPoint) {
    // Simulate water splash or waves at the collision point with a series of particles
    const numberOfParticles = 10;
    const splashColor = 'blue'; // Blue color representing water

    for (let i = 0; i < numberOfParticles; i++) {
        const offset = { x: Math.random() * 20 - 10, y: Math.random() * 20 - 10 };
        const particle = Matter.Bodies.circle(collisionPoint.x + offset.x, collisionPoint.y + offset.y, 3, {
            isStatic: true,
            render: { fillStyle: splashColor },
        });
        Matter.World.add(engine.world, particle);
    }
}

function absorbWater(bodyA, bodyB, collisionPoint) {
    // Simulate water absorption by changing the wood body's appearance and properties
    const woodBody = bodyA.material === 'wood' ? bodyA : bodyB;
    woodBody.render.fillStyle = '#8B4513'; // Darken color to represent wet wood
    woodBody.density += 0.1; // Increase density to simulate water absorption
    woodBody.friction *= 0.8; // Reduce friction to simulate a waterlogged surface
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


function createExplosionOrImplosion(engine, collisionPoint) {
    // Trigger an explosion or implosion effect by applying forces to nearby bodies
    const explosionRadius = 100;
    const explosionForce = 0.1;

    Matter.Composite.allBodies(engine.world).forEach(body => {
        const distance = Matter.Vector.magnitude(Matter.Vector.sub(body.position, collisionPoint));
        if (distance < explosionRadius && !body.isStatic) {
            const forceMagnitude = explosionForce * (1 - distance / explosionRadius);
            Matter.Body.applyForce(body, body.position, Matter.Vector.mult(Matter.Vector.normalise(Matter.Vector.sub(body.position, collisionPoint)), forceMagnitude));
        }
    });
}

function createGravitationalDistortion(engine, collisionPoint) {
    // Simulate gravitational distortion by applying forces to nearby bodies to simulate attraction
    const distortionRadius = 200;
    const distortionForce = 0.0005;

    Matter.Composite.allBodies(engine.world).forEach(body => {
        const distance = Matter.Vector.magnitude(Matter.Vector.sub(body.position, collisionPoint));
        if (distance < distortionRadius && !body.isStatic) {
            const forceMagnitude = distortionForce / (distance * distance);
            Matter.Body.applyForce(body, body.position, Matter.Vector.mult(Matter.Vector.normalise(Matter.Vector.sub(body.position, collisionPoint)), forceMagnitude));
        }
    });
}


export function handleCollisions(event, engine) {
    const pairs = event.pairs;

    pairs.forEach(pair => {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;

        // Calculate collision point as the midpoint between the positions of bodyA and bodyB
        const collisionPoint = {
            x: (bodyA.position.x + bodyB.position.x) / 2,
            y: (bodyA.position.y + bodyB.position.y) / 2
        };

        // Pass collisionPoint to the interactionRules function
        interactionRules(bodyA, bodyB, engine, collisionPoint);

        // Additional handling for antimatter interactions, including special cases with dark matter
        handleAntimatterInteractions(pair, engine, collisionPoint);
    });
}

