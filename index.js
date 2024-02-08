// Import the Matter.js library from a CDN
import * as Matter from 'https://cdn.skypack.dev/matter-js';

document.addEventListener('DOMContentLoaded', () => {
    // Create an engine
    const engine = Matter.Engine.create();

    // Create a renderer
    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
            wireframes: false,
            background: 'transparent'
        }
    });

    // Add ground to the world
    const ground = Matter.Bodies.rectangle(render.options.width / 2, render.options.height, render.options.width, 40, { isStatic: true });
    Matter.World.add(engine.world, ground);

    // Material selector and feature buttons
    const uiContainer = document.createElement('div');
    uiContainer.id = 'uiContainer';
    document.body.appendChild(uiContainer);

    const materialSelector = document.createElement('div');
    materialSelector.id = 'materialSelector';
    uiContainer.appendChild(materialSelector);

    const featureButtons = document.createElement('div');
    featureButtons.id = 'featureButtons';
    uiContainer.appendChild(featureButtons);

    // Populate material selector
    const materials = ['sand', 'water', 'oil', 'rock', 'lava', 'antimatter']; // Example materials
    let currentMaterial = materials[0]; // Default material

    materials.forEach(material => {
        const button = document.createElement('button');
        button.innerText = material;
        button.addEventListener('click', () => currentMaterial = material);
        materialSelector.appendChild(button);
    });

    // Example feature button: Gravity Inversion
    const gravityButton = document.createElement('button');
    gravityButton.innerText = 'Invert Gravity';
    gravityButton.addEventListener('click', () => {
        engine.world.gravity.y = engine.world.gravity.y * -1;
    });
    featureButtons.appendChild(gravityButton);

    // Handle mouse down event to create materials
    window.addEventListener('mousedown', function(event) {
        // Prevent default to avoid any unwanted side effects
        event.preventDefault();

        const { clientX: x, clientY: y } = event;
        // Example of creating a material at the click position
        // This function needs to be implemented based on your project's specifics
        console.log(`Creating ${currentMaterial} at position (${x}, ${y})`);
        // Placeholder for createMaterial function call
        // createMaterial(x, y, currentMaterial, engine.world);
    });

    // Run the engine and renderer
    Matter.Engine.run(engine);
    Matter.Render.run(render);
});
