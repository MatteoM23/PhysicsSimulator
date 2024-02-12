// Importing Matter.js from a CDN
import Matter from 'https://cdn.skypack.dev/matter-js';

// Import interactionRules from interactions.js
import { interactionRules } from './interactions.js';

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

    // Add floor and walls
    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 40, { isStatic: true, render: { fillStyle: '#776e65' } });
    const leftWall = Matter.Bodies.rectangle(20, window.innerHeight / 2, 40, window.innerHeight, { isStatic: true, render: { fillStyle: '#776e65' } });
    const rightWall = Matter.Bodies.rectangle(window.innerWidth - 20, window.innerHeight / 2, 40, window.innerHeight, { isStatic: true, render: { fillStyle: '#776e65' } });
    Matter.World.add(engine.world, [ground, leftWall, rightWall]);

    Matter.Engine.run(engine);
    Matter.Render.run(render);


    return { engine, render, world: engine.world };
}

// Handle interactions between bodies
function handleInteractions(engine, world) {
    // Set of handled interactions to avoid duplicate processing
    const interactionsHandled = new Set();

    // Detect collision start
    Matter.Events.on(engine, 'collisionStart', (event) => {
        event.pairs.forEach((pair) => {
            const bodyA = pair.bodyA;
            const bodyB = pair.bodyB;
            const materials = [bodyA.label, bodyB.label].sort().join('+');
            
            if (!interactionsHandled.has(materials)) {
                const interactionHandler = interactionRules[materials];
                if (interactionHandler) {
                    interactionHandler(bodyA, bodyB, world);
                    interactionsHandled.add(materials);
                }
            }
        });
    });

    // Clear handled interactions on collision end
    Matter.Events.on(engine, 'collisionEnd', (event) => {
        event.pairs.forEach((pair) => {
            const bodyA = pair.bodyA;
            const bodyB = pair.bodyB;
            const materials = [bodyA.label, bodyB.label].sort().join('+');
            if (world.bodies.includes(bodyA) && world.bodies.includes(bodyB)) {
                interactionsHandled.delete(materials);
            }
        });
    });
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

// Function to clear non-static bodies
function clearDynamicBodies(world) {
    Matter.Composite.allBodies(world).forEach(body => {
        if (!body.isStatic) {
            Matter.Composite.remove(world, body);
        }
    });
}

// Main initialization function
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

// Setup material selector
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

// Setup feature buttons for additional physics effects
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
