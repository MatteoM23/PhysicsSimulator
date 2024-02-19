// physicsInit.js
import Matter from 'https://cdn.skypack.dev/matter-js';

export let engine, render, world;

export const initPhysics = () => {
    engine = Matter.Engine.create();
    world = engine.world;
    createRenderer();
    Matter.Runner.run(Matter.Runner.create(), engine);
};

const createRenderer = () => {
    render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'linear-gradient(135deg, #333333, #1b2838)',
        }
    });
    Matter.Render.run(render);
};
