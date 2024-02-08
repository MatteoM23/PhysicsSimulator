// Assuming Matter.js is globally available
const { Bodies } = Matter;

const materialProperties = {
    sand: {
        label: 'sand',
        render: { fillStyle: '#f4e04d' },
        density: 0.002,
        friction: 0.5,
        restitution: 0.3,
        size: 5 // Particle size in pixels
    },
    water: {
        label: 'water',
        render: { fillStyle: '#3498db' },
        density: 0.001,
        friction: 0.0,
        restitution: 0.1,
        size: 6 // Slightly larger to mimic fluid cohesion
    },
    oil: {
        label: 'oil',
        render: { fillStyle: '#34495e' },
        density: 0.0012,
        friction: 0.05,
        restitution: 0.05,
        size: 6,
        flammable: true // Custom property to indicate interaction with lava
    },
    rock: {
        label: 'rock',
        render: { fillStyle: '#7f8c8d' },
        density: 0.004,
        friction: 0.6,
        restitution: 0.1,
        size: 8 // Larger size for rocks
    },
    lava: {
        label: 'lava',
        render: { fillStyle: '#e74c3c' },
        density: 0.003,
        friction: 0.2,
        restitution: 0.4,
        size: 7, // Mimic slightly fluid-like but still viscous
        temperature: 1200 // Custom property for interaction logic
    }
};

function createMaterial(x, y, materialType, world) {
    const properties = materialProperties[materialType];
    const body = Bodies.circle(x, y, properties.size / 2, {
        label: materialType,
        render: properties.render,
        density: properties.density,
        friction: properties.friction,
        restitution: properties.restitution,
        plugin: { materialType: materialType } // For identifying material during collisions
    });

    // Additional logic here for special material behaviors, if needed

    Matter.World.add(world, body);
    return body; // Return the body in case further manipulation is needed
}

export { createMaterial, materialProperties };
