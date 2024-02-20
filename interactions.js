// Define new material interactions with advanced effects
import Matter from 'https://cdn.skypack.dev/matter-js';

let auroraEffectApplied = false;

export const interactionRules = (bodyA, bodyB, engine) => {
    if (bodyA.isStatic || bodyB.isStatic || bodyA.material === bodyB.material) {
        // Skip interaction if any body is static or if both bodies share the same material.
        return;
    }

    const typeA = bodyA.material;
    const typeB = bodyB.material;
    const interactionKey = [typeA, typeB].sort().join('+');

    switch (interactionKey) {
        case 'water+lava':
            convertToSteamAndObsidian(bodyA, bodyB, engine);
            Matter.World.remove(engine.world, bodyA); 
            Matter.World.remove(engine.world, bodyB);
            break;
        case 'ice+lava':
            convertLavaToRockRemoveIce(bodyA, bodyB, engine);
            Matter.World.remove(engine.world, bodyA); // Ice is removed
            Matter.World.remove(engine.world, bodyB); // Lava turns to rock
            break;
        case 'oil+lava':
            simulateExplosion(bodyA, bodyB, engine.world, 150, 0.1);
            Matter.World.remove(engine.world, bodyA); // Oil is consumed
            Matter.World.remove(engine.world, bodyB); // Lava is dispersed
            break;
        case 'glass+rock':
            formGlassyStructures(bodyA, bodyB, engine);
            Matter.World.remove(engine.world, bodyA); // Glass shatters
            // Keeping the rock or removing it can be decided based on your logic.
            break;
        case 'antimatter+any':
            handleAntimatterInteractions(bodyA, bodyB, engine);
            // Specific logic in handleAntimatterInteractions decides removal.
            break;
        case 'lava+rubber':
            createFireballs(bodyA, bodyB, engine);
            Matter.World.remove(engine.world, bodyA); 
            Matter.World.remove(engine.world, bodyB);
            break;
        case 'ice+rock':
            // Determine which body is ice and then shatter it
            if (bodyA.material === 'ice') {
                shatterIce(bodyA, engine);
                Matter.World.remove(engine.world, bodyA); // Remove only the ice body
            } else if (bodyB.material === 'ice') {
                shatterIce(bodyB, engine);
                Matter.World.remove(engine.world, bodyB); // Remove only the ice body
            }
            break;
        case 'water+sand':
            createQuicksandArea(bodyA, bodyB, engine);
            // No removal, visual effect only.
            break;
        case 'photonGel+darkMatter':
            createIlluminatedFieldEffect(bodyA, bodyB, engine);
            // No removal, visual effect only
            break;
        case 'neutronium+any':
            createGravityWellEffect(bodyA, bodyB, engine);
            // No removal, visual effect only.
            break;
        case 'voidEssence+cosmicDust':
            createCosmicStorm(bodyA, bodyB, engine);
            // No removal, visual effect only.
            break;
    }
};


function createCosmicStorm(collisionPoint, engine) {
    const stormRadius = 200; // Define the radius of the cosmic storm effect
    const particleCount = 50; // Number of particles to simulate the cosmic dust
    const stormDuration = 3000; // Duration of the storm effect in milliseconds

    for (let i = 0; i < particleCount; i++) {
        // Create particles around the collision point
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * stormRadius;
        const particle = Matter.Bodies.circle(
            collisionPoint.x + Math.cos(angle) * distance,
            collisionPoint.y + Math.sin(angle) * distance,
            2, // Small size for dust particles
            {
                render: {
                    fillStyle: '#6c7b8b'
                },
                density: 0.001,
                frictionAir: 0.05,
                // Optional: Custom properties for unique behaviors
            }
        );

        // Optionally, apply forces to create swirling motion
        // This example applies a simple force, but you can adjust for more complex behaviors
        const forceMagnitude = 0.0001 * (Math.random() + 1);
        Matter.Body.applyForce(particle, {
            x: particle.position.x,
            y: particle.position.y
        }, {
            x: Math.cos(angle) * forceMagnitude,
            y: Math.sin(angle) * forceMagnitude
        });

        Matter.World.add(engine.world, particle);

        // Optionally, remove particles after the storm duration to clean up
        setTimeout(() => {
            Matter.World.remove(engine.world, particle);
        }, stormDuration);
    }

    // Optional: Additional visual effects or behaviors to simulate the cosmic storm
}


