import { world, initPhysics, addParticle } from './physics.js';

let currentMaterial = 'sand'; // Default material

document.addEventListener('DOMContentLoaded', () => {
    new p5((sketch) => {
        sketch.setup = () => {
            sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
            initPhysics(); // Initialize the physics engine
            setupUI();
        };

        sketch.draw = () => {
            sketch.background(51);
            if (sketch.mouseIsPressed) {
                if (sketch.mouseY < sketch.height - 100) { // Check to prevent particle creation in UI area
                    addParticle(sketch.mouseX, sketch.mouseY, currentMaterial);
                }
            }
            drawBodies(world.bodies, sketch); // Draw all bodies in the world
        };
    });
});

function setupUI() {
    const materialSelector = document.getElementById('materialSelector');
    materialSelector.innerHTML = ''; // Prevent duplicate buttons
    const materials = ['sand', 'water', 'oil', 'rock', 'lava'];
    
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

// Function to draw all bodies in the Matter.js world
function drawBodies(bodies, sketch) {
    for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        sketch.fill(body.render.fillStyle);
        sketch.beginShape();
        for (let part of body.parts) {
            for (let vertex of part.vertices) {
                sketch.vertex(vertex.x, vertex.y);
            }
        }
        sketch.endShape(sketch.CLOSE);
    }
}
