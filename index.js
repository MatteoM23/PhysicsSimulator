import Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/mode=imports/optimized/matter-js.js';
import { engine, world, initPhysics } from './physics.js';
import { screenToWorld } from './utils.js';
import { handleInteractions } from './interactions.js';

// Initialize physics environment
initPhysics();

const render = Matter.Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
    },
});

// Call addWalls after render is defined, assuming addWalls is a function in ./physics.js that now receives render as an argument
addWalls(render);

const materials = {
    sand: { label: 'Sand', color: '#f4e04d', density: 0.002, size: 5 },
    water: { label: 'Water', color: '#3498db', density: 0.0001, size: 6, friction: 0, restitution: 0.1 },
    oil: { label: 'Oil', color: '#34495e', density: 0.0012, size: 6, friction: 0.05, restitution: 0.05, flammable: true },
    rock: { label: 'Rock', color: '#7f8c8d', density: 0.004, size: 8, friction: 0.6, restitution: 0.1 },
    lava: { label: 'Lava', color: '#e74c3c', density: 0.003, size: 7, friction: 0.2, restitution: 0.4, temperature: 1200 },
    antimatter: { label: 'Antimatter', color: '#8e44ad', density: 0.001, size: 10, friction: 0.0, restitution: 1.0, isAntimatter: true },
};

let currentMaterial = 'sand';

setupMaterialSelector();
setupFeatureButtons();

document.addEventListener('mousedown', (event) => {
    if (event.target === render.canvas) {
        const onMouseMove = (e) => {
            const { x, y } = screenToWorld(e.clientX, e.clientY, render);
            createParticle(x, y, currentMaterial);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', onMouseMove);
        }, { once: true });
    }
});

handleInteractions(engine, world);

Matter.Engine.run(engine);
Matter.Render.run(render);

function setupMaterialSelector() {
    const materialSelector = document.createElement('div');
    materialSelector.style.position = 'fixed';
    materialSelector.style.bottom = '10px';
    materialSelector.style.left = '50%';
    materialSelector.style.transform = 'translateX(-50%)';
    materialSelector.style.display = 'flex';
    document.body.appendChild(materialSelector);

    Object.keys(materials).forEach(key => {
        const material = materials[key];
        const button = document.createElement('button');
        button.innerText = material.label;
        button.addEventListener('click', () => {
            currentMaterial = key;
        });
        materialSelector.appendChild(button);
    });
}

function setupFeatureButtons() {
    const featureButtons = document.createElement('div');
    featureButtons.style.position = 'fixed';
    featureButtons.style.bottom = '60px';
    featureButtons.style.left = '50%';
    featureButtons.style.transform = 'translateX(-50%)';
    featureButtons.style.display = 'flex';
    document.body.appendChild(featureButtons);

    const gravityBtn = document.createElement('button');
    gravityBtn.innerText = 'Invert Gravity';
    gravityBtn.addEventListener('click', () => engine.world.gravity.y *= -1);
    featureButtons.appendChild(gravityBtn);

    const timeBtn = document.createElement('button');
    timeBtn.innerText = 'Toggle Time Dilation';
    timeBtn.addEventListener('click', () => engine.timing.timeScale = engine.timing.timeScale === 1 ? 0.5 : 1);
    featureButtons.appendChild(timeBtn);
}

function createParticle(x, y, materialType) {
    const material = materials[materialType];
    const body = Matter.Bodies.circle(x, y, material.size, {
        density: material.density,
        friction: material.friction || 0,
        restitution: material.restitution || 0,
        render: { fillStyle: material.color },
    });
    Matter.World.add(world, body);
}
