import Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/mode=imports/optimized/matter-js.js';
import { initPhysics, addGroundAndWalls } from './physics.js';
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
        // Add more materials as needed
    };
    let currentMaterial = 'sand';

    setupMaterialSelector(materials);
    setupFeatureButtons(engine);
    addGroundAndWalls(world, render.options.width, render.options.height);

    let isMouseDown = false;
    render.canvas.addEventListener('mousedown', () => isMouseDown = true);
    window.addEventListener('mouseup', () => isMouseDown = false);
    render.canvas.addEventListener('mousemove', (event) => {
        if (isMouseDown) {
            const { x, y } = screenToWorld(event.clientX, event.clientY, render);
            createParticle(x, y, materials[currentMaterial]);
        }
    });

    function createParticle(x, y, material) {
        const particleOptions = {
            isStatic: false,
            restitution: material.restitution,
            friction: material.friction,
            density: material.density,
            render: {
                fillStyle: material.color,
                strokeStyle: material.color,
                lineWidth: 1
            }
        };
        const particle = Matter.Bodies.circle(x, y, material.size, particleOptions);
        Matter.World.add(world, particle);
    }

    function setupMaterialSelector(materials) {
        const selector = document.createElement('div');
        selector.style.position = 'fixed';
        selector.style.top = '10px';
        selector.style.left = '10px';
        document.body.appendChild(selector);

        Object.entries(materials).forEach(([key, material]) => {
            const button = document.createElement('button');
            button.innerText = material.label;
            button.style.backgroundColor = material.color;
            button.style.color = '#fff';
            button.onclick = () => {
                currentMaterial = key;
                document.querySelectorAll('.material-selector button').forEach(btn => btn.style.opacity = '0.5');
                button.style.opacity = '1';
            };
            selector.appendChild(button);
        });
    }

    function setupFeatureButtons(engine) {
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.position = 'fixed';
        buttonsContainer.style.top = '50px';
        buttonsContainer.style.left = '10px';
        document.body.appendChild(buttonsContainer);

        const gravityButton = document.createElement('button');
        gravityButton.innerText = 'Invert Gravity';
        gravityButton.onclick = () => engine.world.gravity.y *= -1;
        buttonsContainer.appendChild(gravityButton);

        const timeButton = document.createElement('button');
        timeButton.innerText = 'Toggle Time Dilation';
        timeButton.onclick = () => engine.timing.timeScale = engine.timing.timeScale === 1 ? 0.5 : 1;
        buttonsContainer.appendChild(timeButton);
    }
});
