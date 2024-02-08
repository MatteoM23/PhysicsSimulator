// Correctly import the entire Matter.js library from the Skypack CDN
import * as Matter from 'https://cdn.skypack.dev/matter-js';

// Assuming createMaterial, materialProperties, and handleInteractions are correctly imported
import { createMaterial, materialProperties } from './materials.js';
import { handleInteractions } from './interactions.js';

document.addEventListener('DOMContentLoaded', () => {
    // Correctly access the Engine and Render through the Matter namespace
    const engine = Matter.Engine.create();
    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'transparent' // Keeping the background transparent
        }
    });

    // Add ground
    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 20, window.innerWidth, 40, { isStatic: true });
    Matter.World.add(engine.world, ground);

    // Initialize interactions
    handleInteractions(engine, engine.world);

    // Material selection UI
    const uiContainer = document.createElement('div');
    uiContainer.id = 'uiContainer';
    document.body.appendChild(uiContainer);

    const materialSelector = document.createElement('div');
    materialSelector.id = 'materialSelector';
    uiContainer.appendChild(materialSelector);

    // Dynamically creating material selection buttons
    Object.keys(materialProperties).forEach(material => {
        const button = document.createElement('button');
        button.innerText = material;
        button.onclick = () => currentMaterial = material;
        materialSelector.appendChild(button);
    });

    // Feature buttons container
    const featureButtons = document.createElement('div');
    featureButtons.id = 'featureButtons';
    uiContainer.appendChild(featureButtons);

    // Example feature button
    const gravityInversionBtn = document.createElement('button');
    gravityInversionBtn.innerText = 'Gravity Inversion';
    featureButtons.appendChild(gravityInversionBtn);

    // Example interaction for the feature button
    gravityInversionBtn.addEventListener('click', () => {
        engine.world.gravity.y = engine.world.gravity.y * -1;
    });

    let currentMaterial = 'sand'; // Default material

    window.addEventListener('mousedown', function(event) {
        const { x, y } = { x: event.clientX, y: event.clientY - document.body.getBoundingClientRect().top }; // Adjust y coordinate
        createMaterial(x, y, currentMaterial, engine.world);
    });

    // Running the engine and renderer
    Matter.Engine.run(engine);
    Matter.Render.run(render);
});
