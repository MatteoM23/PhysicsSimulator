// Import Matter.js from Skypack CDN
import Matter from 'https://cdn.skypack.dev/matter-js';

// Setup the engine, world, and gravity
export const engine = Matter.Engine.create();
export const world = engine.world;
engine.world.gravity.y = 1; // Apply default gravity

// Material properties
const materialProperties = {
    sand: { density: 0.002, friction: 0.5, color: '#f4e04d' },
    water: { density: 0.001, friction: 0.0, color: '#3498db' },
    oil: { density: 0.0012, friction: 0.01, color: '#34495e' },
};

// Initialize physics environment with ground
export function initPhysics() {
    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 60, { isStatic: true, render: { fillStyle: '#464646' } });
    Matter.World.add(world, ground);
}

// Add particles of a given material type
function addParticle(x, y, materialType) {
    const properties = materialProperties[materialType];
    if (!properties) {
        console.error('Material type not recognized');
        return;
    }
    const particle = Matter.Bodies.circle(x, y, 20, {
        render: { fillStyle: properties.color },
        density: properties.density,
        friction: properties.friction,
    });
    Matter.World.add(world, particle);
}

// Update the physics world (might be needed for specific timed updates or interactions)
function update() {
    Matter.Engine.update(engine, 1000 / 60);
}

// Handling material interactions - Example: Log collisions (extend this function based on your needs)
function handleMaterialInteractions() {
    Matter.Events.on(engine, 'collisionStart', (event) => {
        event.pairs.forEach((pair) => {
            console.log(`Collision detected between ${pair.bodyA.label} and ${pair.bodyB.label}`);
            // Add specific interaction logic here
        });
    });
}

// Execute the initial setup
initPhysics();
handleMaterialInteractions();

// Setup rendering (for visualization in the browser)
const render = Matter.Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false, // Set to false to see the colors
    },
});

// Run the engine and renderer
Matter.Engine.run(engine);
Matter.Render.run(render);

// Allow adding particles on mouse click
window.addEventListener('click', function(event) {
    // Example: add sand particle on click. Replace 'sand' with variable to change material dynamically.
    addParticle(event.clientX, event.clientY, 'sand');
});

// Export the necessary functions if needed elsewhere
export { addParticle, update, engine };
