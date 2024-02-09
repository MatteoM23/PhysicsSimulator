// Import the required namespaces from Matter.js directly
import Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/mode=imports/optimized/matter-js.js';

// Destructure necessary components from Matter for convenience
const { Body, Vertices } = Matter;

// Adjusts the screenToWorld function to work without direct access to Render's screenToWorld, assuming Render instance is passed correctly
function screenToWorld(clientX, clientY, render) {
    const point = { x: clientX, y: clientY };
    // Assuming 'render' is an instance of Matter.Render with the viewport properly set up
    return Matter.Render.screenToWorld(render, point);
}

// Other utility functions remain the same as they don't directly interact with Render
function isInside(body, x, y) {
    return Vertices.contains(body.vertices, { x, y });
}

function adjustMaterialProperties(body, properties) {
    Object.entries(properties).forEach(([key, value]) => {
        if (body[key] !== undefined) {
            body[key] = value;
        }
    });
    Body.set(body, properties);
}

function calculateMagnitude(vector) {
    return Math.sqrt(vector.x ** 2 + vector.y ** 2);
}

function applyForceTowardsPoint(body, point, strength) {
    const dx = point.x - body.position.x;
    const dy = point.y - body.position.y;
    const distance = calculateMagnitude({ x: dx, y: dy });
    const forceMagnitude = strength / distance; // Adjust the strength based on distance
    const force = {
        x: (dx / distance) * forceMagnitude,
        y: (dy / distance) * forceMagnitude,
    };
    Body.applyForce(body, body.position, force);
}

function normalizeVector(vector) {
    const magnitude = calculateMagnitude(vector);
    return {
        x: vector.x / magnitude,
        y: vector.y / magnitude,
    };
}

// Export the functions for use in other modules
export {
    screenToWorld,
    isInside,
    adjustMaterialProperties,
    calculateMagnitude,
    applyForceTowardsPoint,
    normalizeVector
};
