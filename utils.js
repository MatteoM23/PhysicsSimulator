import Matter from 'https://cdn.skypack.dev/matter-js';

// Destructure necessary components from Matter for enhanced usability
const { Body, Vertices, Vector } = Matter;

// Improved screenToWorld function for accuracy and efficiency
function screenToWorld(clientX, clientY, render) {
    const bounds = render.canvas.getBoundingClientRect();
    const scaleX = render.options.width / bounds.width;
    const scaleY = render.options.height / bounds.height;
    return {
        x: (clientX - bounds.left) * scaleX,
        y: (clientY - bounds.top) * scaleY
    };
}

// Enhanced isInside function for better readability
function isInside(body, x, y) {
    return Vertices.contains(body.vertices, { x, y });
}

// More concise adjustMaterialProperties using Body.set directly
function adjustMaterialProperties(body, properties) {
    Body.set(body, properties);
}

// Utilizing Matter.js Vector.magnitude for calculateMagnitude
function calculateMagnitude(vector) {
    return Vector.magnitude(vector);
}

// Improved applyForceTowardsPoint to include normalization using Matter.Vector
function applyForceTowardsPoint(body, point, strength) {
    const forceDirection = Vector.sub(point, body.position);
    const forceMagnitude = strength / calculateMagnitude(forceDirection);
    const force = Vector.mult(Vector.normalise(forceDirection), forceMagnitude);
    Body.applyForce(body, body.position, force);
}

// Simplified normalizeVector utilizing Vector.normalise
function normalizeVector(vector) {
    return Vector.normalise(vector);
}

// Additional utility function to create a random vector within a range
function randomVector(min, max) {
    return {
        x: Math.random() * (max - min) + min,
        y: Math.random() * (max - min) + min
    };
}

// Additional utility function to rotate a body around a point
function rotateBodyAroundPoint(body, point, angle) {
    Body.setPosition(body, {
        x: point.x + Math.cos(angle) * (body.position.x - point.x) - Math.sin(angle) * (body.position.y - point.y),
        y: point.y + Math.sin(angle) * (body.position.x - point.x) + Math.cos(angle) * (body.position.y - point.y)
    });
}

export {
    screenToWorld,
    isInside,
    adjustMaterialProperties,
    calculateMagnitude,
    applyForceTowardsPoint,
    normalizeVector,
    randomVector,
    rotateBodyAroundPoint
};
