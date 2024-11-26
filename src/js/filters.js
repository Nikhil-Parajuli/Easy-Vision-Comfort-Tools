// SVG filters for color vision deficiency simulation
const svgFilters = `
<svg style="display:none">
  <defs>
    <filter id="protanopia">
      <feColorMatrix type="matrix" values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0"/>
    </filter>
    <filter id="deuteranopia">
      <feColorMatrix type="matrix" values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0"/>
    </filter>
    <filter id="tritanopia">
      <feColorMatrix type="matrix" values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0"/>
    </filter>
    <filter id="protanomaly">
      <feColorMatrix type="matrix" values="0.817,0.183,0,0,0 0.333,0.667,0,0,0 0,0.125,0.875,0,0 0,0,0,1,0"/>
    </filter>
    <filter id="deuteranomaly">
      <feColorMatrix type="matrix" values="0.8,0.2,0,0,0 0.258,0.742,0,0,0 0,0.142,0.858,0,0 0,0,0,1,0"/>
    </filter>
    <filter id="tritanomaly">
      <feColorMatrix type="matrix" values="0.967,0.033,0,0,0 0,0.733,0.267,0,0 0,0.183,0.817,0,0 0,0,0,1,0"/>
    </filter>
  </defs>
</svg>`;

// Apply color blind filter to the website
export function applyColorBlindFilter(settings) {
  let filterContainer = document.getElementById('accessibility-filters');
  
  if (!filterContainer) {
    filterContainer = document.createElement('div');
    filterContainer.id = 'accessibility-filters';
    filterContainer.innerHTML = svgFilters;
    document.body.appendChild(filterContainer);
  }

  if (!settings.enabled || settings.mode === 'normal') {
    document.documentElement.style.filter = '';
    return;
  }

  const filters = {
    protanopia: 'url(#protanopia)',
    deuteranopia: 'url(#deuteranopia)',
    tritanopia: 'url(#tritanopia)',
    monochromacy: 'grayscale(100%)',
    protanomaly: 'url(#protanomaly)',
    deuteranomaly: 'url(#deuteranomaly)',
    tritanomaly: 'url(#tritanomaly)',
    achromatomaly: 'grayscale(50%)'
  };

  document.documentElement.style.filter = filters[settings.mode] || '';
}