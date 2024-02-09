import Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/dist=es2019,mode=imports/optimized/matter-js.js';
import { initPhysics, addParticle, addWalls } from './physics.js';
import { screenToWorld } from './utils.js';
import { handleInteractions } from './interactions.js';

document.addEventListener('DOMContentLoaded', () => {
    const { engine, world, render } = initPhysics({
        width: window.innerWidth,
        height: window.innerHeight,
        setupMaterialSelector(materials)
    });

    // Ensure the walls are added after the engine and render have been initialized.
    addWalls(world);

    const materials = {
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

    let currentMaterial = 'sand';

    setupMaterialSelector(materials);
    setupFeatureButtons(engine);
    handleMouseEvents(engine, render, world, materials);

    Matter.Engine.run(engine);
    Matter.Render.run(render);

    function setupMaterialSelector(materials) {
    const materialSelector = document.getElementById('materialSelector');
    if (!materialSelector) {
        console.error('Material selector container not found');
        return;
    }

    Object.entries(materials).forEach(([materialKey, material]) => {
        const button = document.createElement('button');
        button.innerText = materialKey; // Display the key or you could use material.label if it exists
        button.style.backgroundColor = material.color; // Optional: Style button with material color
        button.onclick = () => {
            currentMaterial = materialKey;
            console.log(`Current material: ${currentMaterial}`);
        };
        materialSelector.appendChild(button);
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
                addParticle(x, y, materials[currentMaterial], world);
            }
        }
    }

    // Registering interaction handling
    handleInteractions(engine, world);
});
