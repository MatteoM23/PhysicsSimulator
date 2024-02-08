import Matter from 'matter-js';
import { createMaterial, materialProperties } from './materials.js';
import { handleInteractions } from './interactions.js';

document.addEventListener('DOMContentLoaded', function() {
    const engine = Matter.Engine.create();
    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'rgba(255, 255, 255, 0.9)' // Light background to ensure visibility
        }
    });

    // Add ground to prevent particles from falling out of view
    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 20, { isStatic: true });
    Matter.World.add(engine.world, ground);

    // Initialize interactions handling
    handleInteractions(engine);

    // Current selected material
    let currentMaterial = 'sand'; // Default material

    // Create material selector UI
    createMaterialSelector();

    // Mouse interaction for particle creation
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);

    function createMaterialSelector() {
        const selector = document.createElement('div');
        selector.style.position = 'absolute';
        selector.style.top = '10px';
        selector.style.left = '10px';
        selector.style.padding = '5px';
        selector.style.backgroundColor = '#fff';
        selector.style.border = '1px solid #ddd';
        selector.style.borderRadius = '5px';

        Object.keys(materialProperties).forEach((material) => {
            const button = document.createElement('button');
            button.textContent = material;
            button.style.margin = '2px';
            button.onclick = () => currentMaterial = material;
            selector.appendChild(button);
        });

        document.body.appendChild(selector);
    }

    let mouseIsDown = false;
    function onMouseDown() { mouseIsDown = true; }
    function onMouseUp() { mouseIsDown = false; }
    function onMouseMove(event) {
        if (mouseIsDown) {
            // Convert screen coordinates to world coordinates if necessary
            const { x, y } = { x: event.clientX, y: event.clientY };
            createMaterial(x, y, currentMaterial, engine.world);
        }
    }

    // Run the Matter.js engine and renderer
    Matter.Engine.run(engine);
    Matter.Render.run(render);
});
