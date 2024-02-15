import Matter from 'https://cdn.skypack.dev/matter-js';
import { interactionRules, handleCollisions } from './interactions.js';

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


let currentMaterial = 'sand';


document.addEventListener('DOMContentLoaded', function() {
    const materials = ["Sand", "Water", "Oil", "Rock", "Lava", "Ice", "Rubber", "Steel", "Glass", "Wood", "Antimatter", "Dark Matter", "Neutronium", "Quantum Foam", "Exotic Matter", "Plasma Crystal", "Void Essence", "Ether", "Solar Flare", "Cosmic Dust", "Magnetic Field", "Photon Gel"];
    const grid = document.getElementById('materialGrid');

    materials.forEach(material => {
        const button = document.createElement('button');
        button.textContent = material;
        button.className = 'material-button';
        grid.appendChild(button);
    });

    const toggleButton = document.getElementById('toggleMaterials');
    toggleButton.addEventListener('click', function() {
        grid.classList.toggle('expanded');
        this.querySelector('i.arrow').classList.toggle('up', grid.classList.contains('expanded'));
        this.querySelector('i.arrow').classList.toggle('down', !grid.classList.contains('expanded'));
        this.textContent = grid.classList.contains('expanded') ? "Less Materials" : "More Materials";
    });
});



function adjustPerformanceBasedOnOS(engine) {
    const platform = navigator.platform.toLowerCase();
    if (platform.includes('mac')) {
        engine.timing.timeScale = 0.8; // Adjust timeScale for macOS
    } else if (platform.includes('win')) {
        engine.timing.timeScale = 1; // Default timeScale for Windows
    }
    // Add additional conditions if needed for other OS
}




function initPhysics() {
    const engine = Matter.Engine.create();
    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'linear-gradient(135deg, #333333, #1b2838)'
        },
    });

    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 20, window.innerWidth, 20, { isStatic: true, render: { fillStyle: 'transparent' } });
    const leftWall = Matter.Bodies.rectangle(0, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true, render: { fillStyle: 'transparent' } });
    const rightWall = Matter.Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true, render: { fillStyle: 'transparent' } });
    Matter.World.add(engine.world, [ground, leftWall, rightWall]);

    Matter.Events.on(engine, 'collisionStart', function(event) {
        handleCollisions(event, engine);
    });

    Matter.Runner.run(engine);
    Matter.Render.run(render);

    return { engine, render, world: engine.world };
}

function screenToWorld(clientX, clientY, render) {
    const bounds = render.canvas.getBoundingClientRect();
    return {
        x: (clientX - bounds.left) * (render.canvas.width / bounds.width),
        y: (clientY - bounds.top) * (render.canvas.height / bounds.height)
    };
}


let isMouseDown = false;

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('mousedown', function(event) {
        isMouseDown = true;
        const position = screenToWorld(event.clientX, event.clientY, render);
        createNewBody(position, currentMaterial, engine.world);
    });

    document.body.addEventListener('mousemove', function(event) {
        if (isMouseDown) {
            const position = screenToWorld(event.clientX, event.clientY, render);
            createNewBody(position, currentMaterial, engine.world);
        }
    });

    document.body.addEventListener('mouseup', function() {
        isMouseDown = false;
    });
});


function createNewBody(position, materialKey, world) {
    const material = materials[materialKey];
    const options = {
        density: material.density,
        friction: material.friction ?? 0.1,
        restitution: material.restitution ?? 0.1,
        render: {
            fillStyle: material.color,
        },
    };
    const body = Matter.Bodies.circle(position.x, position.y, material.size / 2, options);
    body.material = materialKey;
    Matter.World.add(world, body);
}

function clearDynamicBodies(world) {
    Matter.Composite.allBodies(world).forEach(body => {
        if (!body.isStatic) {
            Matter.Composite.remove(world, body);
        }
    });
}

function setupMaterialSelector() {
    const selector = document.getElementById('material-Selector'); // Ensure this ID matches your HTML
    Object.entries(materials).forEach(([key, { label, color }]) => {
        const button = document.createElement('button');
        button.innerText = label;
        button.style.backgroundColor = color;
        button.addEventListener('click', () => {
            currentMaterial = key;
            document.querySelectorAll('#material-Selector button').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
        selector.appendChild(button);
    });
}


function setupFeatureButtons(engine) {
    const featuresDiv = document.getElementById('featureButtons'); // Ensure this ID matches your HTML

    // Invert Gravity Button
    const invertGravityButton = document.createElement('button');
    invertGravityButton.innerText = 'Invert Gravity';
    invertGravityButton.addEventListener('click', () => {
        engine.world.gravity.y = -engine.world.gravity.y;
    });
    featuresDiv.appendChild(invertGravityButton);

    // Clear World Button
    const clearWorldButton = document.createElement('button');
    clearWorldButton.innerText = 'Clear World';
    clearWorldButton.addEventListener('click', () => {
        Matter.World.clear(engine.world, false); // The 'false' argument prevents removing the renderer
        initPhysics(); // Reinitialize or specifically re-add walls/ground if not handled in initPhysics
    });
    featuresDiv.appendChild(clearWorldButton);
}

