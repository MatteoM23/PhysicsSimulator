// index.js

// Assuming global access to Matter.js functions and custom physics and materials logic
let engine, world;
let currentMaterial = 'sand'; // Default material
const materials = ['sand', 'water', 'oil', 'rock', 'lava']; // Available materials

document.addEventListener("DOMContentLoaded", function() {
    setup();
});

function setup() {
    // Ensure Matter.js is initialized first
    initPhysics(); // Initialize the physics engine

    createCanvas(windowWidth, windowHeight);
    setupUI(); // Setup all UI components
}

function draw() {
    background(51); // Set canvas background color
    // Optional: Render logic for particles or other entities
}

function mousePressed() {
    // Ensure we don't create particles where the UI might be, and within canvas bounds
    if (mouseY < height - 50 && mouseY > 0 && mouseX > 0 && mouseX < width) {
        createParticle(mouseX, mouseY, currentMaterial);
    }
}

function setupUI() {
    // Dynamically generate material selection buttons
    const selector = document.createElement('div');
    selector.id = 'materialSelector';
    document.body.appendChild(selector);

    materials.forEach(material => {
        const button = document.createElement('button');
        button.innerText = material;
        button.className = 'materialButton';
        button.addEventListener('click', () => setCurrentMaterial(material));
        selector.appendChild(button);
    });

    setupFeatureButtons();
}

function setCurrentMaterial(materialType) {
    currentMaterial = materialType;
    console.log(`Current material set to: ${currentMaterial}`);
}

function setupFeatureButtons() {
    // Create container for feature buttons if it doesn't exist
    const featuresContainer = document.getElementById('featuresContainer') || document.createElement('div');
    featuresContainer.id = 'featuresContainer';
    document.body.appendChild(featuresContainer);

    // Button for Gravity Inversion
    const gravityInversionBtn = document.createElement('button');
    gravityInversionBtn.innerText = 'Gravity Inversion';
    gravityInversionBtn.addEventListener('click', () => {
        createGravityInversionField(width / 2, height / 2, 200, 1.5);
    });
    featuresContainer.appendChild(gravityInversionBtn);

    // Button for Time Dilation
    const timeDilationBtn = document.createElement('button');
    timeDilationBtn.innerText = 'Time Dilation';
    timeDilationBtn.addEventListener('click', () => {
        createTimeDilationField(400, 300, 150, 0.5);
    });
    featuresContainer.appendChild(timeDilationBtn);
}

// Ensure the following functions are defined in your physics.js or materials.js:
// createParticle(x, y, materialType) - For creating particles of selected materials.
// createGravityInversionField(x, y, radius, strength) - For activating a gravity inversion field.
// createTimeDilationField(x, y, radius, dilationFactor) - For applying a time dilation effect.
