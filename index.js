import Matter from 'https://cdn.skypack.dev/matter-js';
import { handleCollisions } from './interactions.js';

const materials = {
    // Existing materials
    sand: { label: 'Sand', color: '#f4e04d', density: 0.0025, size: 22.5, friction: 0.5, restitution: 0.3 },
    water: { label: 'Water', color: '#3498db', density: 0.001, size: 27, friction: 0.02, restitution: 0.9 },
    oil: { label: 'Oil', color: '#34495e', density: 0.0008, size: 27, friction: 0.05, restitution: 0.05 },
    rock: { label: 'Rock', color: '#7f8c8d', density: 0.005, size: 37.5, friction: 0.8, restitution: 0.2 },
    lava: { label: 'Lava', color: '#e74c3c', density: 0.004, size: 33, friction: 0.4, restitution: 0.6 },
    ice: { label: 'Ice', color: '#a8e0ff', density: 0.0008, size: 27, friction: 0.01, restitution: 0.95 },
    rubber: { label: 'Rubber', color: '#ff3b3b', density: 0.0012, size: 33, friction: 0.9, restitution: 0.8 },
    steel: { label: 'Steel', color: '#8d8d8d', density: 0.008, size: 45, friction: 0.6, restitution: 0.1 },
    glass: { label: 'Glass', color: '#c4faf8', density: 0.002, size: 22.5, friction: 0.4, restitution: 0.7 },
    wood: { label: 'Wood', color: '#deb887', density: 0.003, size: 37.5, friction: 0.6, restitution: 0.3 },
    antimatter: { label: 'Antimatter', color: '#ff4081', density: 0.001, size: 22.5, friction: 0.01, restitution: 0.99 },
    darkMatter: { label: 'Dark Matter', color: '#6200ea', density: 0.0005, size: 22.5, friction: 0.0, restitution: 1.0 },
    neutronium: { label: 'Neutronium', color: '#5c5c8a', density: 0.02, size: 30, friction: 0.5, restitution: 0.1 },
    quantumFoam: { label: 'Quantum Foam', color: '#ffec8b', density: 0.0001, size: 25, friction: 0.0, restitution: 0.98 },
    exoticMatter: { label: 'Exotic Matter', color: '#fa8072', density: -0.001, size: 22.5, friction: 0.01, restitution: 1.1 },
    plasmaCrystal: { label: 'Plasma Crystal', color: '#00ced1', density: 0.003, size: 20, friction: 0.2, restitution: 0.5 },
    voidEssence: { label: 'Void Essence', color: '#000080', density: 0.0005, size: 25, friction: 0.0, restitution: 1.0 },
    ether: { label: 'Ether', color: '#b19cd9', density: 0.0002, size: 30, friction: 0.01, restitution: 0.95 },
    solarFlare: { label: 'Solar Flare', color: '#ffae42', density: 0.001, size: 35, friction: 0.1, restitution: 0.8 },
    cosmicDust: { label: 'Cosmic Dust', color: '#6c7b8b', density: 0.002, size: 20, friction: 0.7, restitution: 0.3 },
    magneticField: { label: 'Magnetic Field', color: '#1e90ff', density: 0.0001, size: 40, friction: 0.0, restitution: 1.05 },
    photonGel: { label: 'Photon Gel', color: '#ffa07a', density: 0.0008, size: 25, friction: 0.05, restitution: 0.9 },
};


let engine, render, currentMaterial = 'sand';

document.addEventListener('DOMContentLoaded', function() {
    initPhysics();
    setupMaterialSelector();
    setupFeatureButtons();
    setupMaterialDropdown();
});

function initPhysics() {
    engine = Matter.Engine.create();
    render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'linear-gradient(135deg, #333333, #1b2838)'
        }
    });

    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 20, { isStatic: true });
    const walls = [
        Matter.Bodies.rectangle(0, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true }),
        Matter.Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true })
    ];

    Matter.World.add(engine.world, [ground, ...walls]);
    Matter.Events.on(engine, 'collisionStart', handleCollisions);

    Matter.Runner.run(engine);
    Matter.Render.run(render);
}

function setupMaterialSelector() {
    const dropdown = document.getElementById('materialDropdown');
    dropdown.innerHTML = ''; // Clear existing options

    Object.entries(materials).forEach(([key, material]) => {
        const option = document.createElement('a');
        option.textContent = material.label;
        option.href = '#';
        option.dataset.material = key; // Use key for easier reference
        option.addEventListener('click', function(event) {
            event.preventDefault();
            selectMaterial(key);
        });
        dropdown.appendChild(option);
    });
}


