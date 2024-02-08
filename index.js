import { Engine, Render, World, Bodies } from 'matter-js';
import { createMaterial, materialProperties } from './materials.js';
import { handleInteractions } from './interactions.js';
import { screenToWorld } from './utils.js';

document.addEventListener('DOMContentLoaded', function() {
    const engine = Engine.create();
    const world = engine.world;
    engine.world.gravity.y = 1; // Default gravity setting

    const render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'transparent',
        },
    });

    // Adding a ground to prevent particles from falling indefinitely
    const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 20, { isStatic: true });
    World.add(world, ground);

    // Initialize material interactions
    handleInteractions(engine, world);

    let currentMaterial = 'sand'; // Default material selection

    setupMaterialSelector();

    function setupMaterialSelector() {
        const selector = document.createElement('div');
        selector.id = 'materialSelector';
        document.body.appendChild(selector);

        Object.keys(materialProperties).forEach(material => {
            const button = document.createElement('button');
            button.innerText = material;
            button.addEventListener('click', () => {
                currentMaterial = material;
            });
            selector.appendChild(button);
        });
    }

    window.addEventListener('mousedown', function(event) {
        const { x, y } = screenToWorld(event.clientX, event.clientY); // Adjust if your utils.js uses this function differently
        createMaterial(x, y, currentMaterial, world);
    });

    Engine.run(engine);
    Render.run(render);
});
