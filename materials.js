import Matter from 'https://cdn.skypack.dev/matter-js';

import { Bodies, World } from 'https://cdn.skypack.dev/matter-js';

const materialProperties = {
    sand: {
        label: 'sand',
        render: { fillStyle: '#f4e04d' },
        density: 0.002,
        friction: 0.5,
        restitution: 0.3,
        size: 5
    },
    water: {
        label: 'water',
        render: { fillStyle: '#3498db' },
        density: 0.001,
        friction: 0.0,
        restitution: 0.1,
        size: 6
    },
    oil: {
        label: 'oil',
        render: { fillStyle: '#34495e' },
        density: 0.0012,
        friction: 0.05,
        restitution: 0.05,
        size: 6,
        flammable: true
    },
    rock: {
        label: 'rock',
        render: { fillStyle: '#7f8c8d' },
        density: 0.004,
        friction: 0.6,
        restitution: 0.1,
        size: 8
    },
    lava: {
        label: 'lava',
        render: { fillStyle: '#e74c3c' },
        density: 0.003,
        friction: 0.2,
        restitution: 0.4,
        size: 7,
        temperature: 1200 // Custom property, possibly for specific interactions
    },
    antimatter: {
        label: 'antimatter',
        render: { fillStyle: '#8e44ad' },
        density: 0.001,
        friction: 0.0,
        restitution: 1.0,
        size: 10,
        isAntimatter: true // Mark antimatter for special collision handling
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
        plugin: { materialType: materialType } // Use for collision detection and interactions
    });

    World.add(world, body);
    return body;
}

export { createMaterial, materialProperties };
