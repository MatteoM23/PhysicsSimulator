import Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/mode=imports/optimized/matter-js.js';

// Initialize physics environment and return engine, world, and render for further use
export function initPhysics() {
    const engine = Matter.Engine.create();
    const world = engine.world;
    engine.world.gravity.y = 1; // Apply default gravity

    // Define ground and walls
    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 30, window.innerWidth, 60, {
        isStatic: true,
        render: { fillStyle: '#464646' }
    });

    Matter.World.add(world, ground);
    addWalls(world, engine);

    // Setup rendering
    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
        },
    });

    // Run the engine and renderer
    Matter.Engine.run(engine);
    Matter.Render.run(render);

    return { engine, world, render }; // Return necessary objects
}

// Material properties
const materialProperties = {
    sand: { density: 0.002, friction: 0.5, color: '#f4e04d' },
    water: { density: 0.001, friction: 0.0, color: '#3498db', isLiquid: true },
    oil: { density: 0.0012, friction: 0.01, color: '#34495e', isLiquid: true },
    rock: { density: 0.004, friction: 0.6, color: '#7f8c8d' },
    lava: { density: 0.003, friction: 0.2, color: '#e74c3c', isLiquid: true, temperature: 1200 },
    ice: { density: 0.0009, friction: 0.1, color: '#a8e0ff', restitution: 0.8 },
    rubber: { density: 0.001, friction: 1.0, color: '#ff3b3b', restitution: 0.9 },
    steel: { density: 0.008, friction: 0.4, color: '#8d8d8d' },
    glass: { density: 0.0025, friction: 0.1, color: '#c4faf8', restitution: 0.5 },
    wood: { density: 0.003, friction: 0.6, color: '#deb887' },
    antimatter: { density: 0.0, friction: 0.0, color: '#8e44ad', restitution: 1.0, isAntimatter: true }
};


// Add particles of a given material type
export function addParticle(x, y, materialType, world) {
    const properties = materialProperties[materialType];
    if (!properties) {
        console.error('Material type not recognized');
        return;
    }
    const particle = Matter.Bodies.circle(x, y, 10, { // Adjusted size for demonstration
        render: { fillStyle: properties.color },
        density: properties.density,
        friction: properties.friction,
    });
    Matter.World.add(world, particle);
}

// Add walls to contain the particles
function addWalls(world, engine) {
    const thickness = 50;
    const walls = [
        Matter.Bodies.rectangle(engine.render.options.width / 2, 0 - thickness / 2, engine.render.options.width, thickness, { isStatic: true }),
        Matter.Bodies.rectangle(engine.render.options.width / 2, engine.render.options.height + thickness / 2, engine.render.options.width, thickness, { isStatic: true }),
        Matter.Bodies.rectangle(0 - thickness / 2, engine.render.options.height / 2, thickness, engine.render.options.height, { isStatic: true }),
        Matter.Bodies.rectangle(engine.render.options.width + thickness / 2, engine.render.options.height / 2, thickness, engine.render.options.height, { isStatic: true })
    ];
    walls.forEach(wall => Matter.World.add(world, wall));
}
