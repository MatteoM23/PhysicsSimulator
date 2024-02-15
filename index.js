import Matter from 'https://cdn.skypack.dev/matter-js';
import { interactionRules, handleCollisions } from './interactions.js';


function initPhysicsEngine() {
    // Create engine
    engine = Matter.Engine.create();

    // Create renderer
    render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframeBackground: '#0f0f13',
            wireframes: false,
            background: 'linear-gradient(135deg, #333333, #1b2838)',
        },
    });

    // Add ground and walls
    addStaticBodies();

    // Run engine and renderer
    Matter.Engine.run(engine);
    Matter.Render.run(render);

    // Handle window resizing
    window.addEventListener('resize', handleResize);
}

function addStaticBodies() {
    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 10, window.innerWidth, 20, { isStatic: true, render: { fillStyle: '#868e96' }});
    const leftWall = Matter.Bodies.rectangle(0, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true });
    const rightWall = Matter.Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true });
    Matter.World.add(engine.world, [ground, leftWall, rightWall]);
}

function handleResize() {
    Matter.Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: window.innerWidth, y: window.innerHeight }
    });
}


function setupMaterialDropdown() {
    const dropdown = document.getElementById('materialDropdown');
    Object.keys(materials).forEach(key => {
        let option = document.createElement('a');
        option.textContent = materials[key].label;
        option.href = '#';
        option.onclick = () => selectMaterial(key);
        dropdown.appendChild(option);
    });

    document.getElementById('toggleMaterials').addEventListener('click', () => {
        dropdown.classList.toggle('show');
    });
}

function selectMaterial(key) {
    currentMaterial = key;
    console.log(`${materials[currentMaterial].label} selected`);
}

function setupFeatureButtons() {
    const featuresDiv = document.getElementById('featureButtons');
    const buttons = [
        { id: 'invertGravity', title: 'Invert Gravity', action: invertGravity },
        { id: 'clearWorld', title: 'Clear World', action: () => clearWorld(false) }, // false to keep static bodies
        { id: 'createBlackHole', title: 'Create Black Hole', action: createBlackHole },
        // Define other buttons here
    ];

    buttons.forEach(({ id, title, action }) => {
        let button = document.createElement('button');
        button.id = id;
        button.innerText = title;
        button.addEventListener('click', action);
        featuresDiv.appendChild(button);
    });
}

function invertGravity() {
    engine.world.gravity.y = -engine.world.gravity.y;
}

function clearWorld(keepStatic) {
    Matter.Composite.allBodies(engine.world).forEach(body => {
        if (!body.isStatic || !keepStatic) {
            Matter.World.remove(engine.world, body);
        }
    });
}

function createBlackHole() {
    const blackHole = Matter.Bodies.circle(window.innerWidth / 2, window.innerHeight / 2, 50, {
        isStatic: true,
        render: {
            sprite: {
                texture: 'path/to/blackhole.png',
                xScale: 1,
                yScale: 1
            }
        }
    });
    Matter.World.add(engine.world, blackHole);

    // Add gravitational attraction
    Matter.Events.on(engine, 'beforeUpdate', function() {
        attractBodiesToBlackHole(blackHole);
    });
}

function attractBodiesToBlackHole(blackHole) {
    const forceMagnitude = 1e-4; // Adjust based on desired strength
    Matter.Composite.allBodies(engine.world).forEach(body => {
        if (body === blackHole || body.isStatic) return;
        const dx = blackHole.position.x - body.position.x;
        const dy = blackHole.position.y - body.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const force = { x: (dx / distance) * forceMagnitude, y: (dy / distance) * forceMagnitude };
        Matter.Body.applyForce(body, body.position, force);
    });
}

document.addEventListener('mousedown', (event) => {
    const { x, y } = screenToWorld(event.clientX, event.clientY);
    createMaterialBody(x, y, currentMaterial);
});

function screenToWorld(clientX, clientY) {
    // Convert screen coordinates to world coordinates if necessary
    return { x: clientX, y: clientY };
}

function createMaterialBody(x, y, materialKey) {
    const material = materials[materialKey];
    const body = Matter.Bodies.circle(x, y, material.size, {
        render: { fillStyle: material.color },
        ...material
    });
    Matter.World.add(engine.world, body);
}

