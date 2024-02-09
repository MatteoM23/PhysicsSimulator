import Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/mode=imports/optimized/matter-js.js';
import { initPhysics, addSparks, addGroundAndWalls } from './physics.js';
import { handleInteractions } from './interactions.js';
import { screenToWorld } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const { engine, world, render } = initPhysics();
    Matter.Engine.run(engine);
    Matter.Render.run(render);
    handleInteractions(engine, world);

    const materials = {
        sand: { label: 'Sand', color: '#f4e04d', density: 0.002, size: 5 },
        water: { label: 'Water', color: '#3498db', density: 0.0001, size: 6, friction: 0, restitution: 0.1 },
        oil: { label: 'Oil', color: '#34495e', density: 0.0012, size: 6, friction: 0.05, restitution: 0.05 },
        rock: { label: 'Rock', color: '#7f8c8d', density: 0.004, size: 8, friction: 0.6, restitution: 0.1 },
        lava: { label: 'Lava', color: '#e74c3c', density: 0.003, size: 7, friction: 0.2, restitution: 0.4 },
        ice: { label: 'Ice', color: '#a8e0ff', density: 0.0009, size: 6, friction: 0.1, restitution: 0.8 },
        rubber: { label: 'Rubber', color: '#ff3b3b', density: 0.001, size: 7, friction: 1.0, restitution: 0.9 },
        steel: { label: 'Steel', color: '#8d8d8d', density: 0.008, size: 10, friction: 0.4 },
        glass: { label: 'Glass', color: '#c4faf8', density: 0.0025, size: 5, friction: 0.1, restitution: 0.5 },
        wood: { label: 'Wood', color: '#deb887', density: 0.003, size: 8, friction: 0.6 },
        antimatter: { label: 'Antimatter', color: '#8e44ad', density: 0.001, size: 10, friction: 0.0, restitution: 1.0 },
    };
    let currentMaterial = 'sand';

    setupMaterialSelector(materials);
    setupFeatureButtons(engine);
    addGroundAndWalls(world, render.options.width, render.options.height);

    render.canvas.addEventListener('mousedown', (event) => {
        createSparksAtMouse(event, true);
    });

    render.canvas.addEventListener('mousemove', (event) => {
        createSparksAtMouse(event);
    });

    render.canvas.addEventListener('mouseup', () => {
        // This ensures we capture the mouse up event specifically on the canvas
        // No additional action required here for stopping particle creation
    });

    function createSparksAtMouse(event, isMouseDown = false) {
        if (isMouseDown || render.mouse.button === 0) {
            const { x, y } = screenToWorld(event.clientX, event.clientY, render);
            addSparks(x, y, materials[currentMaterial], world);
        }
    }

    function setupMaterialSelector(materials) {
        const selector = document.createElement('div');
        selector.className = 'material-selector';
        document.body.appendChild(selector);

        Object.entries(materials).forEach(([key, { label, color }]) => {
            const button = document.createElement('button');
            button.textContent = label;
            button.style.backgroundColor = color; // Use material color for button
            button.onclick = () => currentMaterial = key;
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