function createGravityWellEffect(neutroniumBody, engine) {
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


function createIlluminatedFieldEffect(bodyA, bodyB, engine) {
    const collisionPoint = { 
        x: (bodyA.position.x + bodyB.position.x) / 2, 
        y: (bodyA.position.y + bodyB.position.y) / 2 
    };
    const effectRadius = 100; // Define the radius of the effect

    Matter.Composite.allBodies(engine.world).forEach(body => {
        const dx = body.position.x - collisionPoint.x;
        const dy = body.position.y - collisionPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < effectRadius) {
            // Check if the originalRender property exists
            if (!body.originalRender) {
                body.originalRender = { fillStyle: body.render.fillStyle };
            }

            // Change the fillStyle to simulate illumination
            body.render.fillStyle = '#ffff99';
        }
    });

    // Optionally, revert the effect after a duration
    setTimeout(() => {
        Matter.Composite.allBodies(engine.world).forEach(body => {
            if (body.originalRender) {
                body.render.fillStyle = body.originalRender.fillStyle;
                delete body.originalRender;
            }
        });
    }, 5000); // Duration after which the effect is reverted
}



function createQuicksandArea(pair, engine) {
    const { bodyA, bodyB } = pair;
    const collisionPoint = { x: (bodyA.position.x + bodyB.position.x) / 2, y: (bodyA.position.y + bodyB.position.y) / 2 };

    // Create a large sensor body at the collision point to represent the quicksand area
    const quicksandArea = Matter.Bodies.circle(collisionPoint.x, collisionPoint.y, 100, {
        isSensor: true, // Make it a sensor so it doesn't physically interact with other bodies
        isStatic: true,
        render: { visible: false }, // Make it invisible
    });

    // Add the quicksand area to the world
    Matter.World.add(engine.world, quicksandArea);

    // Listen for collisions with the quicksand area
    Matter.Events.on(engine, 'collisionStart', function(event) {
        event.pairs.forEach(function(pair) {
            if (pair.bodyA === quicksandArea || pair.bodyB === quicksandArea) {
                const trappedBody = pair.bodyA === quicksandArea ? pair.bodyB : pair.bodyA;
                
                // Simulate the quicksand effect on the trapped body
                // Increase friction and reduce restitution
                trappedBody.friction = 1.0;
                trappedBody.frictionStatic = 1.0;
                trappedBody.restitution = 0.1;

                // Optionally, slowly sink the body by applying a downward force
                Matter.Body.applyForce(trappedBody, trappedBody.position, { x: 0, y: 0.0005 });
            }
        });
    });

    // Optionally, remove the quicksand area after a certain duration
    setTimeout(() => {
        Matter.World.remove(engine.world, quicksandArea);
    }, 10000); // Quicksand effect lasts for 10 seconds
}



function shatterIce(bodyA, bodyB, engine) {
    // Assuming bodyA is the ice body. Add logic to determine this if necessary.
    let iceBody;
    if (bodyA.material === 'ice') {
        iceBody = bodyA;
    } else if (bodyB.material === 'ice') {
        iceBody = bodyB;
    }

    // Verify iceBody is valid and exists in the world before attempting removal
    if (iceBody && Matter.Composite.get(engine.world, iceBody.id, 'body')) {
        // Remove the ice body safely
        Matter.Composite.remove(engine.world, iceBody, true); // The true flag for deep removal

        // Optionally, simulate shattering by creating smaller ice fragments
        createIceFragments(iceBody, engine);
    } else {
        console.error('Attempted to shatter an undefined or non-ice body.');
    }
}

function createIceFragments(iceBody, engine) {
    const numberOfFragments = 5; // Example value
    
    for (let i = 0; i < numberOfFragments; i++) {
        // Calculate position and size for each fragment
        let fragment = Matter.Bodies.polygon(
            iceBody.position.x + Math.random() * 10 - 5, // Random position near original ice body
            iceBody.position.y + Math.random() * 10 - 5,
            3, // Triangle fragments for example
            5, // Size
            {
                render: {
                    // Set the fillStyle to the same color as the ice body
                    fillStyle: iceBody.render.fillStyle
                },
                density: iceBody.density, // Optional: match the density of the ice
                friction: iceBody.friction, // Optional: match the friction of the ice
                restitution: iceBody.restitution // Optional: match the restitution of the ice
            }
        );

        // Add each fragment to the world
        Matter.World.add(engine.world, fragment);
    }
}


