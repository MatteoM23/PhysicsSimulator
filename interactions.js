// Interaction rules
export const interactionRules = {
    'water+lava': (waterParticle, lavaParticle, particles) => {
        // Steam effect: convert water into steam
        waterParticle.type = 'steam';
        waterParticle.color = '#CCCCCC';
        // Apply upward force to simulate steam
        waterParticle.velocity.y -= 5;
        // Remove lava particle
        particles.splice(particles.indexOf(lavaParticle), 1);
    },
    'ice+lava': (iceParticle, lavaParticle, particles) => {
        // Cooling effect: convert lava into rock
        lavaParticle.type = 'rock';
        lavaParticle.color = '#7f8c8d'; // Change color to gray for rock
        // Remove ice particle
        particles.splice(particles.indexOf(iceParticle), 1);
    },
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
};

// Handle particle collisions
export function handleCollisions(particles) {
    // Using a more efficient collision detection algorithm
    for (let i = 0; i < particles.length; i++) {
        const particleA = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
            const particleB = particles[j];
            if (areParticlesColliding(particleA, particleB)) {
                console.log(`Collision detected between ${particleA.type} and ${particleB.type}`);
                const interactionKey = [particleA.type, particleB.type].sort().join('+');
                const interactionHandler = interactionRules[interactionKey];
                if (interactionHandler) {
                    interactionHandler(particleA, particleB, particles);
                    console.log(`Interaction handled between ${particleA.type} and ${particleB.type}`);
                } else {
                    console.log(`No interaction handler found between ${particleA.type} and ${particleB.type}`);
                }
            }
        }
    }
}


// Check if two particles are colliding
export function areParticlesColliding(particleA, particleB) {
    // Implement optimized collision detection logic (e.g., based on distance between particles)
    const distance = Math.sqrt(Math.pow(particleB.position.x - particleA.position.x, 2) + Math.pow(particleB.position.y - particleA.position.y, 2));
    // Consider particles to be colliding if their distance is less than or equal to the sum of their radii
    return distance <= (particleA.size / 2 + particleB.size / 2);
}
