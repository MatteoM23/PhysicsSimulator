import Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/mode=imports/optimized/matter-js.js';
import { initPhysics, addSparks, addGroundAndWalls } from './physics.js';
import { handleInteractions } from './interactions.js';
import { screenToWorld } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const { engine, world, render } = initPhysics();
    Matter.Engine.run(engine);
    Matter.Render.run(render);
    handleInteractions(engine, world);

    // Setup a Mouse object for the canvas to handle continuous particle creation
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            render: { visible: false }
        }
    });
    Matter.World.add(world, mouseConstraint);
    render.mouse = mouse; // Ensure render.mouse is properly defined

    const materials = {
        // Material definitions
    };
    let currentMaterial = 'sand';
    let isMouseDown = false;

    setupMaterialSelector(materials);
    setupFeatureButtons(engine);
    addGroundAndWalls(world, render.options.width, render.options.height);

    document.addEventListener('mousedown', () => isMouseDown = true);
    document.addEventListener('mouseup', () => isMouseDown = false);
    document.addEventListener('mousemove', (event) => {
        if (isMouseDown) {
            createParticleAtMouse(event);
        }
    });

    function createParticleAtMouse(event) {
        const { x, y } = screenToWorld(event.clientX, event.clientY, render);
        addSparks(x, y, materials[currentMaterial], world);
    }

    function setupMaterialSelector(materials) {
        const selector = document.createElement('div');
        selector.className = 'material-selector';
        document.body.appendChild(selector);

        Object.entries(materials).forEach(([key, { label, color }]) => {
            const button = document.createElement('button');
            button.textContent = label;
            button.style.backgroundColor = color; // Use material color for button
            button.onclick = () => {
                currentMaterial = key;
                // Update UI or other elements as necessary to reflect the current selection.
            };
            selector.appendChild(button);
        });
    }

    function setupFeatureButtons(engine) {
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'feature-buttons';
        document.body.appendChild(buttonsContainer);

        const gravityButton = document.createElement('button');
        gravityButton.textContent = 'Invert Gravity';
        gravityButton.onclick = () => {
            engine.world.gravity.y *= -1;
        };
        buttonsContainer.appendChild(gravityButton);

        const timeButton = document.createElement('button');
        timeButton.textContent = 'Toggle Time Dilation';
        timeButton.onclick = () => {
            engine.timing.timeScale = engine.timing.timeScale === 1 ? 0.5 : 1;
        };
        buttonsContainer.appendChild(timeButton);
    }
});
