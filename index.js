import Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/mode=imports/optimized/matter-js.js';
import { handleInteractions } from './interactions.js'; // Ensure this script handles interactions between different materials

const engine = Matter.Engine.create();
const render = Matter.Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
    },
});

// Materials definition
const materials = {
    sand: { label: 'Sand', color: '#f4e04d', density: 0.002, size: 5 },
    water: { label: 'Water', color: '#3498db', density: 0.0001, size: 6, friction: 0, restitution: 0.1 },
    oil: { label: 'Oil', color: '#34495e', density: 0.0012, size: 6, friction: 0.05, restitution: 0.05, flammable: true },
    rock: { label: 'Rock', color: '#7f8c8d', density: 0.004, size: 8, friction: 0.6, restitution: 0.1 },
    lava: { label: 'Lava', color: '#e74c3c', density: 0.003, size: 7, friction: 0.2, restitution: 0.4, temperature: 1200 },
    antimatter: { label: 'Antimatter', color: '#8e44ad', density: 0.001, size: 10, friction: 0.0, restitution: 1.0, isAntimatter: true },
};

let currentMaterial = 'sand'; // Default material

// UI for material selection
const materialSelector = document.createElement('div');
materialSelector.style.position = 'fixed';
materialSelector.style.top = '10px';
materialSelector.style.left = '50%';
materialSelector.style.transform = 'translateX(-50%)';
materialSelector.style.display = 'flex';
materialSelector.style.zIndex = '1';
document.body.appendChild(materialSelector);

Object.keys(materials).forEach(key => {
    const material = materials[key];
    const button = document.createElement('button');
    button.innerText = material.label;
    button.onclick = () => currentMaterial = key;
    materialSelector.appendChild(button);
});

// Function to create material particles
function createMaterial(x, y, materialType) {
    const material = materials[materialType];
    const body = Matter.Bodies.circle(x, y, material.size, {
        render: { fillStyle: material.color },
        density: material.density,
        friction: material.friction || 0,
        restitution: material.restitution || 0,
    });
    Matter.World.add(engine.world, body);
}

// Add invisible walls to contain particles
const addWalls = () => {
    const wallOptions = { isStatic: true, render: { visible: false } };
    const walls = [
        Matter.Bodies.rectangle(0, render.options.height / 2, 1, render.options.height * 2, wallOptions), // Left
        Matter.Bodies.rectangle(render.options.width, render.options.height / 2, 1, render.options.height * 2, wallOptions), // Right
        Matter.Bodies.rectangle(render.options.width / 2, 0, render.options.width * 2, 1, wallOptions), // Top
        Matter.Bodies.rectangle(render.options.width / 2, render.options.height, render.options.width * 2, 1, wallOptions), // Bottom
    ];
    Matter.World.add(engine.world, walls);
};
addWalls();

// Handle interactions
handleInteractions(engine);

// Continuous particle creation on mouse down
let isCreatingParticles = false;
document.addEventListener('mousedown', (event) => {
    if (event.target === render.canvas) {
        isCreatingParticles = true;
        const createParticle = () => {
            if (isCreatingParticles) {
                const { clientX, clientY } = event;
                if (clientY > materialSelector.offsetHeight) { // Avoid creating particles behind the selector
                    createMaterial(clientX, clientY, currentMaterial);
                }
            }
        };
        createParticle();
        document.addEventListener('mousemove', createParticle);
    }
});
document.addEventListener('mouseup', () => {
    isCreatingParticles = false;
    document.removeEventListener('mousemove', createParticle);
});

// Run the engine and renderer
Matter.Engine.run(engine);
Matter.Render.run(render);
