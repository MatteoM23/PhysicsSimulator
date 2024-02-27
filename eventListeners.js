import { engine, render } from './physicsInit.js';
import { createBody } from './materialManager.js';

let isMouseDown = false;

export const setupEventListeners = () => {
    const canvas = render.canvas; // Utilizing the render.canvas directly ensures we are attaching to the correct element.

    if (!canvas) {
        console.error("physicsCanvas not found. Ensure your render object is correctly initialized.");
        return;
    }
    console.log("physicsCanvas found, attaching event listeners.");

    // Adjusting to use clientX/Y directly for simplicity and adding checks to ensure coordinates are within canvas bounds.
    const handleMouseDown = (event) => {
        isMouseDown = true;
        const { x, y } = getCanvasRelativePosition(event);
        console.log(`Mouse down at canvas position: x=${x}, y=${y}`);
        createBody(x, y); // Directly using the canvas-relative positions.
    };

    const handleMouseMove = (event) => {
        if (!isMouseDown) return;
        const { x, y } = getCanvasRelativePosition(event);
        console.log(`Mouse move (with button down) at canvas position: x=${x}, y=${y}`);
        createBody(x, y);
    };

    const handleMouseUp = () => {
        isMouseDown = false;
        console.log("Mouse button released.");
    };

    // Convert screen coordinates to canvas-relative coordinates.
    const getCanvasRelativePosition = (event) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove); // Listening to the document to track mouse moves even outside the canvas.
    document.addEventListener('mouseup', handleMouseUp);
};

console.log("Event listener script is set up and ready.");
