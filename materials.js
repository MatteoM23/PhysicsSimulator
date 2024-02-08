// Ensure Matter.js is accessible. If Matter.js is included via a script tag, it's available as a global variable.
const { Bodies } = Matter;

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

// Assuming 'world' from Matter.js is properly imported or accessible in this context
function createMaterial(x, y, materialType, world) {
    // Validate materialType
    if (!materialProperties[materialType]) {
        console.error('createMaterial: Unknown material type', materialType);
        return;
    }
    
    const properties = materialProperties[materialType];
    const body = Bodies.circle(x, y, properties.size / 2, { // Size is diameter, divide by 2 for radius
        label: materialType,
        render: properties.render,
        density: properties.density,
        friction: properties.friction,
        restitution: properties.restitution
    });

    // Add the body to the Matter.js world
    Matter.World.add(world, body);
}

// Optional: Export materialProperties if you need to access them outside this module
export { createMaterial };
