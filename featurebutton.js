export const initFeatureButtons = () => {
    const features = ['Feature 1', 'Feature 2', 'Feature 3']; // Example features
    const featuresContainer = document.querySelector('.feature-buttons');
    features.forEach(feature => {
        const button = document.createElement('button');
        button.textContent = feature;
        featuresContainer.appendChild(button);
    });
};
