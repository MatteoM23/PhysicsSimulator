// Import necessary functions from your physics script
import { initPhysics, addParticle, createGravityInversionField, createTimeDilationField } from './physics.js';

// Define the current material with a default value
let currentMaterial = 'sand';

// Initialize a new p5 instance
new p5((sketch) => {
    // p5.js setup function
    sketch.setup = () => {
        // Create a canvas that fills the window
        sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);

        // Initialize the physics engine
        initPhysics();

        // Set up the UI for material selection
        setupUI();
    };

    // p5.js draw function
    sketch.draw = () => {
        // Set the background color of the canvas
        sketch.background(51);
    };

    // Function to handle mouse pressed events
    sketch.mousePressed = () => {
        // Check if the mouse press is within the canvas and not on the UI
        if (sketch.mouseY < sketch.height - 50) {
            // Add a particle at the mouse location with the current material
            addParticle(sketch.mouseX, sketch.mouseY, currentMaterial);
        }
    };

    // Function to set up the UI for material selection
    function setupUI() {
        const selector = document.getElementById('materialSelector');
        const materials = ['sand', 'water', 'oil', 'rock', 'lava']; // Define available materials

        // Create a button for each material
        materials.forEach((material) => {
            let button = document.createElement('button');
            button.innerText = material;
            button.onclick = () => setCurrentMaterial(material);
            selector.appendChild(button);
        });
    }

    // Function to set the current material based on user selection
    function setCurrentMaterial(material) {
        currentMaterial = material;
        console.log(`Current material set to: ${currentMaterial}`); // For debugging purposes
    }
});
