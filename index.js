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


function initPhysics() {
    const engine = Matter.Engine.create();
    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'linear-gradient(to bottom, #3498db, #ffffff)', // Keep the original background gradient
        },
    });

    // Keep the original positions and increase floor thickness
    // Adjust the y-position slightly to compensate for the increased thickness
    const groundThickness = 40; // Increased thickness for better collision handling
    const groundYPosition = window.innerHeight - groundThickness / 2; // Adjusted to align with the bottom
    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, groundYPosition, window.innerWidth, groundThickness, { isStatic: true, render: { fillStyle: 'transparent' } });

    const leftWall = Matter.Bodies.rectangle(10, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true, render: { fillStyle: 'transparent' } });
    const rightWall = Matter.Bodies.rectangle(window.innerWidth - 10, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true, render: { fillStyle: 'transparent' } });

    Matter.World.add(engine.world, [ground, leftWall, rightWall]);

    // Add collision events
    Matter.Events.on(engine, 'collisionStart', function(event) {
        const pairs = event.pairs;
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            handleCollisions(pair.bodyA, pair.bodyB); // Reuse the original collision handling function
        }
    });

    // Optimize the physics engine
    engine.timing.timeScale = 1; // Keep the original time scaling

    Matter.Runner.run(engine);
    Matter.Render.run(render);

    return { engine, render, world: engine.world };
}




function screenToWorld(clientX, clientY, render) {
    const bounds = render.canvas.getBoundingClientRect();
    const scaleX = render.canvas.width / bounds.width;
    const scaleY = render.canvas.height / bounds.height;
    return { x: (clientX - bounds.left) * scaleX, y: (clientY - bounds.top) * scaleY };
}

document.addEventListener('DOMContentLoaded', () => {
    const { engine, render, world } = initPhysics();

    let isMouseDown = false;
    document.body.addEventListener('mousedown', event => {
        isMouseDown = true;
        const { x, y } = screenToWorld(event.clientX, event.clientY, render);
        createNewBody({ x, y }, currentMaterial, world);
    });

    document.body.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    document.body.addEventListener('mousemove', event => {
        if (isMouseDown) {
            const { x, y } = screenToWorld(event.clientX, event.clientY, render);
            createNewBody({ x, y }, currentMaterial, world);
        }
    });

    setupMaterialSelector(materials);
    setupFeatureButtons(engine, world);
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

function setupMaterialSelector(materials) {
    const selector = document.createElement('div');
    selector.className = 'material-selector';
    document.body.appendChild(selector);

    Object.entries(materials).forEach(([key, { label, color }]) => {
        const button = document.createElement('button');
        button.innerText = label;
        button.style.backgroundColor = color;
        button.onclick = () => {
            currentMaterial = key;
            document.querySelectorAll('.material-selector button').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        };
        selector.appendChild(button);
    });
}

function setupFeatureButtons(engine, world) {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'feature-buttons';
    document.body.appendChild(buttonsContainer);

    const gravityButton = document.createElement('button');
    gravityButton.innerText = 'Invert Gravity';
    gravityButton.onclick = () => {
        engine.world.gravity.y = -engine.world.gravity.y;
    };
    buttonsContainer.appendChild(gravityButton);

    const clearButton = document.createElement('button');
    clearButton.innerText = 'Clear World';
    clearButton.onclick = () => clearDynamicBodies(engine.world);
    buttonsContainer.appendChild(clearButton);
}
