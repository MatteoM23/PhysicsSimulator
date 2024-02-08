// Import Matter.js from Skypack CDN
import Matter from 'https://cdn.skypack.dev/matter-js';

// Setup the engine and world
const engine = Matter.Engine.create();
const world = engine.world;
engine.world.gravity.y = 1; // Apply gravity

// Define custom material properties
const materialProperties = {
    sand: { density: 0.002, friction: 0.5 },
    water: { density: 0.001, friction: 0.01 }
    // Add more materials as needed
};

// Initialize physics environment and ground
function initPhysics() {
    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 10, window.innerWidth, 20, { isStatic: true, render: { fillStyle: 'grey' } });
    Matter.World.add(world, ground);
}

// Function to handle material interactions, placeholder for demonstration
function handleInteractions() {
    Matter.Events.on(engine, 'collisionStart', (event) => {
        event.pairs.forEach((pair) => {
            const { bodyA, bodyB } = pair;
            // Example interaction: If sand hits water, do something specific
            // This is where you'd implement specific logic based on your game's rules
        });
    });
}

// Function to add particles of a given material type
function addParticle(x, y, materialType) {
    const properties = materialProperties[materialType];
    if (!properties) return; // Material type not recognized

    const particle = Matter.Bodies.circle(x, y, 5, {
        density: properties.density,
        friction: properties.friction,
        render: { fillStyle: properties.color || 'white' } // Default color if not specified
    });

    Matter.World.add(world, particle);
}

// Update the physics world
function update() {
    Matter.Engine.update(engine, 1000 / 60);
}

// Initialize physics and handle interactions
initPhysics();
handleInteractions();

// Expose functions if needed elsewhere
export { initPhysics, addParticle, update, engine, world };