function createFireballs(bodyA, bodyB, engine) {
    if (!bodyA || !bodyB || !bodyA.position || !bodyB.position) {
        console.error('Invalid bodies for creating fireballs');
        return;
    }

    const midpoint = {
        x: (bodyA.position.x + bodyB.position.x) / 2,
        y: (bodyA.position.y + bodyB.position.y) / 2,
    };

    for (let i = 0; i < 8; i++) { // Create 5 fireballs as an example
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



function convertToSteamAndObsidian(bodyA, bodyB, engine) {
    let waterBody = bodyA.material === 'water' ? bodyA : bodyB;
    let lavaBody = bodyA.material === 'lava' ? bodyA : bodyB;

    Matter.World.remove(engine.world, waterBody); // Remove water to simulate evaporation

    lavaBody.render.fillStyle = '#504A4B'; // Change color to simulate obsidian
    lavaBody.material = 'obsidian';

    createSteamParticles(engine, waterBody.position); // Create steam where water evaporated
}


function createSteamParticles(engine, position) {
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

    // Apply forces to nearby bodies to simulate the explosion's impact
    Matter.Composite.allBodies(world).forEach(body => {
        if (!body.isStatic) {
            const dx = body.position.x - explosionPoint.x;
            const dy = body.position.y - explosionPoint.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < radius) {
                const forceMagnitude = (force * (1 - distance / radius)) / distance;
                Matter.Body.applyForce(body, body.position, {
                    x: dx * forceMagnitude,
                    y: dy * forceMagnitude,
                });
            }
        }
    });

    // Create visual explosion particles at the epicenter
    createExplosionParticles(world, explosionPoint, radius);
}



function createExplosionParticles(world, center, radius) {
    const numberOfParticles = 5; // Adjust for the desired visual effect
    for (let i = 0; i < numberOfParticles; i++) {
        let angle = Math.random() * Math.PI * 2;
        let distance = Math.random() * radius;
        let particle = Matter.Bodies.circle(center.x + Math.cos(angle) * distance, center.y + Math.sin(angle) * distance, 1, {
            isStatic: false,
            render: { fillStyle: '#ff0' },
        });
        // Apply an upward force to simulate the explosion force dispersing particles
        const forceMagnitude = Math.random() * 0.0005 + 0.0001; // Randomized for variety
        Matter.Body.applyForce(particle, { x: particle.position.x, y: particle.position.y }, {
            x: Math.cos(angle) * forceMagnitude,
            y: Math.sin(angle) * forceMagnitude,
        });
        Matter.World.add(world, particle);
    }
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
    // Trigger a significant explosion effect with a larger radius and force for dramatic impact
    simulateExplosion(antimatterBody, darkMatterBody, world, 300, 0.5);

    // Remove both antimatter and dark matter bodies from the simulation
    Matter.World.remove(world, antimatterBody);
    Matter.World.remove(world, darkMatterBody);
}

function increaseIceSize(bodyA, bodyB) {
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


function fadeOutAndRemoveBody(engine, body, fadeDuration, startDelay = 0) {
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

function absorbWater(bodyA, bodyB) {
    // Simulate water absorption by changing the wood body's appearance and properties
    const woodBody = bodyA.material === 'wood' ? bodyA : bodyB;
    woodBody.render.fillStyle = '#8B4513'; // Darken color to represent wet wood
    woodBody.density += 0.1; // Increase density to simulate water absorption
    woodBody.friction *= 0.8; // Reduce friction to simulate a waterlogged surface
}

function formGlassyStructures(engine, collisionPoint) {
    // Create glassy structures at the collision point to simulate formation of glass
    const numberOfParticles = 5;
    const glassColor = '#FFFFFF'; // Color representing glass

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

        // Handle general material interactions
        interactionRules(bodyA, bodyB, engine);

        // Additional handling for antimatter interactions, including special cases with dark matter
        handleAntimatterInteractions(pair, engine);
    });
}
