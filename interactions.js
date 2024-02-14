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
    'water+lava': (waterParticle, lavaParticle, particles) => {
        // Steam effect: convert water into steam
        waterParticle.type = 'steam';
        waterParticle.color = '#CCCCCC';
        // Apply upward force to simulate steam
        waterParticle.velocity.y -= 5;
    },
    'water+oil': (waterParticle, oilParticle, particles) => {
        // Emulsification: mix water and oil particles
        const emulsifiedParticle = new Particle((waterParticle.position.x + oilParticle.position.x) / 2, (waterParticle.position.y + oilParticle.position.y) / 2, 'emulsion');
        // Set emulsified particle properties
        emulsifiedParticle.size = 3;
        emulsifiedParticle.color = '#8B4513'; // Brown color for emulsion
        particles.push(emulsifiedParticle);
        // Remove water and oil particles
        particles.splice(particles.indexOf(waterParticle), 1);
        particles.splice(particles.indexOf(oilParticle), 1);
    },
    'ice+water': (iceParticle, waterParticle, particles) => {
        // Melting effect: convert ice into water
        iceParticle.type = 'water';
        iceParticle.color = '#3498db'; // Change color to blue for water
    },
    'ice+lava': (iceParticle, lavaParticle, particles) => {
        // Cooling effect: convert lava into rock
        lavaParticle.type = 'rock';
        lavaParticle.color = '#7f8c8d'; // Change color to gray for rock
    },
    'rubber+steel': (rubberParticle, steelParticle, particles) => {
        // Bounce effect: increase restitution of rubber
        rubberParticle.restitution = 0.8;
    },
    'wood+steel': (woodParticle, steelParticle, particles) => {
        // Fire effect: convert wood into ash
        woodParticle.type = 'ash';
        woodParticle.color = '#CCCCCC'; // Change color to gray for ash
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
