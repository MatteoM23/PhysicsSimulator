import { engine, world } from './physicsInit.js';
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
    // Toggle gravity by setting it to -1 if currently 0, and vice versa
    engine.world.gravity.y = engine.world.gravity.y === 0 ? -1 : 0;
    console.log('Gravity toggled!');
};

export const materialRain = () => {
    const materials = ['sand', 'water', 'oil', 'rock', 'lava', 'ice', 'rubber', 'steel', 'glass', 'wood', 'antimatter', 'darkMatter', 'neutronium', 'quantumFoam', 'exoticMatter', 'plasmaCrystal', 'voidEssence', 'ether', 'solarFlare', 'cosmicDust', 'magneticField', 'photonGel'];

    // Number of materials to rain
    const numMaterials = 20;

    // Create material rain
    for (let i = 0; i < numMaterials; i++) {
        const material = materials[Math.floor(Math.random() * materials.length)];

        // Generate random position within the canvas
        const x = Math.random() * engine.render.canvas.width;
        const y = Math.random() * engine.render.canvas.height;

        // Create body at random position with selected material
        createBody(x, y, material);
    }

    console.log('Material rain started!');
};
