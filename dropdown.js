import { materials } from './materialManager.js';

export let currentMaterial = 'sand'; // Initialize with a default material

export const initDropdown = () => {
    // Attempt to locate the container for the dropdown. If not found, log an error.
    const dropdownContainer = document.getElementById('materialsContainer');
    if (!dropdownContainer) {
        console.error('Materials container not found');
        return;
    }

    // Create the dropdown element.
    const materialsDropdown = document.createElement('select');
    materialsDropdown.id = 'materialsDropdown';
    dropdownContainer.appendChild(materialsDropdown);

    // Populate the dropdown with options based on available materials.
    Object.entries(materials).forEach(([key, { color }]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = `${key.charAt(0).toUpperCase()}${key.slice(1)} (${color})`;
        materialsDropdown.appendChild(option);
    });

    // Update the currentMaterial when a new selection is made.
    materialsDropdown.addEventListener('change', (event) => {
        currentMaterial = event.target.value;
        console.log(`Material selected: ${currentMaterial}`);
    });
};
