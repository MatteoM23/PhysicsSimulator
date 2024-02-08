// physics.js
const { Engine, World, Bodies, Body, Events, Composite } = Matter;

let engine, world;
const particles = []; // To store all dynamic particles

function initPhysics() {
    engine = Engine.create();
    world = engine.world;
    engine.world.gravity.y = 1;

    // Listen for collision events to simulate water-sand interaction
    Events.on(engine, 'collisionStart', event => handleCollisions(event));
}

function handleCollisions(event) {
    event.pairs.forEach(pair => {
        const labels = [pair.bodyA.label, pair.bodyB.label];
        // Check if one is water and the other is sand
        if (labels.includes('water') && labels.includes('sand')) {
            const waterBody = pair.bodyA.label === 'water' ? pair.bodyA : pair.bodyB;
            const sandBody = pair.bodyA.label === 'water' ? pair.bodyB : pair.bodyA;

            // Example of changing sand properties - this could be more complex in a real scenario
            Body.setStatic(sandBody, true); // Simplification: just make the sand static to simulate "wet sand"
        }
    });
}

function addParticle(x, y, materialType) {
    // Simplified particle creation logic
    const size = materialType === 'sand' ? 2 : materialType === 'water' ? 5 : 3; // Adjust size based on type
    const properties = { isStatic: false, restitution: 0.5, density: 0.001, label: materialType };
    const particle = Bodies.circle(x, y, size, properties);
    particles.push(particle);
    World.add(world, particle);
}

// Placeholder for adding simplified fluid behavior
function updateFluidBehavior() {
    const fluidParticles = particles.filter(p => p.label === 'water');
    fluidParticles.forEach(particle => {
        applyCohesion(fluidParticles, particle);
        applySeparation(fluidParticles, particle);
    });
}

function applyCohesion(particles, target) {
    const cohesionRange = 50; // Max distance for attracting particles
    const cohesionStrength = 0.001; // Strength of attraction

    particles.forEach(p => {
        const distance = Matter.Vector.magnitude(Matter.Vector.sub(p.position, target.position));
        if (distance > 0 && distance < cohesionRange) {
            const forceDirection = Matter.Vector.normalise(Matter.Vector.sub(p.position, target.position));
            const forceMagnitude = cohesionStrength * (cohesionRange - distance) / cohesionRange;
            const force = Matter.Vector.mult(forceDirection, -forceMagnitude);

            Matter.Body.applyForce(target, target.position, force);
        }
    });
}

function applySeparation(particles, target) {
    const separationRange = 25; // Distance to maintain from other particles
    const separationStrength = 0.002; // Strength of repulsion

    particles.forEach(p => {
        const distance = Matter.Vector.magnitude(Matter.Vector.sub(p.position, target.position));
        if (distance > 0 && distance < separationRange) {
            const forceDirection = Matter.Vector.normalise(Matter.Vector.sub(target.position, p.position));
            const forceMagnitude = separationStrength * (separationRange - distance) / separationRange;
            const force = Matter.Vector.mult(forceDirection, forceMagnitude);

            Matter.Body.applyForce(target, target.position, force);
        }
    });
}

// Integrate updateFluidBehavior into the main update loop
function update() {
    Engine.update(engine, 1000 / 60);
    updateFluidBehavior(); // Call fluid behavior update
}


function createGravityInversionField(x, y, radius, strength) {
    Events.on(engine, 'beforeUpdate', () => {
        Composite.allBodies(world).forEach(body => {
            if (!body.isStatic && body.label !== 'boundary') {
                const dx = body.position.x - x;
                const dy = body.position.y - y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < radius) {
                    const forceMagnitude = strength * (radius - distance) / radius;
                    Body.applyForce(body, body.position, { x: 0, y: -forceMagnitude * body.mass });
                }
            }
        });
    });
}

function createTimeDilationField(x, y, radius, dilationFactor) {
    Events.on(engine, 'beforeUpdate', () => {
        Composite.allBodies(world).forEach(body => {
            if (!body.isStatic && body.label !== 'boundary') {
                const dx = body.position.x - x;
                const dy = body.position.y - y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < radius) {
                    // Adjust velocity based on dilation factor
                    Body.setVelocity(body, {
                        x: body.velocity.x * dilationFactor,
                        y: body.velocity.y * dilationFactor,
                    });
                    // Optionally, adjust angular velocity
                    Body.setAngularVelocity(body, body.angularVelocity * dilationFactor);
                }
            }
        });
    });
}



// Example corrected export statement for physics.js
export { initPhysics, addParticle, update, createGravityInversionField, createTimeDilationField };