function setupFeatureButtons() {
    const featuresDiv = document.getElementById('featureButtons');
    if (!featuresDiv) return;

    // Clear existing buttons for reinitialization
    featuresDiv.innerHTML = '';

    const buttonConfigs = [
        { title: 'Invert Gravity', action: () => engine.world.gravity.y *= -1 },
        { title: 'Clear World', action: clearWorld },
        { title: 'Toggle Day/Night Mode', action: toggleDayNightMode },
        { title: 'Create Black Hole', action: createBlackHole },
        { title: 'Random Gravity', action: () => { engine.world.gravity.x = Math.random() - 0.5; engine.world.gravity.y = Math.random() - 0.5; }},
        { title: 'Material Rain', action: materialRain },
        { title: 'Freeze Time', action: () => { engine.timing.timeScale = engine.timing.timeScale === 0 ? 1 : 0; }},
        { title: 'Add Walls', action: toggleWalls }
    ];

    buttonConfigs.forEach(config => {
        const button = document.createElement('button');
        button.innerText = config.title;
        button.onclick = config.action;
        featuresDiv.appendChild(button);
    });
}

function clearWorld() {
    Matter.World.clear(engine.world);
    initPhysics(); // Reinitialize physics world with initial setup
}

function toggleDayNightMode() {
    const isNight = document.body.style.background.includes('1b2838');
    document.body.style.background = isNight ? 'linear-gradient(145deg, #FFD700, #F0E68C)' : 'linear-gradient(145deg, #333333, #1b2838)';
}


function createBlackHole() {
    const blackHole = Matter.Bodies.circle(engine.render.options.width / 2, engine.render.options.height / 2, 20, {
        isStatic: true,
        render: { fillStyle: '#000' }
    });
    Matter.World.add(engine.world, blackHole);

    Matter.Events.on(engine, 'beforeUpdate', () => {
        Matter.Composite.allBodies(engine.world).forEach(body => {
            if (body !== blackHole && !body.isStatic) {
                const dx = blackHole.position.x - body.position.x;
                const dy = blackHole.position.y - body.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 50) { // Threshold for destruction
                    Matter.World.remove(engine.world, body);
                } else {
                    const forceMagnitude = 1e-6 * (blackHole.mass * body.mass) / (distance * distance);
                    Matter.Body.applyForce(body, body.position, { x: dx * forceMagnitude, y: dy * forceMagnitude });
                }
            }
        });
    });
}


function materialRain() {
    const materialKeys = Object.keys(materials);
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const randomMaterialKey = materialKeys[Math.floor(Math.random() * materialKeys.length)];
            const position = { x: Math.random() * engine.render.options.width, y: 0 };
            createNewBody(position, randomMaterialKey);
        }, i * 100);
    }
}


let wallsAdded = false;
let walls = [];

function toggleWalls() {
    if (wallsAdded) {
        walls.forEach(wall => Matter.World.remove(engine.world, wall));
        walls = [];
    } else {
        const thickness = 50;
        const width = engine.render.options.width;
        const height = engine.render.options.height;
        walls = [
            Matter.Bodies.rectangle(width / 2, -thickness / 2, width, thickness, { isStatic: true }), // top
            Matter.Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, { isStatic: true }), // bottom
            Matter.Bodies.rectangle(-thickness / 2, height / 2, thickness, height, { isStatic: true }), // left
            Matter.Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, { isStatic: true }) // right
        ];
        Matter.World.add(engine.world, walls);
    }
    wallsAdded = !wallsAdded;
}



function setupMaterialDropdown() {
    const dropdown = document.getElementById('materialDropdown');
    Object.keys(materials).forEach(materialKey => {
        const material = materials[materialKey];
        const option = document.createElement('a');
        option.textContent = material.label;
        option.href = '#';
        option.onclick = () => selectMaterial(materialKey);
        dropdown.appendChild(option);
    });

    document.getElementById('toggleMaterials').addEventListener('click', function() {
        dropdown.classList.toggle('show');
    });
}

function selectMaterial(materialKey) {
    currentMaterial = materialKey;
    console.log(`${materials[currentMaterial].label} selected`);
    // Additional UI update logic here
}

document.addEventListener('mousedown', mouseControl);
document.addEventListener('mousemove', mouseControl);
document.addEventListener('mouseup', () => isMouseDown = false);

let isMouseDown = false;
function mouseControl(event) {
    if (event.type === 'mousedown') isMouseDown = true;
    if (isMouseDown) {
        const { x, y } = screenToWorld(event.clientX, event.clientY);
        createNewBody({ x, y }, currentMaterial);
    }
}

function screenToWorld(clientX, clientY) {
    const bounds = render.canvas.getBoundingClientRect();
    return {
        x: (clientX - bounds.left) * (render.canvas.width / bounds.width),
        y: (clientY - bounds.top) * (render.canvas.height / bounds.height)
    };
}

function createNewBody(position, materialKey) {
    const material = materials[materialKey];
    const body = Matter.Bodies.circle(position.x, position.y, material.size / 2, {
        density: material.density,
        friction: material.friction,
        restitution: material.restitution,
        render: { fillStyle: material.color }
    });
    Matter.World.add(engine.world, body);
}
