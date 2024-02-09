import Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/dist=es2019,mode=imports/optimized/matter-js.js';
import { initPhysics, addParticle, addWalls } from './physics.js';
import { screenToWorld } from './utils.js';
import { handleInteractions } from './interactions.js';

// Assuming initPhysics is an async function that initializes the physics engine, world, and renderer.
initPhysics().then(({ engine, world, render }) => {
    addWalls(engine, world); // Ensure walls are added to contain particles within the canvas.

    // Define various materials with their properties.
    const materials = {
        sand: { density: 0.002, friction: 0.5, color: '#f4e04d', label: 'Sand' },
        water: { density: 0.001, friction: 0.0, color: '#3498db', label: 'Water', isLiquid: true },
        oil: { density: 0.0012, friction: 0.01, color: '#34495e', label: 'Oil', isLiquid: true },
        rock: { density: 0.004, friction: 0.6, color: '#7f8c8d', label: 'Rock' },
        lava: { density: 0.003, friction: 0.2, color: '#e74c3c', label: 'Lava', isLiquid: true, temperature: 1200 },
        ice: { density: 0.0009, friction: 0.1, color: '#a8e0ff', label: 'Ice', restitution: 0.8 },
        rubber: { density: 0.001, friction: 1.0, color: '#ff3b3b', label: 'Rubber', restitution: 0.9 },
        steel: { density: 0.008, friction: 0.4, color: '#8d8d8d', label: 'Steel' },
        glass: { density: 0.0025, friction: 0.1, color: '#c4faf8', label: 'Glass', restitution: 0.5 },
        wood: { density: 0.003, friction: 0.6, color: '#deb887', label: 'Wood' },
        antimatter: { density: 0.0, friction: 0.0, color: '#8e44ad', label: 'Antimatter', restitution: 1.0, isAntimatter: true },
    };

    let currentMaterial = 'sand'; // Default material

    // Setup the UI for material selection
    setupMaterialSelector(materials, (selectedMaterial) => {
        currentMaterial = selectedMaterial;
    });

    // Setup feature buttons like gravity inversion and time dilation
    setupFeatureButtons(engine);

    // Handle mouse events for creating particles
    handleMouseEvents(render, materials, (x, y) => {
        addParticle(x, y, currentMaterial, materials[currentMaterial], world);
    });

    // Start the Matter.js engine and renderer
    Matter.Engine.run(engine);
    Matter.Render.run(render);

    // Ensure interactions between materials are handled
    handleInteractions(engine, world);
});

function setupMaterialSelector(materials, onMaterialSelected) {
    const selector = document.createElement('div');
    selector.style.position = 'fixed';
    selector.style.bottom = '10px';
    selector.style.left = '50%';
    selector.style.transform = 'translateX(-50%)';
    document.body.appendChild(selector);

    Object.entries(materials).forEach(([materialKey, material]) => {
        const button = document.createElement('button');
        button.textContent = material.label;
        button.onclick = () => onMaterialSelected(materialKey);
        selector.appendChild(button);
    });
}
function setupFeatureButtons(engine) {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.id = 'featureButtons';
    document.body.appendChild(buttonsContainer);

    // Invert Gravity Button
    const invertGravityBtn = document.createElement('button');
    invertGravityBtn.textContent = 'Invert Gravity';
    invertGravityBtn.onclick = () => engine.world.gravity.y *= -1;
    buttonsContainer.appendChild(invertGravityBtn);

    // Time Dilation Button
    const timeDilationBtn = document.createElement('button');
    timeDilationBtn.textContent = 'Toggle Time Dilation';
    timeDilationBtn.onclick = () => engine.timing.timeScale = engine.timing.timeScale === 1 ? 0.5 : 1;
    buttonsContainer.appendChild(timeDilationBtn);
}

function handleMouseEvents(engine, render, world, materials) {
    let isMouseDown = false;
    render.canvas.addEventListener('mousedown', (event) => {
        isMouseDown = true;
        createParticle(event);
    });

    document.addEventListener('mousemove', (event) => {
        if (isMouseDown) {
            createParticle(event);
        }
    });

    document.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    function createParticle(event) {
        const { x, y } = screenToWorld(event.clientX, event.clientY, render.canvas);
        if (materials[currentMaterial]) {
            addParticle(x, y, currentMaterial, world);
        }
    }
}

// Register interaction handling
handleInteractions(engine, world);
