// Assuming the existence of some functions to be called for each feature.
// These functions should be defined based on your application's needs.
import { clearWorld, toggleGravity, randomizeMaterials } from './simulationControls.js';

export const initFeatureButtons = () => {
    const features = [
        { name: 'Clear World', action: clearWorld },
        { name: 'Toggle Gravity', action: toggleGravity },
        { name: 'Randomize Materials', action: randomizeMaterials }
    ];
    const featuresContainer = document.querySelector('.feature-buttons');

    features.forEach((feature) => {
        const button = document.createElement('button');
        button.textContent = feature.name;
        button.addEventListener('click', feature.action);
        featuresContainer.appendChild(button);
    });
};
