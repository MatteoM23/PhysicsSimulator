import Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/dist=es2019,mode=imports/optimized/matter-js.js';
import { initPhysics, addParticle, addWalls } from './physics.js';
import { screenToWorld } from './utils.js';
import { handleInteractions } from './interactions.js';

let currentMaterial = 'sand'; // Default material

document.addEventListener('DOMContentLoaded', async () => {
    const { engine, world, render } = await initPhysics({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    addWalls(engine, world);

    const materials = {
        sand: { label: 'Sand', density: 0.002, friction: 0.5, color: '#f4e04d' },
        water: { label: 'Water', density: 0.001, friction: 0.0, color: '#3498db', isLiquid: true },
        oil: { label: 'Oil', density: 0.0012, friction: 0.01, color: '#34495e', isLiquid: true },
        rock: { label: 'Rock', density: 0.004, friction: 0.6, color: '#7f8c8d' },
        lava: { label: 'Lava', density: 0.003, friction: 0.2, color: '#e74c3c', isLiquid: true, temperature: 1200 },
        ice: { label: 'Ice', density: 0.0009, friction: 0.1, color: '#a8e0ff', restitution: 0.8 },
        rubber: { label: 'Rubber', density: 0.001, friction: 1.0, color: '#ff3b3b', restitution: 0.9 },
        steel: { label: 'Steel', density: 0.008, friction: 0.4, color: '#8d8d8d' },
        glass: { label: 'Glass', density: 0.0025, friction: 0.1, color: '#c4faf8', restitution: 0.5 },
        wood: { label: 'Wood', density: 0.003, friction: 0.6, color: '#deb887' },
        antimatter: { label: 'Antimatter', density: 0.0, friction: 0.0, color: '#8e44ad', restitution: 1.0, isAntimatter: true }
    };

    setupMaterialSelector(materials);
    setupFeatureButtons(engine, world);
    handleMouseEvents(render, materials, engine, world);

    Matter.Engine.run(engine);
    Matter.Render.run(render);
});

function setupMaterialSelector(materials) {
    const selector = document.createElement('div');
    selector.id = 'materialSelector';
    document.body.appendChild(selector);

    Object.entries(materials).forEach(([key, { label, color }]) => {
        const button = document.createElement('button');
        button.textContent = label;
        button.style.backgroundColor = color;
        button.addEventListener('click', () => currentMaterial = key);
        selector.appendChild(button);
    });
}

function setupFeatureButtons(engine) {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.id = 'featureButtons';
    document.body.appendChild(buttonsContainer);

    // Invert Gravity Button
    const invertGravityBtn = document.createElement('button');
    invertGravityBtn.textContent = 'Invert Gravity';
    invertGravityBtn.onclick = () => engine.world.gravity.y *= -1;
    buttonsContainer.appendChild(invertGravityBtn);

    // Time Dilation Button
    const timeDilationBtn = document.createElement('button');
    timeDilationBtn.textContent = 'Toggle Time Dilation';
    timeDilationBtn.onclick = () => engine.timing.timeScale = engine.timing.timeScale === 1 ? 0.5 : 1;
    buttonsContainer.appendChild(timeDilationBtn);
}

function handleMouseEvents(engine, render, world, materials) {
    let isMouseDown = false;
    render.canvas.addEventListener('mousedown', (event) => {
        isMouseDown = true;
        createParticle(event);
    });

    document.addEventListener('mousemove', (event) => {
        if (isMouseDown) {
            createParticle(event);
        }
    });

    document.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    function createParticle(event) {
        const { x, y } = screenToWorld(event.clientX, event.clientY, render.canvas);
        if (materials[currentMaterial]) {
            addParticle(x, y, currentMaterial, world);
        }
    }
}

// Register interaction handling
handleInteractions(engine, world);
