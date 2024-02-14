// Interaction rules
const interactionRules = {
    'oil+lava': (oilParticle, lavaParticle, particles) => {
        // Simulate explosion by creating additional particles
        for (let i = 0; i < 50; i++) {
            const explosionParticle = new Particle(oilParticle.position.x, oilParticle.position.y, 'explosion');
            // Apply random force to simulate explosion effect
            explosionParticle.velocity.x = Math.random() * 10 - 5;
            explosionParticle.velocity.y = Math.random() * 10 - 5;
            particles.push(explosionParticle);
        }
        // Remove oil and lava particles
        particles.splice(particles.indexOf(oilParticle), 1);
        particles.splice(particles.indexOf(lavaParticle), 1);
    },
    // Add more interaction rules for other material combinations
};

// Handle particle collisions
function handleCollisions(particles) {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const particleA = particles[i];
            const particleB = particles[j];
            if (areParticlesColliding(particleA, particleB)) {
                const interactionKey = [particleA.type, particleB.type].sort().join('+');
                const interactionHandler = interactionRules[interactionKey];
                if (interactionHandler) {
                    interactionHandler(particleA, particleB, particles);
                }
            }
        }
    }
}

// Check if two particles are colliding
function areParticlesColliding(particleA, particleB) {
    // Implement collision detection logic (e.g., based on distance between particles)
    const distance = Math.sqrt(Math.pow(particleB.position.x - particleA.position.x, 2) + Math.pow(particleB.position.y - particleA.position.y, 2));
    return distance < particleA.radius + particleB.radius;
}
