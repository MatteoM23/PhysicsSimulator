document.addEventListener('DOMContentLoaded', function () {
    let engine = Matter.Engine.create();
    let world = engine.world;
    engine.world.gravity.y = 1;

    let render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'transparent',
        },
    });

    let currentMaterial = 'sand';
    const materialOptions = {
        sand: { density: 0.002, restitution: 0.5, color: '#f4e04d' },
        water: { density: 0.001, restitution: 0.1, color: '#3498db' },
        oil: { density: 0.0012, restitution: 0.1, color: '#34495e' },
        rock: { density: 0.004, restitution: 0.6, color: '#7f8c8d' },
        lava: { density: 0.003, restitution: 0.3, color: '#e74c3c' },
        antimatter: { density: 0.001, restitution: 1.0, color: '#8e44ad', isAntimatter: true },
    };

    const features = {
        gravityInversion: { isActive: false },
        timeDilation: { isActive: false, factor: 0.5 },
    };

    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 20, { isStatic: true });
    Matter.World.add(world, ground);

    setupUI();
    Matter.Engine.run(engine);
    Matter.Render.run(render);

    window.addEventListener('mousedown', function (event) {
        if (event.target.tagName.toLowerCase() === 'button') return;
        addParticle(event.clientX, event.clientY, currentMaterial);
    });

    function setupUI() {
        const materialSelector = document.getElementById('materialSelector');
        Object.keys(materialOptions).forEach(material => {
            let button = document.createElement('button');
            button.innerText = material;
            button.addEventListener('click', () => setCurrentMaterial(material));
            materialSelector.appendChild(button);
        });

        // Feature buttons setup
        const featureButtons = document.getElementById('featureButtons');
        Object.keys(features).forEach(feature => {
            let button = document.createElement('button');
            button.innerText = feature.replace(/([A-Z])/g, ' $1').trim(); // Convert camelCase to Normal Case
            button.addEventListener('click', () => toggleFeature(feature));
            featureButtons.appendChild(button);
        });
    }

    function setCurrentMaterial(material) {
        currentMaterial = material;
    }

    function addParticle(x, y, material) {
        const { density, restitution, color, isAntimatter } = materialOptions[material];
        let particle = Matter.Bodies.circle(x, y, 5, {
            density, restitution,
            render: { fillStyle: color },
            plugin: { isAntimatter: !!isAntimatter }
        });
        Matter.World.add(world, particle);
    }

    function toggleFeature(feature) {
        features[feature].isActive = !features[feature].isActive;
        applyFeatureEffects();
    }

    function applyFeatureEffects() {
        if (features.gravityInversion.isActive) {
            world.gravity.y = world.gravity.y * -1; // Invert gravity
        } else {
            world.gravity.y = Math.abs(world.gravity.y); // Ensure gravity is normal
        }

        // Time dilation could be complex to implement directly as it would require altering the engine's timing mechanism.
        // As an alternative, consider adjusting the velocity of all bodies to simulate time dilation.
    }
});
