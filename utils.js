import Matter from 'https://cdn.skypack.dev/matter-js';

// Destructure necessary components from Matter for enhanced usability
const { Body, Vertices, Vector } = Matter;

// Improved screenToWorld function for accuracy and efficiency
export const screenToWorld = (clientX, clientY, render) => {
    if (!render || !render.canvas) {
        console.error("Render object or its canvas is not available.");
        return { x: 0, y: 0 };
    }
    const bounds = render.canvas.getBoundingClientRect();
    const scaleX = render.options.width / bounds.width;
    const scaleY = render.options.height / bounds.height;
    return {
        x: (clientX - bounds.left) * scaleX,
        y: (clientY - bounds.top) * scaleY
    };
};

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

export const invertColor = (hex, bw) => {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // Convert hex to RGB
    const r = parseInt(hex.substr(0,2), 16);
    const g = parseInt(hex.substr(2,2), 16);
    const b = parseInt(hex.substr(4,2), 16);
    // Invert color components
    const rInv = (255 - r).toString(16).padStart(2, '0');
    const gInv = (255 - g).toString(16).padStart(2, '0');
    const bInv = (255 - b).toString(16).padStart(2, '0');
    // Reconstruct inverted hex color
    const hexInv = `#${rInv}${gInv}${bInv}`;
    
    // If black and white conversion is needed
    if (bw) {
        // Convert to grayscale and check if the color is closer to black or white
        const isBright = (r * 0.299 + g * 0.587 + b * 0.114) > 186;
        return isBright ? '#000000' : '#FFFFFF';
    }
    
    return hexInv;
};

export const padZero = (str, length = 2) => {
    const zeros = new Array(length).join('0');
    return (zeros + str).slice(-length);
};

export {
    isInside,
    adjustMaterialProperties,
    calculateMagnitude,
    applyForceTowardsPoint,
    normalizeVector,
    randomVector,
    rotateBodyAroundPoint
};
