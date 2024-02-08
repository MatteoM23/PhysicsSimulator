import * as Matter from 'https://cdn.skypack.dev/matter-js';
import { materials, createMaterial } from './materials.js';
import { engine, world, initPhysics } from './physics.js';

document.addEventListener('DOMContentLoaded', () => {
    initPhysics();

    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
        },
    });

    // Create invisible walls
    const wallOptions = { isStatic: true, render: { visible: false } };
    const walls = [
        Matter.Bodies.rectangle(0, render.options.height / 2, 1, render.options.height, wallOptions), // Left wall
        Matter.Bodies.rectangle(render.options.width, render.options.height / 2, 1, render.options.height, wallOptions), // Right wall
        Matter.Bodies.rectangle(render.options.width / 2, 0, render.options.width, 1, wallOptions), // Top wall
    ];
    Matter.World.add(world, walls);

    let currentMaterial = 'sand';
    let particleCreationInterval;

    // Material Selector UI
    const materialSelector = document.createElement('div');
    materialSelector.id = 'materialSelector';
    document.body.appendChild(materialSelector);

    Object.keys(materials).forEach(materialKey => {
        const button = document.createElement('button');
        button.innerText = materials[materialKey].label;
        button.onclick = (event) => {
            event.stopPropagation(); // Prevent triggering particle creation when selecting a material
            currentMaterial = materialKey;
        };
        materialSelector.appendChild(button);
    });

    // Function to create particles
    const createParticles = (x, y) => {
        if (y < materialSelector.offsetHeight) return; // Avoid spawning particles behind the material selector
        createMaterial(x, y, currentMaterial, world);
    };

    // Mouse event handlers
    const onMouseDown = (event) => {
        createParticles(event.clientX, event.clientY);
        particleCreationInterval = setInterval(() => createParticles(event.clientX, event.clientY), 100);
    };

    const onMouseUp = () => clearInterval(particleCreationInterval);

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    Matter.Engine.run(engine);
    Matter.Render.run(render);
});
