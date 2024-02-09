import Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/mode=imports/optimized/matter-js.js';
import { handleInteractions } from './interactions.js'; // Make sure this file exists and exports handleInteractions

const engine = Matter.Engine.create();
const world = engine.world;
const render = Matter.Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
    },
});

// Material definitions
const materials = {
    sand: { label: 'Sand', color: '#f4e04d', density: 0.002, size: 5 },
    water: { label: 'Water', color: '#3498db', density: 0.0001, size: 6, friction: 0, restitution: 0.1 },
    oil: { label: 'Oil', color: '#34495e', density: 0.0012, size: 6, friction: 0.05, restitution: 0.05, flammable: true },
    rock: { label: 'Rock', color: '#7f8c8d', density: 0.004, size: 8, friction: 0.6, restitution: 0.1 },
    lava: { label: 'Lava', color: '#e74c3c', density: 0.003, size: 7, friction: 0.2, restitution: 0.4, temperature: 1200 },
    antimatter: { label: 'Antimatter', color: '#8e44ad', density: 0.001, size: 10, friction: 0.0, restitution: 1.0, isAntimatter: true },
};

let currentMaterial = 'sand'; // Default material

// UI for material selection at the bottom of the screen
const materialSelector = document.createElement('div');
document.body.appendChild(materialSelector);
materialSelector.style.position = 'fixed';
materialSelector.style.bottom = '10px';
materialSelector.style.left = '50%';
materialSelector.style.transform = 'translateX(-50%)';
materialSelector.style.display = 'flex';
materialSelector.style.zIndex = '1';

Object.keys(materials).forEach(key => {
    const material = materials[key];
    const button = document.createElement('button');
    button.innerText = material.label;
    button.onclick = () => currentMaterial = key;
    materialSelector.appendChild(button);
});

// Function to create a material particle
function createMaterial(x, y, materialType) {
    const chance = Math.random();
    if (chance > 0.2) return; // 20% chance to spawn a particle

    const material = materials[materialType];
    const body = Matter.Bodies.circle(x, y, material.size, {
        density: material.density,
        friction: material.friction || 0,
        restitution: material.restitution || 0,
        render: { fillStyle: material.color },
    });
    Matter.World.add(world, body);
}

// Implementing gravity inversion and time dilation buttons
const featureButtons = document.createElement('div');
document.body.appendChild(featureButtons);
featureButtons.style.position = 'fixed';
featureButtons.style.bottom = '50px'; // Adjusted to not overlap material selector
featureButtons.style.left = '50%';
featureButtons.style.transform = 'translateX(-50%)';
featureButtons.style.display = 'flex';
featureButtons.style.zIndex = '1';

const gravityBtn = document.createElement('button');
gravityBtn.innerText = 'Invert Gravity';
gravityBtn.onclick = () => engine.world.gravity.y *= -1;
featureButtons.appendChild(gravityBtn);

const timeBtn = document.createElement('button');
timeBtn.innerText = 'Toggle Time Dilation';
timeBtn.onclick = () => engine.timing.timeScale = engine.timing.timeScale === 1 ? 0.5 : 1;
featureButtons.appendChild(timeBtn);

// Continuous particle creation on mouse hold
document.addEventListener('mousedown', (event) => {
    if (event.target === render.canvas) {
        const onMouseMove = (e) => createMaterial(e.clientX, e.clientY, currentMaterial);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', () => document.removeEventListener('mousemove', onMouseMove), { once: true });
    }
});

// Add invisible walls to contain particles
const addWalls = () => {
    const thickness = 50;
    const walls = [
        Matter.Bodies.rectangle(render.options.width / 2, 0, render.options.width + thickness, thickness, { isStatic: true }),
        Matter.Bodies.rectangle(render.options.width / 2, render.options.height, render.options.width + thickness, thickness, { isStatic: true }),
        Matter.Bodies.rectangle(0, render.options.height / 2, thickness, render.options.height, { isStatic: true }),
        Matter.Bodies.rectangle(render.options.width, render.options.height / 2, thickness, render.options.height, { isStatic: true }),
    ];
    walls.forEach((wall) => Matter.World.add(world, wall));
};
addWalls();

// Handling interactions between materials
handleInteractions(engine, world);

Matter.Engine.run(engine);
Matter.Render.run(render);
