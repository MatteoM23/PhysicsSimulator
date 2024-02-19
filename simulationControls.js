import { world } from './physicsInit.js';
import Matter from 'https://cdn.skypack.dev/matter-js';

export const clearWorld = () => {
    // Get all bodies in the world
    const bodies = Matter.Composite.allBodies(world);

    // Iterate over each body
    bodies.forEach(body => {
        // Check if the body is not a barrier (floor or wall)
        if (!body.isStatic || (body.label !== 'Wall' && body.label !== 'Floor')) {
            // Remove the body from the world
            Matter.World.remove(world, body);
        }
    });

    console.log('Material bodies cleared!');
};

export const toggleGravity = () => {
    // Assuming engine is imported or accessible globally
    engine.world.gravity.y = engine.world.gravity.y === 0 ? 1 : 0;
    console.log('Gravity toggled!');
};

export const randomizeMaterials = () => {
    // This would require you to iterate over all bodies in the world
    // and change their material properties randomly.
    Matter.Composite.allBodies(world).forEach(body => {
        // Just a conceptual example. Adjust materials and properties as needed.
        const materials = ['sand', 'water', 'oil']; // Ensure you have a better way to handle materials
        const randomMaterial = materials[Math.floor(Math.random() * materials.length)];
        body.render.fillStyle = randomMaterial.color; // This line is conceptual; implement proper material handling
    });
    console.log('Materials randomized!');
};
