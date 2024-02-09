import Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/mode=imports/optimized/matter-js.js';
import { initPhysics, addParticle, addWalls } from './physics.js';
import { screenToWorld } from './utils.js';
import { handleInteractions } from './interactions.js';

// Make sure initPhysics is properly defined to initialize and return { engine, world, render }
const { engine, world, render } = initPhysics({
    width: window.innerWidth,
    height: window.innerHeight,
});

// Add walls around the canvas to contain particles
addWalls(world, engine, render);

// Material properties with expanded definitions for a richer simulation
const materials = {
    sand: { density: 0.002, friction: 0.5, color: '#f4e04d' },
    water: { density: 0.001, friction: 0.0, color: '#3498db', isLiquid: true },
    oil: { density: 0.0012, friction: 0.01, color: '#34495e', isLiquid: true },
    rock: { density: 0.004, friction: 0.6, color: '#7f8c8d' },
    lava: { density: 0.003, friction: 0.2, color: '#e74c3c', isLiquid: true, temperature: 1200 },
    ice: { density: 0.0009, friction: 0.1, color: '#a8e0ff', restitution: 0.8 },
    rubber: { density: 0.001, friction: 1.0, color: '#ff3b3b', restitution: 0.9 },
    steel: { density: 0.008, friction: 0.4, color: '#8d8d8d' },
    glass: { density: 0.0025, friction: 0.1, color: '#c4faf8', restitution: 0.5 },
    wood: { density: 0.003, friction: 0.6, color: '#deb887' },
    antimatter: { density: 0.0, friction: 0.0, color: '#8e44ad', restitution: 1.0, isAntimatter: true }
};

let currentMaterial = 'sand'; // Default selection

setupMaterialSelector();
setupFeatureButtons();
handleMouseEvents();

Matter.Engine.run(engine);
Matter.Render.run(render);

function setupMaterialSelector() {
    const selector = document.createElement('div');
    selector.style = setupStyles().selector;
    Object.keys(materials).forEach(material => {
        const button = document.createElement('button');
        button.innerText = material;
        button.style = setupStyles().button;
        button.addEventListener('click', () => currentMaterial = material);
        selector.appendChild(button);
    });
    document.body.appendChild(selector);
}

function setupFeatureButtons() {
    const buttons = document.createElement('div');
    buttons.style = setupStyles().buttons;
    const gravityBtn = createFeatureButton('Invert Gravity', () => engine.world.gravity.y *= -1);
    const timeBtn = createFeatureButton('Toggle Time Dilation', () => engine.timing.timeScale = engine.timing.timeScale === 1 ? 0.5 : 1);
    buttons.appendChild(gravityBtn);
    buttons.appendChild(timeBtn);
    document.body.appendChild(buttons);
}

function handleMouseEvents() {
    document.addEventListener('mousedown', event => {
        const { x, y } = screenToWorld(event.clientX, event.clientY);
        if (event.target === render.canvas) {
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', () => document.removeEventListener('mousemove', onMouseMove), { once: true });
        }

        function onMouseMove(e) {
            const { x, y } = screenToWorld(e.clientX, e.clientY);
            addParticle(x, y, currentMaterial, materials[currentMaterial], world);
        }
    });
}

function createFeatureButton(text, action) {
    const button = document.createElement('button');
    button.innerText = text;
    button.style = setupStyles().button;
    button.addEventListener('click', action);
    return button;
}

function setupStyles() {
    return {
        selector: 'position: fixed; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex;',
        buttons: 'position: fixed; bottom: 50px; left: 50%; transform: translateX(-50%); display: flex;',
        button: 'margin: 5px; padding: 5px 10px; cursor: pointer;',
    };
}

// Ensure handleInteractions is properly set up for material interactions
handleInteractions(engine, world);
