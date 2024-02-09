import * as Matter from 'https://cdn.skypack.dev/pin/matter-js@v0.19.0-Our0SQaqYsMskgmyGYb4/mode=imports/optimized/matter-js.js';

// Access relevant parts from the Matter namespace
const { Body, Vertices, Render } = Matter;

// Converts screen coordinates to physics world coordinates
function screenToWorld(clientX, clientY, render) {
    const point = { x: clientX, y: clientY };
    return Render.screenToWorld(render, point);
}

// Checks if a point is inside a body, useful for interactive elements
function isInside(body, x, y) {
    return Vertices.contains(body.vertices, { x, y });
}

// Dynamically adjusts material properties for real-time physics experimentation
function adjustMaterialProperties(body, properties) {
    Object.entries(properties).forEach(([key, value]) => {
        if (body[key] !== undefined) {
            body[key] = value;
        }
    });
    Body.set(body, properties);
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
    const forceMagnitude = strength / distance; // Adjust the strength based on distance
    const force = {
        x: (dx / distance) * forceMagnitude,
        y: (dy / distance) * forceMagnitude,
    };
    Body.applyForce(body, body.position, force);
}

// Normalizes a vector to have a magnitude of 1
function normalizeVector(vector) {
    const magnitude = calculateMagnitude(vector);
    return {
        x: vector.x / magnitude,
        y: vector.y / magnitude,
    };
}

export {
    screenToWorld,
    isInside,
    adjustMaterialProperties,
    calculateMagnitude,
    applyForceTowardsPoint,
    normalizeVector
};
