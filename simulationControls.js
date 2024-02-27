import { engine, world } from './physicsInit.js';
import Matter from 'https://cdn.skypack.dev/matter-js';
import { createBody } from './materialManager.js';

export const clearWorld = () => {
    // Get all bodies in the world
    const bodies = Matter.Composite.allBodies(world);

    // Iterate over each body
    bodies.forEach(body => {
        // Check if the body is not a barrier (floor or wall)
        if (!body.isStatic || (body.label === 'Sand' || body.label === 'Water' || body.label === 'Oil' || body.label === 'Rock' || body.label === 'Lava' || body.label === 'Ice' || body.label === 'Rubber' || body.label === 'Steel' || body.label === 'Glass' || body.label === 'Wood' || body.label === 'Antimatter' || body.label === 'DarkMatter' || body.label === 'Neutronium' || body.label === 'QuantumFoam' || body.label === 'ExoticMatter' || body.label === 'PlasmaCrystal' || body.label === 'VoidEssence' || body.label === 'Ether' || body.label === 'SolarFlare' || body.label === 'CosmicDust' || body.label === 'MagneticField' || body.label === 'PhotonGel')) {
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
    console.log('Starting material rain...');
    const materialNames = Object.keys(materials); // Assuming materials is imported or accessible

    const numMaterials = 20; // Number of materials to rain
    for (let i = 0; i < numMaterials; i++) {
        const materialName = materialNames[Math.floor(Math.random() * materialNames.length)];
        const x = Math.random() * window.innerWidth; // Use window width if canvas covers entire window
        const y = -30; // Start off-screen for falling effect

        console.log(`Creating ${materialName} at x: ${x}, y: ${y}`);
        createBody(x, y, materialName);
    }

    console.log('Material rain executed.');
};


