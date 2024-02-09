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
    let isMouseDown = false;
    let lastPlacedPosition = null;

    setupMaterialSelector(materials);
    setupFeatureButtons(engine);
    addGroundAndWalls(world, render.options.width, render.options.height);

    document.addEventListener('mousedown', function(event) {
        if (event.target.tagName === 'CANVAS') {
            isMouseDown = true;
            lastPlacedPosition = null;
            placeMaterialContinuous(event);
        }
    });

    document.addEventListener('mousemove', placeMaterialContinuous);

    document.addEventListener('mouseup', function() {
        isMouseDown = false;
        lastPlacedPosition = null;
    });

    function placeMaterialContinuous(event) {
        if (isMouseDown && event.target.tagName === 'CANVAS') {
            requestAnimationFrame(() => placeMaterial(event));
        }
    }

    function placeMaterial(event) {
        const { x, y } = screenToWorld(event.clientX, event.clientY, render);
        if (!lastPlacedPosition || distance(x, y, lastPlacedPosition.x, lastPlacedPosition.y) > materials[currentMaterial].size) {
            addParticle(x, y, materials[currentMaterial], world);
            lastPlacedPosition = { x, y };
        }
    }

    function distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    function setupMaterialSelector(materials) {
        const materialSelector = document.createElement('div');
        materialSelector.id = 'materialSelector';
        materialSelector.style.position = 'fixed';
        materialSelector.style.top = '20px';
        materialSelector.style.left = '50%';
        materialSelector.style.transform = 'translateX(-50%)';
        document.body.appendChild(materialSelector);

        Object.keys(materials).forEach(materialKey => {
            const button = document.createElement('button');
            button.innerText = materials[materialKey].label;
            button.onclick = (e) => {
                e.stopPropagation();
                currentMaterial = materialKey;
            };
            materialSelector.appendChild(button);
        });
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
