import Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/mode=imports/optimized/matter-js.js';
import { initPhysics, addGroundAndWalls } from './physics.js';
import { handleInteractions } from './interactions.js';
import { screenToWorld } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const { engine, render, world } = initPhysics();
    Matter.Engine.run(engine);
    Matter.Render.run(render);
    handleInteractions(engine, world);

    let currentMaterial = 'sand';
    let mouseDown = false;
    let lastMousePosition = { x: 0, y: 0 };

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
    };

    function createParticle(x, y, material) {
        const speed = Math.sqrt((x - lastMousePosition.x) ** 2 + (y - lastMousePosition.y) ** 2);
        const size = Math.min(material.size + speed / 20, material.size * 2);
        const particle = Matter.Bodies.circle(x, y, size / 2, {
            restitution: material.restitution,
            density: material.density,
            friction: material.friction,
            render: { fillStyle: material.color },
        });
        Matter.World.add(world, particle);
        lastMousePosition = { x, y };
    }

    document.addEventListener('mousedown', (event) => {
        mouseDown = true;
        const { x, y } = screenToWorld(event.clientX, event.clientY, render);
        lastMousePosition = { x, y };
        createParticle(x, y, materials[currentMaterial]);
    });

    document.addEventListener('mouseup', () => {
        mouseDown = false;
    });

    document.addEventListener('mousemove', (event) => {
        if (!mouseDown) return;
        const { x, y } = screenToWorld(event.clientX, event.clientY, render);
        createParticle(x, y, materials[currentMaterial]);
    });

    addGroundAndWalls(world, render.options.width, render.options.height);
    materialSelector(materials);
    setupFeatureButtons(engine);

    function materialSelector(materials) {
        const selector = document.createElement('div');
        selector.className = 'material-selector';
        document.body.appendChild(selector);

        Object.entries(materials).forEach(([key, material]) => {
            const button = document.createElement('button');
            button.innerText = material.label;
            button.style.backgroundColor = material.color;
            button.onclick = () => {
                currentMaterial = key;
                document.querySelectorAll('.material-selector button').forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');
            };
            selector.appendChild(button);
        });
    }

    function setupFeatureButtons(engine) {
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'feature-buttons';
        document.body.appendChild(buttonsContainer);

        const gravityButton = document.createElement('button');
        gravityButton.innerText = 'Invert Gravity';
        gravityButton.onclick = () => {
            engine.world.gravity.y *= -1;
        };
        buttonsContainer.appendChild(gravityButton);

        const timeButton = document.createElement('button');
        timeButton.innerText = 'Toggle Time Dilation';
        timeButton.onclick = () => {
            engine.timing.timeScale = engine.timing.timeScale === 1 ? 0.5 : 1;
        };
        buttonsContainer.appendChild(timeButton);
    }
});
