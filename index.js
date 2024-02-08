import Matter from 'matter-js';
import { createMaterial, materialProperties } from './materials.js';
import { handleInteractions } from './interactions.js';
import { screenToWorld, getRandomColor } from './utils.js';

document.addEventListener('DOMContentLoaded', function() {
    const engine = Matter.Engine.create();
    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false
        }
    });

    // Ground to prevent particles from falling indefinitely
    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 10, window.innerWidth, 20, {
        isStatic: true,
        render: { fillStyle: '#060a19' }
    });
    Matter.World.add(engine.world, ground);

    // Initialize interactions handling
    handleInteractions(engine);

    // Mouse interaction setup
    let mouseIsDown = false;
    window.addEventListener('mousedown', () => mouseIsDown = true);
    window.addEventListener('mouseup', () => mouseIsDown = false);
    window.addEventListener('mousemove', (event) => {
        if (mouseIsDown) {
            const { x, y } = screenToWorld(event.clientX, event.clientY);
            const materialType = document.querySelector('input[name="material"]:checked').value; // Assuming radio buttons for material selection
            createMaterial(x, y, materialType, engine.world);
        }
    });

    // Material selection UI
    const materialSelector = document.createElement('div');
    Object.keys(materialProperties).forEach(type => {
        const label = document.createElement('label');
        const radioButton = document.createElement('input');
        radioButton.setAttribute('type', 'radio');
        radioButton.setAttribute('name', 'material');
        radioButton.setAttribute('value', type);
        if (type === 'sand') { // Default selection
            radioButton.checked = true;
        }
        label.appendChild(radioButton);
        label.appendChild(document.createTextNode(type));
        materialSelector.appendChild(label);
    });
    document.body.appendChild(materialSelector);

    Matter.Engine.run(engine);
    Matter.Render.run(render);
});
