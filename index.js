// Importing Matter.js from a CDN
import Matter from 'https://cdn.skypack.dev/matter-js';

// Materials definition with properties
const materials = {
    sand: { label: 'Sand', color: '#f4e04d', density: 0.002, size: 5 },
    water: { label: 'Water', color: '#3498db', density: 0.0001, size: 6, friction: 0, restitution: 0.1 },
    oil: { label: 'Oil', color: '#34495e', density: 0.0012, size: 6, friction: 0.05, restitution: 0.05 },
    rock: { label: 'Rock', color: '#7f8c8d', density: 0.004, size: 8, friction: 0.6, restitution: 0.1 },
    lava: { label: 'Lava', color: '#e74c3c', density: 0.003, size: 7, friction: 0.2, restitution: 0.4 },
    ice: { label: 'Ice', color: '#a8e0ff', density: 0.0009, size: 6, friction: 0.1, restitution: 0.8 },
    rubber: { label: 'Rubber', color: '#ff3b3b', density: 0.001, size: 7, friction: 1.0, restitution: 0.9 },
    steel: { label: 'Steel', color: '#8d8d8d', density: 0.008, size: 10, friction: 0.4, restitution: 0 },
    glass: { label: 'Glass', color: '#c4faf8', density: 0.0025, size: 5, friction: 0.1, restitution: 0.5 },
    wood: { label: 'Wood', color: '#deb887', density: 0.003, size: 8, friction: 0.6, restitution: 0 },
};

let currentMaterial = 'sand';

// Initialize Physics Engine and Renderer
function initPhysics() {
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

    Matter.Engine.run(engine);
    Matter.Render.run(render);

    return { engine, render, world: engine.world };
}

// Convert screen coordinates to world coordinates
function screenToWorld(clientX, clientY, render) {
    const bounds = render.canvas.getBoundingClientRect();
    const scaleX = render.canvas.width / bounds.width;
    const scaleY = render.canvas.height / bounds.height;
    return { x: (clientX - bounds.left) * scaleX, y: (clientY - bounds.top) * scaleY };
}

// Create a new body with given material properties and add it to the world
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
    const body = Matter.Bodies.circle(position.x, position.y, material.size, options);
    Matter.World.add(world, body);
    return body;
}

// Main initialization function
document.addEventListener('DOMContentLoaded', () => {
    const { engine, render, world } = initPhysics();

    document.body.addEventListener('mousedown', event => {
        const { x, y } = screenToWorld(event.clientX, event.clientY, render);
        createNewBody({ x, y }, currentMaterial, world);
    });

    setupMaterialSelector(materials);
    setupFeatureButtons(engine, world);
});

// Setup material selector
function setupMaterialSelector(materials) {
    const selector = document.createElement('div');
    selector.className = 'material-selector';
    document.body.appendChild(selector);

    Object.entries(materials).forEach(([key, material]) => {
        const button = document.createElement('button');
        button.innerText = material.label;
        button.style.backgroundColor = material.color;
        button.onclick = () => {
            currentMaterial = key;
            document.querySelectorAll('.material-selector button').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        };
        selector.appendChild(button);
    });
}

// Setup feature buttons for additional physics effects
function setupFeatureButtons(engine, world) {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'feature-buttons';
    document.body.appendChild(buttonsContainer);

    // Invert Gravity Button
    const gravityButton = document.createElement('button');
    gravityButton.innerText = 'Invert Gravity';
    gravityButton.onclick = () => engine.world.gravity.y = -engine.world.gravity.y;
    buttonsContainer.appendChild(gravityButton);

    // Clear World Button
    const clearButton = document.createElement('button');
    clearButton.innerText = 'Clear World';
    clearButton.onclick = () => Matter.World.clear(world, false); // Keep static bodies
    buttonsContainer.appendChild(clearButton);

    // Add more feature buttons as needed
}
