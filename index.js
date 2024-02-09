import Matter from 'https://cdn.skypack.dev/matter-js';

document.addEventListener('DOMContentLoaded', () => {
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

    // Add walls around the canvas
    addWalls(engine.world);

    const materials = {
        sand: { label: 'Sand', color: '#f4e04d', density: 0.002, size: 5 },
        water: { label: 'Water', color: '#3498db', density: 0.0001, size: 6, friction: 0, restitution: 0.1 },
        oil: { label: 'Oil', color: '#34495e', density: 0.0012, size: 6, friction: 0.05, restitution: 0.05, flammable: true },
        rock: { label: 'Rock', color: '#7f8c8d', density: 0.004, size: 8, friction: 0.6, restitution: 0.1 },
        lava: { label: 'Lava', color: '#e74c3c', density: 0.003, size: 7, friction: 0.2, restitution: 0.4, temperature: 1200 },
        ice: { label: 'Ice', color: '#a8e0ff', density: 0.0009, size: 6, friction: 0.1, restitution: 0.8 },
        rubber: { label: 'Rubber', color: '#ff3b3b', density: 0.001, size: 7, friction: 1.0, restitution: 0.9 },
        steel: { label: 'Steel', color: '#8d8d8d', density: 0.008, size: 10, friction: 0.4 },
        glass: { label: 'Glass', color: '#c4faf8', density: 0.0025, size: 5, friction: 0.1, restitution: 0.5 },
        wood: { label: 'Wood', color: '#deb887', density: 0.003, size: 8, friction: 0.6 },
        antimatter: { label: 'Antimatter', color: '#8e44ad', density: 0.001, size: 10, friction: 0.0, restitution: 1.0, isAntimatter: true },
    };

    let currentMaterial = 'sand';

    setupMaterialSelector(materials);
    setupFeatureButtons(engine);

    document.addEventListener('mousedown', function(event) {
        handleMouseDown(event, materials[currentMaterial]);
    });

    Matter.Engine.run(engine);
    Matter.Render.run(render);

    function setupMaterialSelector(materials) {
        const materialSelector = document.createElement('div');
        materialSelector.style.position = 'fixed';
        materialSelector.style.bottom = '20px';
        materialSelector.style.left = '50%';
        materialSelector.style.transform = 'translateX(-50%)';
        document.body.appendChild(materialSelector);

        Object.keys(materials).forEach(materialKey => {
            const button = document.createElement('button');
            button.innerText = materials[materialKey].label;
            button.onclick = () => currentMaterial = materialKey;
            materialSelector.appendChild(button);
        });
    }

    function setupFeatureButtons(engine) {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.position = 'fixed';
    buttonsContainer.style.bottom = '100px'; // Adjust as necessary
    buttonsContainer.style.left = '50%';
    buttonsContainer.style.transform = 'translateX(-50%)';
    document.body.appendChild(buttonsContainer);

    // Gravity Inversion Button
    const gravityButton = document.createElement('button');
    gravityButton.innerText = 'Invert Gravity';
    gravityButton.addEventListener('click', () => {
        engine.world.gravity.y *= -1; // Invert gravity
    });
    buttonsContainer.appendChild(gravityButton);

    // Time Dilation Button
    const timeButton = document.createElement('button');
    timeButton.innerText = 'Toggle Time Dilation';
    timeButton.addEventListener('click', () => {
        engine.timing.timeScale = engine.timing.timeScale === 1 ? 0.5 : 1; // Toggle time dilation between normal and half speed
    });
    buttonsContainer.appendChild(timeButton);
}


    function handleMouseDown(event, material) {
        const { x, y } = screenToWorld(event.clientX, event.clientY); // Ensure screenToWorld properly converts coordinates
        createParticle(x, y, material);
    }

    function createParticle(x, y, material) {
    const particle = Matter.Bodies.circle(x, y, material.size, {
        density: material.density,
        friction: material.friction ?? 0.1,
        restitution: material.restitution ?? 0,
        render: { fillStyle: material.color },
    });
    Matter.World.add(engine.world, particle);
}

