export const initDropdown = () => {
    const materials = ['Material 1', 'Material 2', 'Material 3']; // Example materials
    const materialsContainer = document.getElementById('materialsContainer');
    materials.forEach(material => {
        const element = document.createElement('a');
        element.textContent = material;
        element.href = '#';
        materialsContainer.appendChild(element);
    });
};
