import Matter from 'https://cdn.skypack.dev/matter-js';

const { Body, Vertices, Vector } = Matter;

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
        y: (clientY - bounds.top) * scaleY,
    };
};

export function isInside(body, x, y) {
    return Vertices.contains(body.vertices, { x, y });
}

export function adjustMaterialProperties(body, properties) {
    Body.set(body, properties);
}

export function calculateMagnitude(vector) {
    return Vector.magnitude(vector);
}

export function applyForceTowardsPoint(body, point, strength) {
    const forceDirection = Vector.sub(point, body.position);
    const forceMagnitude = strength / Vector.magnitude(forceDirection);
    const force = Vector.mult(Vector.normalise(forceDirection), forceMagnitude);
    Body.applyForce(body, body.position, force);
}

export function normalizeVector(vector) {
    return Vector.normalise(vector);
}

export function randomVector(min, max) {
    return {
        x: Math.random() * (max - min) + min,
        y: Math.random() * (max - min) + min,
    };
}

export function rotateBodyAroundPoint(body, point, angle) {
    Body.setPosition(body, {
        x: point.x + Math.cos(angle) * (body.position.x - point.x) - Math.sin(angle) * (body.position.y - point.y),
        y: point.y + Math.sin(angle) * (body.position.x - point.x) + Math.cos(angle) * (body.position.y - point.y),
    });
}

// Assuming invertColor and padZero are correct as described.
