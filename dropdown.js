// dropdown.js
import { materials } from './materialManager.js';

export let currentMaterial = 'sand'; // Default material selection

export const initDropdown = () => {
    const materialsDropdown = document.createElement('select');
    materialsDropdown.id = 'materialsDropdown';

    // Append dropdown to body or specific container
    const dropdownContainer = document.getElementById('materialsContainer');
    if (dropdownContainer) {
        dropdownContainer.appendChild(materialsDropdown);
    } else {
        console.error('Materials container not found');
        return;
    }

    Object.keys(materials).forEach(materialKey => {
        const option = document.createElement('option');
        option.value = materialKey;
        option.textContent = materialKey.charAt(0).toUpperCase() + materialKey.slice(1);
        materialsDropdown.appendChild(option);
    });

    materialsDropdown.addEventListener('change', (event) => {
        currentMaterial = event.target.value;
    });
};

// Ensure to call initDropdown() in your main script or entry point.
