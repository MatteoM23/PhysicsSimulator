// Import the Matter.js library from a CDN
import * as Matter from 'https://cdn.skypack.dev/matter-js';
import { materials, createMaterial } from './materials.js';
import { invertGravity } from './interactions.js';

document.addEventListener('DOMContentLoaded', () => {
    const engine = Matter.Engine.create();
    const world = engine.world;
    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'transparent',
        },
    });

    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 40, { isStatic: true });
    Matter.World.add(world, ground);

    let currentMaterial = 'sand';

    const uiContainer = document.createElement('div');
    uiContainer.id = 'uiContainer';
    document.body.appendChild(uiContainer);

    const materialSelector = document.createElement('div');
    materialSelector.id = 'materialSelector';
    uiContainer.appendChild(materialSelector);

    Object.keys(materials).forEach(material => {
        const button = document.createElement('button');
        button.innerText = material;
        button.addEventListener('click', () => currentMaterial = material);
        materialSelector.appendChild(button);
    });

    const gravityButton = document.createElement('button');
    gravityButton.innerText = 'Invert Gravity';
    gravityButton.addEventListener('click', () => invertGravity(world));
    uiContainer.appendChild(gravityButton);

    window.addEventListener('mousedown', (event) => {
        const { clientX, clientY } = event;
        const body = createMaterial(clientX, clientY, currentMaterial, world);
        Matter.World.add(world, body);
    });

    Matter.Engine.run(engine);
    Matter.Render.run(render);
});
