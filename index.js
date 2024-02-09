import Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/mode=imports/optimized/matter-js.js';

// Assuming materials.js is set up correctly, simulate its structure for the example
const materials = {
    sand: { label: 'Sand', options: { density: 0.002, restitution: 0.3 } },
    water: { label: 'Water', options: { density: 0.001, restitution: 0.1 } },
    oil: { label: 'Oil', options: { density: 0.0012, restitution: 0.05 } },
};

let currentMaterial = 'sand'; // Default material

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

    // Create invisible walls
    const addWalls = () => {
        const wallThickness = 50;
        const walls = [
            Matter.Bodies.rectangle(render.options.width / 2, 0, render.options.width + wallThickness, wallThickness, { isStatic: true }),
            Matter.Bodies.rectangle(render.options.width / 2, render.options.height, render.options.width + wallThickness, wallThickness, { isStatic: true }),
            Matter.Bodies.rectangle(0, render.options.height / 2, wallThickness, render.options.height + wallThickness, { isStatic: true }),
            Matter.Bodies.rectangle(render.options.width, render.options.height / 2, wallThickness, render.options.height + wallThickness, { isStatic: true })
        ];
        Matter.World.add(engine.world, walls);
    };
    addWalls();

    // Dynamic Material Selector
    const materialSelector = document.createElement('div');
    materialSelector.style.position = 'fixed';
    materialSelector.style.top = '0';
    materialSelector.style.left = '50%';
    materialSelector.style.transform = 'translateX(-50%)';
    materialSelector.style.display = 'flex';
    materialSelector.style.justifyContent = 'center';
    materialSelector.style.zIndex = '1';
    document.body.appendChild(materialSelector);

    Object.entries(materials).forEach(([key, value]) => {
        const btn = document.createElement('button');
        btn.textContent = value.label;
        btn.onclick = () => {
            currentMaterial = key;
        };
        materialSelector.appendChild(btn);
    });

    // Particle creation logic
    const createParticle = (x, y, material) => {
        const properties = materials[material].options;
        const particle = Matter.Bodies.circle(x, y, 20, { ...properties, render: { fillStyle: materials[material].color || '#ffffff' } });
        Matter.World.add(engine.world, particle);
    };

    document.body.addEventListener('mousedown', (event) => {
        // Exclude clicks on the material selector
        if (event.target !== materialSelector && event.target.parentNode !== materialSelector) {
            const x = event.clientX, y = event.clientY;
            createParticle(x, y, currentMaterial);
        }
    });

    Matter.Engine.run(engine);
    Matter.Render.run(render);
});
