// Import Matter.js module
const { Engine, World, Bodies, Events } = Matter;

// Assuming 'world' is the Matter.js world imported or accessible from this script
// You may need to adjust how 'world' is accessed based on your project structure

const materialProperties = {
    sand: {
        label: 'sand',
        render: { fillStyle: '#f4e04d' },
        density: 0.002,
        friction: 0.5,
        restitution: 0.3,
        size: 5 // particle size in pixels
    },
    water: {
        label: 'water',
        render: { fillStyle: '#3498db' },
        density: 0.001,
        friction: 0.0,
        restitution: 0.1,
        size: 6 // slightly larger to mimic fluid cohesion
    },
    oil: {
        label: 'oil',
        render: { fillStyle: '#34495e' },
        density: 0.0012,
        friction: 0.01,
        restitution: 0.05,
        size: 6
    },
    rock: {
        label: 'rock',
        render: { fillStyle: '#7f8c8d' },
        density: 0.004,
        friction: 0.6,
        restitution: 0.1,
        size: 8 // larger size for rocks
    },
    lava: {
        label: 'lava',
        render: { fillStyle: '#e74c3c' },
        density: 0.003,
        friction: 0.2,
        restitution: 0.4,
        size: 7 // mimic slightly fluid-like but still viscous
    }
};

// Function to create a material particle and add it to the world
function createMaterial(x, y, materialType, world) {
    const properties = materialProperties[materialType];
    const body = Bodies.circle(x, y, properties.size, {
        label: properties.label,
        render: properties.render,
        density: properties.density,
        friction: properties.friction,
        restitution: properties.restitution
    });

    World.add(world, body);
}

export { createMaterial, materialProperties };
