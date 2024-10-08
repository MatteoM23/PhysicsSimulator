Skip to content
Navigation Menu
MatteoM23
/
PhysicsSimulator

Type / to search
Code
Issues
Pull requests
Actions
Projects
Wiki
Security
Insights
Settings
Commit
Update utils.js
 main
@MatteoM23
MatteoM23 committed on Feb 27 
1 parent aa151cd
commit 927f4ad
Showing 1 changed file with 19 additions and 61 deletions.
  80 changes: 19 additions & 61 deletions80  
utils.js
Original file line number	Diff line number	Diff line change
@@ -1,9 +1,7 @@
import Matter from 'https://cdn.skypack.dev/matter-js';

// Destructure necessary components from Matter for enhanced usability
const { Body, Vertices, Vector } = Matter;

// Improved screenToWorld function for accuracy and efficiency
export const screenToWorld = (clientX, clientY, render) => {
    if (!render || !render.canvas) {
        console.error("Render object or its canvas is not available.");
@@ -12,87 +10,47 @@ export const screenToWorld = (clientX, clientY, render) => {
    const bounds = render.canvas.getBoundingClientRect();
    const scaleX = render.options.width / bounds.width;
    const scaleY = render.options.height / bounds.height;
    const worldX = (clientX - bounds.left) * scaleX;
    const worldY = (clientY - bounds.top) * scaleY;
    console.log(`screenToWorld: Screen(${clientX}, ${clientY}) -> World(${worldX}, ${worldY})`);
    return { x: worldX, y: worldY };
    return {
        x: (clientX - bounds.left) * scaleX,
        y: (clientY - bounds.top) * scaleY,
    };
};

// Enhanced isInside function for better readability
function isInside(body, x, y) {
    const inside = Vertices.contains(body.vertices, { x, y });
    console.log(`isInside: Checking if point(${x}, ${y}) is inside body - Result: ${inside}`);
    return inside;
export function isInside(body, x, y) {
    return Vertices.contains(body.vertices, { x, y });
}

// More concise adjustMaterialProperties using Body.set directly
function adjustMaterialProperties(body, properties) {
    console.log(`adjustMaterialProperties: Adjusting properties of body`, properties);
export function adjustMaterialProperties(body, properties) {
    Body.set(body, properties);
}

// Utilizing Matter.js Vector.magnitude for calculateMagnitude
function calculateMagnitude(vector) {
    const magnitude = Vector.magnitude(vector);
    console.log(`calculateMagnitude: Vector magnitude calculated - ${magnitude}`);
    return magnitude;
export function calculateMagnitude(vector) {
    return Vector.magnitude(vector);
}

// Improved applyForceTowardsPoint to include normalization using Matter.Vector
function applyForceTowardsPoint(body, point, strength) {
export function applyForceTowardsPoint(body, point, strength) {
    const forceDirection = Vector.sub(point, body.position);
    const forceMagnitude = strength / calculateMagnitude(forceDirection);
    const forceMagnitude = strength / Vector.magnitude(forceDirection);
    const force = Vector.mult(Vector.normalise(forceDirection), forceMagnitude);
    console.log(`applyForceTowardsPoint: Applying force towards point(${point.x}, ${point.y}) with strength ${strength}`);
    Body.applyForce(body, body.position, force);
}

// Simplified normalizeVector utilizing Vector.normalise
function normalizeVector(vector) {
    const normalized = Vector.normalise(vector);
    console.log(`normalizeVector: Normalizing vector(${vector.x}, ${vector.y}) - Result: (${normalized.x}, ${normalized.y})`);
    return normalized;
export function normalizeVector(vector) {
    return Vector.normalise(vector);
}

// Additional utility function to create a random vector within a range
function randomVector(min, max) {
    const vector = {
export function randomVector(min, max) {
    return {
        x: Math.random() * (max - min) + min,
        y: Math.random() * (max - min) + min
        y: Math.random() * (max - min) + min,
    };
    console.log(`randomVector: Generated random vector(${vector.x}, ${vector.y}) within range (${min}, ${max})`);
    return vector;
}

// Additional utility function to rotate a body around a point
function rotateBodyAroundPoint(body, point, angle) {
    console.log(`rotateBodyAroundPoint: Rotating body around point(${point.x}, ${point.y}) by angle ${angle}`);
export function rotateBodyAroundPoint(body, point, angle) {
    Body.setPosition(body, {
        x: point.x + Math.cos(angle) * (body.position.x - point.x) - Math.sin(angle) * (body.position.y - point.y),
        y: point.y + Math.sin(angle) * (body.position.x - point.x) + Math.cos(angle) * (body.position.y - point.y)
        y: point.y + Math.sin(angle) * (body.position.x - point.x) + Math.cos(angle) * (body.position.y - point.y),
    });
}

export const invertColor = (hex, bw) => {
    // Processing for invertColor function omitted for brevity
    const invertedColor = `#${rInv}${gInv}${bInv}`;
    console.log(`invertColor: Inverting color ${hex} - Result: ${invertedColor}`);
    return invertedColor;
};

export const padZero = (str, length = 2) => {
    // Processing for padZero function omitted for brevity
    const padded = (zeros + str).slice(-length);
    console.log(`padZero: Padding ${str} to length ${length} - Result: ${padded}`);
    return padded;
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
// Assuming invertColor and padZero are correct as described.
0 comments on commit 927f4ad
@MatteoM23
Comment
 
Leave a comment
 
Loading
Footer
© 2024 GitHub, Inc.
Footer navigation
Terms
Privacy
Security
Status
Docs
Contact
Manage cookies
Do not share my personal information
Update utils.js · MatteoM23/PhysicsSimulator@927f4ad 
