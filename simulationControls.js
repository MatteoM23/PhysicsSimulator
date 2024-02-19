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

let gravityReversed = false; // Variable to track gravity state

export const toggleGravity = () => {
    if (gravityReversed) {
        // If gravity is reversed, set it back to normal
        engine.world.gravity.y = 1; // Or whatever your normal gravity value is
        gravityReversed = false;
    } else {
        // If gravity is normal, reverse it
        engine.world.gravity.y = -1; // Or whatever value you want to set for reversed gravity
        gravityReversed = true;
    }
    console.log('Gravity toggled!');
};


export const materialRain = () => {
    const materials = ['sand', 'water', 'oil', 'rock', 'lava', 'ice', 'rubber', 'steel', 'glass', 'wood', 'antimatter', 'darkMatter', 'neutronium', 'quantumFoam', 'exoticMatter', 'plasmaCrystal', 'voidEssence', 'ether', 'solarFlare', 'cosmicDust', 'magneticField', 'photonGel'];

    // Number of materials to rain
    const numMaterials = 20;

    // Get the canvas dimensions
    const canvasWidth = engine.render.canvas.width;
    const canvasHeight = engine.render.canvas.height;

    // Create material rain
    for (let i = 0; i < numMaterials; i++) {
        const material = materials[Math.floor(Math.random() * materials.length)];

        // Generate random position within the canvas
        const x = Math.random() * canvasWidth;
        const y = Math.random() * canvasHeight;

        // Create body at random position with selected material
        createBody(x, y, material);
    }

    console.log('Material rain started!');
};

