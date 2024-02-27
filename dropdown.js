import { materials } from './materialManager.js';

export let currentMaterial = 'sand'; // Default material selection

export const initDropdown = () => {
    const dropdownContainer = document.getElementById('materialsContainer');
    if (!dropdownContainer) {
        console.error('Materials container not found');
        return;
    }

    const materialsDropdown = document.createElement('select');
    materialsDropdown.id = 'materialsDropdown';
    dropdownContainer.appendChild(materialsDropdown);

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

// Call initDropdown() where appropriate to ensure it executes.
