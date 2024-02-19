import Matter from 'https://cdn.skypack.dev/matter-js';

// Define dimensions for the UI box
const uiBoxWidth = 200; // Reserve space for UI on the right
const uiBoxHeight = 100; // Reserve space for UI at the bottom

export const engine = Matter.Engine.create();
export const world = engine.world;

let render;

export const initPhysics = () => {
    // Adjust the width and height to account for the UI box
    const adjustedWidth = window.innerWidth - uiBoxWidth;
    const adjustedHeight = window.innerHeight - uiBoxHeight;

    render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: adjustedWidth,
            height: adjustedHeight,
            wireframes: false,
            background: '#f0f0f0'
        }
    });

    // Create floor with increased thickness
    const floor = Matter.Bodies.rectangle(
        adjustedWidth / 2, 
        adjustedHeight + 50, // Adjust the vertical position as needed
        adjustedWidth, 
        200, // Increase the height to make the floor thicker
        { 
            isStatic: true,
            collisionFilter: {
                category: 0x0001, // Set collision category
                mask: 0x0001 // Set collision mask
            }
        }
    );

    // Create side walls
    const leftWall = Matter.Bodies.rectangle(-25, adjustedHeight / 2, 50, adjustedHeight, { 
        isStatic: true,
        collisionFilter: {
            category: 0x0001, // Set collision category
            mask: 0x0001 // Set collision mask
        }
    });
    const rightWall = Matter.Bodies.rectangle(adjustedWidth + 25, adjustedHeight / 2, 50, adjustedHeight, { 
        isStatic: true,
        collisionFilter: {
            category: 0x0001, // Set collision category
            mask: 0x0001 // Set collision mask
        }
    });

    // Add walls to the world
    Matter.World.add(world, [floor, leftWall, rightWall]);

    Matter.Render.run(render);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Enable continuous collision detection
    engine.enableSleeping = true; // Optional, can improve performance
    engine.positionIterations = 10; // Optional, adjust as needed
    engine.constraintIterations = 5; // Optional, adjust as needed
    engine.velocityIterations = 8; // Optional, adjust as needed
    engine.enableSleeping = true; // Optional, can improve performance
    engine.enableContinuousCollisionDetection = true; // Enable CCD

    // Resize listener to adjust canvas size dynamically
    window.addEventListener('resize', function() {
        render.canvas.width = window.innerWidth - uiBoxWidth;
        render.canvas.height = window.innerHeight - uiBoxHeight;
        render.options.width = window.innerWidth - uiBoxWidth;
        render.options.height = window.innerHeight - uiBoxHeight;
    });

    // Register global collision event listener for handling custom material interactions
    Matter.Events.on(engine, 'collisionStart', (event) => {
        event.pairs.forEach((pair) => {
            // Execute interaction rules based on the materials of the colliding bodies
            handleCollisions(event, engine);
        });
    });

    // Log to indicate successful initialization
    console.log("Physics simulation initialized and ready for interaction.");
};

export { render }; // Export render so it can be used elsewhere
