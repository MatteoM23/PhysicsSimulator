// utils.js
// Ensure Matter.js is accessible in the global scope

// Converts screen coordinates to physics world coordinates, assuming a 1:1 scale for simplicity
function screenToWorld(x, y) {
    return { x, y };
}

// Checks if a point is inside a body, useful for interactive elements
function isInside(body, x, y) {
    return Matter.Vertices.contains(body.vertices, { x, y });
}

// Dynamically adjusts material properties for real-time physics experimentation
function adjustMaterialProperties(body, properties) {
    Object.entries(properties).forEach(([key, value]) => {
        body[key] = value;
    });
    Matter.Body.set(body, properties);
}

// Generates random colors for materials
function getRandomColor() {
    return '#' + Array.from({ length: 6 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

// Calculates the magnitude of a vector
function calculateMagnitude(vector) {
    return Math.sqrt(vector.x ** 2 + vector.y ** 2);
}

// Applies a force to a body directing it towards a specific point in space
function applyForceTowardsPoint(body, point, strength) {
    const dx = point.x - body.position.x;
    const dy = point.y - body.position.y;
    const distance = calculateMagnitude({ x: dx, y: dy });
    const force = {
        x: (dx / distance) * strength,
        y: (dy / distance) * strength,
    };
    Matter.Body.applyForce(body, body.position, force);
}

// Normalizes a vector to point in the same direction but with a magnitude of 1
function normalizeVector(vector) {
    const magnitude = calculateMagnitude(vector);
    return {
        x: vector.x / magnitude,
        y: vector.y / magnitude,
    };
}

// Example corrected export statement for utils.js
export { screenToWorld, isInside, adjustMaterialProperties, getRandomColor, calculateMagnitude, applyForceTowardsPoint, normalizeVector };
