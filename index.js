// Define global variables for the engine, world, and current material.
let engine, world, currentMaterial = 'sand';

document.addEventListener('DOMContentLoaded', function () {
    // Initialize the Matter.js engine and world.
    engine = Matter.Engine.create();
    world = engine.world;

    // Create a renderer using the full browser window size.
    let render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'transparent'
        }
    });

    // Setup ground to prevent particles from falling off screen.
    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 20, { isStatic: true });
    Matter.World.add(world, ground);

    // Setup UI for material selection.
    setupUI();

    // Run the engine and renderer.
    Matter.Engine.run(engine);
    Matter.Render.run(render);

    // Add event listener for mouse clicks to create particles.
    window.addEventListener('mousedown', function (event) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        // Add a particle at the mouse position with the current material.
        addParticle(mouseX, mouseY, currentMaterial);
    });
});

function setupUI() {
    const materialSelector = document.getElementById('materialSelector');
    if (!materialSelector) {
        console.warn('Material selector container not found!');
        return;
    }

    const materials = ['sand', 'water', 'oil', 'rock', 'lava', 'antimatter'];
    materials.forEach(material => {
        let button = document.createElement('button');
        button.innerText = material;
        button.onclick = () => setCurrentMaterial(material);
        materialSelector.appendChild(button);
    });
}

function setCurrentMaterial(material) {
    currentMaterial = material;
}

function addParticle(x, y, material) {
    // Placeholder for adding a particle; customize based on your material properties.
    // This example creates a simple circle body.
    const radius = 5; // Example radius, adjust based on the material if desired.
    const options = {
        density: 0.001, // Placeholder value, adjust based on the material.
        restitution: 0.8, // Bounciness, adjust based on the material.
    };
    const particle = Matter.Bodies.circle(x, y, radius, options);

    // Example customization based on material.
    switch (material) {
        case 'sand':
            // Adjust options for sand.
            break;
        case 'water':
            // Adjust options for water.
            break;
        // Add cases for other materials as needed.
    }

    Matter.World.add(world, particle);
}
