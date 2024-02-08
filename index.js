document.addEventListener('DOMContentLoaded', function() {
    const engine = Matter.Engine.create();
    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false
        }
    });

    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 20, { isStatic: true });
    Matter.World.add(engine.world, ground);

    let isMouseDown = false;
    let currentMaterial = 'sand';
    const materials = {
        sand: { density: 0.002, restitution: 0.5, color: '#f4e04d' },
        water: { density: 0.001, restitution: 0.1, color: '#3498db' },
        oil: { density: 0.0012, restitution: 0.1, color: '#101010', isFluid: true },
        rock: { density: 0.004, restitution: 0.6, color: '#7f8c8d' },
        lava: { density: 0.003, restitution: 0.3, color: '#e74c3c' },
        antimatter: { density: 0.001, restitution: 1.0, color: '#8e44ad', isAntimatter: true }
    };

    function createParticle(x, y, material) {
        const options = Object.assign({}, materials[material], {
            render: { fillStyle: materials[material].color }
        });
        const particle = Matter.Bodies.circle(x, y, 5, options);
        Matter.World.add(engine.world, particle);
        checkForInteractions(particle);
    }

    function checkForInteractions(particle) {
    // Listen for collision events involving the newly created particle
    Matter.Events.on(engine, 'collisionStart', function(event) {
        event.pairs.forEach(function(pair) {
            // Determine which particle is the one we're interested in
            let other;
            if (pair.bodyA === particle) {
                other = pair.bodyB;
            } else if (pair.bodyB === particle) {
                other = pair.bodyA;
            } else {
                return; // Neither of the colliding bodies is the particle we're interested in
            }

            // Implement specific interaction logic
            if (particle.materialName === 'water' && other.materialName === 'lava') {
                createObsidian(particle.position);
                // Remove the water and lava particles
                Matter.World.remove(world, [particle, other]);
            } else if (particle.materialName === 'oil' && other.materialName === 'lava') {
                triggerExplosion(particle.position);
                // Remove the oil particle, lava might remain or transform
                Matter.World.remove(world, particle);
            } else if (particle.materialName === 'antimatter') {
                // Annihilate both particles
                Matter.World.remove(world, [particle, other]);
            }
            // Additional interactions can be defined similarly
        });
    });
}

function createObsidian(position) {
    // Create an obsidian particle at the specified position
    let obsidian = Matter.Bodies.circle(position.x, position.y, 5, {
        density: 0.004, // Example properties
        restitution: 0.1,
        render: { fillStyle: '#4B0082' } // Indigo, for example
    });
    Matter.World.add(world, obsidian);
}

function triggerExplosion(position) {
    // Example explosion effect: create several small particles simulating debris
    for (let i = 0; i < 10; i++) {
        let angle = Math.random() * 2 * Math.PI;
        let speed = Math.random() * 5 + 5;
        let debris = Matter.Bodies.circle(position.x, position.y, 2, {
            render: { fillStyle: '#FFA500' } // Orange debris, for example
        });
        Matter.Body.setVelocity(debris, { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed });
        Matter.World.add(world, debris);
    }
}


    window.addEventListener('mousedown', () => isMouseDown = true);
    window.addEventListener('mouseup', () => isMouseDown = false);
    window.addEventListener('mousemove', function(event) {
        if (isMouseDown) {
            createParticle(event.clientX, event.clientY, currentMaterial);
        }
    });

    setupUI();

    Matter.Engine.run(engine);
    Matter.Render.run(render);

    function setupUI() {
        const materialSelector = document.getElementById('materialSelector');
        Object.keys(materials).forEach(material => {
            let button = document.createElement('button');
            button.innerText = material;
            button.addEventListener('click', () => currentMaterial = material);
            materialSelector.appendChild(button);
        });
    }
});
