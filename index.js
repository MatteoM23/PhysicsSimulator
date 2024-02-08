// Assuming you're importing Matter.js functionality as needed
import { initPhysics, addParticle, createGravityInversionField, createTimeDilationField } from './physics.js';

// Create a new p5 instance by passing a sketch function
new p5((sketch) => {
    let currentMaterial = 'sand'; // Default material

    sketch.setup = () => {
        sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
        initPhysics(); // Initialize your physics engine here
        setupUI(); // Set up your UI here, this function needs to be defined to interact with the DOM
    };

    sketch.draw = () => {
        sketch.background(51); // Set the background color of the canvas
    };

    sketch.mousePressed = () => {
        // Check if the mouse press is within the canvas and not on the UI
        if (sketch.mouseY < sketch.height - 50) {
            addParticle(sketch.mouseX, sketch.mouseY, currentMaterial);
        }
    };

    function setupUI() {
        // Example: Setup your UI here
        // This should interact with DOM elements directly, not through p5
        const selector = document.getElementById('materialSelector');
        const materials = ['sand', 'water', 'oil', 'rock', 'lava']; // Define available materials
        materials.forEach(material => {
            let button = document.createElement('button');
            button.innerText = material;
            button.addEventListener('click', () => setCurrentMaterial(material));
            selector.appendChild(button);
        });
    }

    function setCurrentMaterial(material) {
        currentMaterial = material;
        console.log(`Current material set to: ${currentMaterial}`);
    }
});

// Note: Ensure the rest of your functions like `initPhysics`, `addParticle`, `createGravityInversionField`, and `createTimeDilationField` are defined in their respective modules and are correctly imported here.
