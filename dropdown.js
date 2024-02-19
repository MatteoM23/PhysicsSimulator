import { materials, createBody } from './materialManager.js';
let currentMaterial = 'sand'; // Default material selection

export const initDropdown = () => {
    const materialsDropdown = document.createElement('select');
    materialsDropdown.id = 'materialsDropdown';
    Object.keys(materials).forEach(materialKey => {
        const option = document.createElement('option');
        option.value = materialKey;
        option.textContent = materialKey.charAt(0).toUpperCase() + materialKey.slice(1); // Capitalize the first letter
        materialsDropdown.appendChild(option);
    });

    // Handle material selection change
    materialsDropdown.addEventListener('change', (event) => {
        currentMaterial = event.target.value;
    });

    // Append the dropdown to a container in your HTML
    const materialsContainer = document.getElementById('materialsContainer');
    if (materialsContainer) {
        materialsContainer.appendChild(materialsDropdown);
    } else {
        console.error('Materials container not found');
    }
};
