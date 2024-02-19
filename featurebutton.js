import { clearWorld, toggleGravity, materialRain } from './simulationControls.js';

export const initFeatureButtons = () => {
    const features = [
        { name: 'Clear World', action: clearWorld },
        { name: 'Toggle Gravity', action: toggleGravity },
        { name: 'Material Rain', action: materialRain } // Updated feature
    ];
    const featuresContainer = document.querySelector('.feature-buttons');

    features.forEach((feature) => {
        const button = document.createElement('button');
        button.textContent = feature.name;
        button.addEventListener('click', feature.action);
        featuresContainer.appendChild(button);
    });
};
