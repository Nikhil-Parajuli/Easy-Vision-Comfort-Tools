// Initialize and handle magnifier functionality
export function initializeMagnifier(settings) {
  let magnifier = document.getElementById('accessibility-magnifier');
  
  if (!settings.enabled) {
    magnifier?.remove();
    return;
  }

  if (!magnifier) {
    magnifier = document.createElement('div');
    magnifier.id = 'accessibility-magnifier';
    document.body.appendChild(magnifier);
  }

  // Apply magnifier styles
  magnifier.style.cssText = `
    position: fixed;
    width: 150px;
    height: 150px;
    border: 2px solid #007AFF;
    pointer-events: none;
    z-index: 999999;
    display: none;
    overflow: hidden;
    ${settings.circular ? 'border-radius: 50%;' : 'border-radius: 8px;'}
  `;

  // Create magnified content
  const content = document.createElement('div');
  content.style.cssText = `
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: white;
  `;
  magnifier.appendChild(content);

  // Handle mouse movement
  document.addEventListener('mousemove', (e) => {
    if (!settings.enabled) return;

    const x = e.clientX;
    const y = e.clientY;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    magnifier.style.display = 'block';
    magnifier.style.left = `${x - 75}px`;
    magnifier.style.top = `${y - 75}px`;

    // Clone and magnify content under the magnifier
    const elementAtPoint = document.elementFromPoint(x, y);
    if (elementAtPoint) {
      const clone = elementAtPoint.cloneNode(true);
      content.innerHTML = '';
      content.appendChild(clone);
      content.style.transform = `scale(${settings.zoom})`;
      content.style.transformOrigin = 'center center';
    }
  });

  // Hide magnifier when mouse leaves the document
  document.addEventListener('mouseleave', () => {
    magnifier.style.display = 'none';
  });
}