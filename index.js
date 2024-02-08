// Correctly import Matter.js from a CDN. Ensure this URL is valid and accessible.
import * as Matter from 'https://cdn.skypack.dev/matter-js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the Matter.js engine and renderer.
    const engine = Matter.Engine.create();
    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
        },
    });

    // Define materials with basic properties for demonstration.
    const materials = {
        sand: { color: '#f4e04d' },
        water: { color: '#3498db' },
    };

    let currentMaterial = 'sand'; // Default material selection.

    // Create and append the material selector UI.
    const materialSelector = document.createElement('div');
    materialSelector.id = 'materialSelector';
    document.body.appendChild(materialSelector);

    Object.keys(materials).forEach(material => {
        const button = document.createElement('button');
        button.textContent = material;
        button.style.backgroundColor = materials[material].color;
        button.onclick = () => currentMaterial = material;
        materialSelector.appendChild(button);
    });

    // Add ground to the world for the particles to land on.
    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 40, { isStatic: true });
    Matter.World.add(engine.world, ground);

    // Function to add particles on mouse click.
    function addParticle(event) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const particle = Matter.Bodies.circle(mouseX, mouseY, 20, {
            render: { fillStyle: materials[currentMaterial].color },
        });
        Matter.World.add(engine.world, particle);
    }

    window.addEventListener('mousedown', addParticle);

    // Run the engine and renderer.
    Matter.Engine.run(engine);
    Matter.Render.run(render);
});
