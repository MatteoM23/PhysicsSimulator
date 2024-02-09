import Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/mode=imports/optimized/matter-js.js';

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

// Define materials with adjusted properties for smaller "mini particles"
const materials = {
    sand: { label: 'Sand', color: '#f4e04d', density: 0.002, size: 5 },
    water: { label: 'Water', color: '#3498db', density: 0.0001, size: 6, friction: 0, restitution: 0.1 },
    oil: { label: 'Oil', color: '#34495e', density: 0.0012, size: 6, friction: 0.05, restitution: 0.05, flammable: true },
    rock: { label: 'Rock', color: '#7f8c8d', density: 0.004, size: 8, friction: 0.6, restitution: 0.1 },
    lava: { label: 'Lava', color: '#e74c3c', density: 0.003, size: 7, friction: 0.2, restitution: 0.4, temperature: 1200 },
    antimatter: { label: 'Antimatter', color: '#8e44ad', density: 0.001, size: 10, friction: 0.0, restitution: 1.0, isAntimatter: true },
};

let currentMaterial = 'sand';

// Add floor (ground)
const ground = Matter.Bodies.rectangle(render.options.width / 2, render.options.height, render.options.width, 50, { isStatic: true, render: { fillStyle: '#2e2e2e' } });
Matter.World.add(engine.world, ground);

// Material selector at the bottom
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
    button.onclick = () => currentMaterial = key;
    materialSelector.appendChild(button);
});

// Function to create a particle
function createParticle(x, y, materialType) {
    const chance = Math.random();
    if (chance > 0.2) return; // 20% chance to spawn a particle

    const material = materials[materialType];
    const body = Matter.Bodies.circle(x, y, material.size, {
        render: { fillStyle: material.color },
        density: material.density,
    });
    Matter.World.add(engine.world, body);
}

// Handle mouse events for particle creation
document.addEventListener('mousedown', (event) => {
    if (event.target === render.canvas) {
        document.addEventListener('mousemove', onMouseMove);
        onMouseMove(event); // For immediate response
    }
});

document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', onMouseMove);
});

function onMouseMove(event) {
    // Adjust to ensure particles are not created on the UI
    if (event.clientY < render.options.height - materialSelector.offsetHeight) {
        createParticle(event.clientX, event.clientY, currentMaterial);
    }
}

Matter.Engine.run(engine);
Matter.Render.run(render);
