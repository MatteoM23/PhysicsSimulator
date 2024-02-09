import Matter from 'https://cdn.skypack.dev/matter-js';
import { initPhysics, addParticle, addGroundAndWalls } from './physics.js';
import { handleInteractions } from './interactions.js';
import { screenToWorld } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const { engine, world, render } = initPhysics();
    Matter.Engine.run(engine);
    Matter.Render.run(render);
    handleInteractions(engine, world); // Set up custom interactions from interactions.js

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

    document.addEventListener('mousedown', event => handleMouseInteraction(event, true));
    document.addEventListener('mousemove', event => handleMouseInteraction(event, false));
    document.addEventListener('mouseup', () => handleMouseInteraction(null, false, true));

    function handleMouseInteraction(event, isMouseDown, isMouseUp = false) {
        if (isMouseUp) {
            render.mouse.button = -1; // Reset mouse state
            return;
        }
        if (event.target.tagName === 'CANVAS' && (isMouseDown || render.mouse.button === 0)) {
            const { x, y } = screenToWorld(event.clientX, event.clientY, render);
            addParticle(x, y, materials[currentMaterial], world);
            if (isMouseDown) render.mouse.button = 0; // Mimic mouse down state
        }
    }

    function setupMaterialSelector(materials) {
        const materialSelector = document.createElement('div');
        materialSelector.style.position = 'absolute';
        materialSelector.style.top = '10px';
        materialSelector.style.left = '10px';
        document.body.appendChild(materialSelector);

        Object.entries(materials).forEach(([key, material]) => {
            const button = document.createElement('button');
            button.textContent = material.label;
            button.style.margin = '0 5px';
            button.onclick = () => setCurrentMaterial(key);
            materialSelector.appendChild(button);
        });
    }

    function setCurrentMaterial(materialKey) {
        currentMaterial = materialKey;
    }

    function setupFeatureButtons(engine) {
        const buttonsContainer = document.createElement('div');
        buttonsContainer.id = 'featureButtons';
        buttonsContainer.style.position = 'fixed';
        buttonsContainer.style.top = '80px';
        buttonsContainer.style.left = '50%';
        buttonsContainer.style.transform = 'translateX(-50%)';
        document.body.appendChild(buttonsContainer);

        const gravityButton = document.createElement('button');
        gravityButton.innerText = 'Invert Gravity';
        gravityButton.addEventListener('click', (e) => {
            e.stopPropagation();
            engine.world.gravity.y *= -1;
        });
        buttonsContainer.appendChild(gravityButton);

        const timeButton = document.createElement('button');
        timeButton.innerText = 'Toggle Time Dilation';
        timeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            engine.timing.timeScale = engine.timing.timeScale === 1 ? 0.5 : 1;
        });
        buttonsContainer.appendChild(timeButton);
    }
});
