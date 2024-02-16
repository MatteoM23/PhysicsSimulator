import Matter from 'https://cdn.skypack.dev/matter-js';
import { interactionRules, handleCollisions } from './interactions.js';

// Define materials globally to ensure they are accessible throughout the script
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

document.addEventListener('DOMContentLoaded', () => {
    const uiContainer = document.getElementById('uiContainer');
    if (!uiContainer) {
        console.error('UI Container not found');
        return;
    }

    // Create materialsContainer if it does not exist
    let materialsContainer = document.getElementById('materialsContainer');
    if (!materialsContainer) {
        materialsContainer = document.createElement('div');
        materialsContainer.id = 'materialsContainer';
        uiContainer.appendChild(materialsContainer);
    }

    setupMaterialSelector(materials, materialsContainer);
    const { engine, render, world } = initPhysics();

    setupFeatureButtons(engine, world);

    document.body.addEventListener('mousedown', (event) => handleMouseDown(event, render, world));
    document.body.addEventListener('mouseup', () => handleMouseUp());
    document.body.addEventListener('mousemove', (event) => handleMouseMove(event, render, world));
});

function setupMaterialSelector(materials, container) {
    // Initially display only the first 6 materials
    Object.entries(materials).slice(0, 6).forEach(([key, material]) => {
        const button = document.createElement('button');
        button.textContent = material.label;
        button.className = 'materialButton'; // Use this class for styling
        button.onclick = () => selectMaterial(key);
        container.appendChild(button);
    });

    // Arrow for expanding/collapsing the dropdown
    const expandArrow = document.createElement('span');
    expandArrow.innerHTML = '&#x25BC;'; // Downward arrow symbol
    expandArrow.className = 'expandArrow';
    container.appendChild(expandArrow);

    // Toggle full dropdown view on arrow click
    let isExpanded = false;
    expandArrow.addEventListener('click', () => {
        if (!isExpanded) {
            // Show all materials
            expandMaterialsDropdown(materials, container);
        } else {
            // Collapse to show only the first row
            collapseMaterialsDropdown(materials, container);
        }
        isExpanded = !isExpanded;
        expandArrow.innerHTML = isExpanded ? '&#x25B2;' : '&#x25BC;'; // Toggle arrow direction
    });
}

function selectMaterial(key) {
    currentMaterial = key;
    console.log(`Material ${key} selected`);
}

function expandMaterialsDropdown(materials, container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    Object.entries(materials).forEach(([key, material]) => {
        const button = document.createElement('button');
        button.textContent = material.label;
        button.className = 'materialButton';
        button.onclick = () => selectMaterial(key);
        container.appendChild(button);
    });
    // Re-add the expand arrow
    // Note: Make sure to re-create or move the expand arrow logic here if it gets removed
}

function collapseMaterialsDropdown(materials, container) {
    // Remove all current buttons
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    // Add only the first 6 materials
    Object.entries(materials).slice(0, 6).forEach(([key, material], index) => {
        const button = document.createElement('button');
        button.textContent = material.label;
        button.className = 'materialButton';
        container.appendChild(button);
    });

    // Add the expand arrow
    const expandArrow = document.createElement('span');
    expandArrow.innerHTML = '&#x25BC;'; // Downward arrow symbol
    expandArrow.className = 'expandArrow';
    container.appendChild(expandArrow);
}


function initPhysics() {
    // Your existing initPhysics function here
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

    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 10, window.innerWidth, 20, { isStatic: true, render: { fillStyle: 'transparent' } });
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

function createNewBody(position, materialKey, world) {
    // Your existing createNewBody function here
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
    // Your existing clearDynamicBodies function here
    Matter.Composite.allBodies(world).forEach(body => {
        if (!body.isStatic) {
            Matter.Composite.remove(world, body);
        }
    });
}

function setupFeatureButtons(engine, world) {
    // Your existing setupFeatureButtons function here
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

function isMaterialSelectorButton(element) {
    // Your existing isMaterialSelectorButton function here
    return element.closest('.material-selector') !== null;
}

function isFeatureButton(element) {
    // Your existing isFeatureButton function here
    return element.closest('.feature-buttons') !== null;
}

let isMouseDown = false;

function handleMouseDown(event, render, world) {
    // Implement the logic for handling mouse down events
    isMouseDown = true;
    const { x, y } = screenToWorld(event.clientX, event.clientY, render);
    if (!isMaterialSelectorButton(event.target) && !isFeatureButton(event.target)) {
        createNewBody({ x, y }, currentMaterial, world);
    }
}

function handleMouseUp() {
    // Implement the logic for handling mouse up events
    isMouseDown = false;
}

function handleMouseMove(event, render, world) {
    // Implement the logic for handling mouse move events
    if (isMouseDown && !isMaterialSelectorButton(event.target) && !isFeatureButton(event.target)) {
        const { x, y } = screenToWorld(event.clientX, event.clientY, render);
        createNewBody({ x, y }, currentMaterial, world);
    }
}

