export const setupEventListeners = () => {
    document.addEventListener('mousedown', (event) => {
        // Check if the click was inside the UI container
        if (!event.target.closest('#uiContainer')) {
            isMouseDown = true;
            // Convert screen position to world position
            mousePosition = { x: event.clientX, y: event.clientY };
            createBodyAtMouse();
        }
    });

    // Mouse move to update position or draw with materials
    document.addEventListener('mousemove', (event) => {
        mousePosition = { x: event.clientX, y: event.clientY };
        if (isMouseDown && !event.target.closest('#uiContainer')) {
            createBodyAtMouse();
        }
    });

    // Mouse up to stop creating bodies
    document.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    // Key press events to change materials or trigger other features
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case '1':
                currentMaterial = 'sand';
                break;
            case '2':
                currentMaterial = 'water';
                break;
            // Add cases for other materials or actions
        }
    });

    // Add your collision event listener here
    // Example: Handling custom material interactions on collisions
    Matter.Events.on(engine, 'collisionStart', (event) => {
        event.pairs.forEach(pair => {
            // Custom logic to handle collisions based on materials
        });
    });
};

const createBodyAtMouse = () => {
    const { x, y } = mousePosition;
    // Ensure this function correctly maps screen to world coordinates if necessary
    createBody(x, y, currentMaterial);
};
