document.addEventListener('DOMContentLoaded', function () {
    const engine = Matter.Engine.create();
    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'transparent',
        }
    });

    // Define ground to keep particles within view
    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 10, window.innerWidth, 20, { isStatic: true, render: { fillStyle: '#959595' }});
    Matter.World.add(engine.world, ground);

    // Initial material setup
    let currentMaterial = 'sand';
    const materialOptions = {
        sand: { density: 0.002, restitution: 0.5, color: '#f4e04d' },
        water: { density: 0.001, restitution: 0.1, color: '#3498db' },
        oil: { density: 0.0012, restitution: 0.1, color: '#34495e' },
        rock: { density: 0.004, restitution: 0.6, color: '#7f8c8d' },
        lava: { density: 0.003, restitution: 0.3, color: '#e74c3c' },
        antimatter: { density: 0.001, restitution: 1.0, color: '#8e44ad', isAntimatter: true },
    };

    // UI setup for material selection
    setupUI();

    // Run the engine and render
    Matter.Engine.run(engine);
    Matter.Render.run(render);

    window.addEventListener('mousedown', function (event) {
        // Prevent interaction if clicked on UI
        if (event.target.tagName.toLowerCase() === 'button') return;
        
        // Add particle on click
        const { density, restitution, color, isAntimatter } = materialOptions[currentMaterial];
        let particle = Matter.Bodies.circle(event.clientX, event.clientY, 5, {
            density, restitution,
            render: { fillStyle: color },
            plugin: { isAntimatter }
        });
        Matter.World.add(engine.world, particle);
    });

    function setupUI() {
        const materialSelector = document.getElementById('materialSelector');
        if (!materialSelector) {
            console.error('Material selector container not found!');
            return;
        }
        materialSelector.innerHTML = ''; // Reset material selector

        Object.keys(materialOptions).forEach(material => {
            const button = document.createElement('button');
            button.innerText = material;
            button.onclick = () => setCurrentMaterial(material);
            materialSelector.appendChild(button);
        });

        // Set up feature buttons
        setupFeatureButtons();
    }

    function setCurrentMaterial(material) {
        currentMaterial = material;
    }

    function setupFeatureButtons() {
        // Example for gravity inversion, implement similarly for time dilation if needed
        const featureButtons = document.getElementById('featureButtons');
        featureButtons.innerHTML = ''; // Reset feature buttons to remove duplicates

        const gravityButton = document.createElement('button');
        gravityButton.innerText = 'Toggle Gravity';
        gravityButton.onclick = () => {
            engine.world.gravity.y = engine.world.gravity.y * -1;
        };
        featureButtons.appendChild(gravityButton);
    }
});
