// Assuming Matter.js is globally available
// materials.js

const { Bodies, World } = Matter;

const materialProperties = {
    sand: {
        render: { fillStyle: '#f4e04d' },
        density: 0.002,
        friction: 0.5,
        restitution: 0.2,
    },
    water: {
        render: { fillStyle: '#3498db' },
        density: 0.0005,
        friction: 0.02,
        restitution: 0.1,
    },
    oil: {
        render: { fillStyle: '#34495e' },
        density: 0.001,
        friction: 0.1,
        restitution: 0.05,
    },
    rock: {
        render: { fillStyle: '#7f8c8d' },
        density: 0.006,
        friction: 0.6,
        restitution: 0.1,
    },
    lava: {
        render: { fillStyle: '#e74c3c' },
        density: 0.004,
        friction: 0.3,
        restitution: 0.5,
    },
    antimatter: {
        render: { fillStyle: '#9b59b6' },
        density: 0.0001,
        friction: 0.0,
        restitution: 1.0,
    }
};

// Adjusting size for realism, especially for materials like sand and water to simulate particles and fluidity
const particleSize = {
    sand: 2, // smaller particles for sand
    water: 5, // slightly larger, but considering collective behavior for fluid simulation
    oil: 5,
    rock: 10,
    lava: 8,
    antimatter: 15 // larger size for visibility and impact
};

function createMaterial(x, y, materialType, world) {
    const properties = materialProperties[materialType];
    const size = particleSize[materialType] || 5; // Default size if not specified

    if (!properties) {
        console.error('Material type not recognized:', materialType);
        return;
    }

    let bodyOptions = {
        ...properties,
        isSensor: materialType === 'antimatter', // Making antimatter a sensor for special interactions
    };

    let body = Bodies.circle(x, y, size, bodyOptions);

    World.add(world, body);
    return body;
}

function createParticle(x, y, materialType) {
    const properties = materialProperties[materialType];
    if (!properties) {
        console.error('Material type not recognized:', materialType);
        return;
    }

    const radius = properties.size || 5; // Default radius if not specified
    const options = {
        ...properties,
        label: materialType,
    };

    let particle = Bodies.circle(x, y, radius, options);
    World.add(world, particle);
}



// Example corrected export statement for materials.js
export { createParticle, materialProperties };
