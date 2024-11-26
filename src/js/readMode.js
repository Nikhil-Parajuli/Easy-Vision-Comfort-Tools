// Apply read mode styles to the website
export function applyReadMode(settings) {
  const style = document.getElementById('accessibility-read-mode') || document.createElement('style');
  style.id = 'accessibility-read-mode';

  if (!settings.enabled) {
    style.remove();
    document.documentElement.style.removeProperty('--read-mode-max-width');
    return;
  }

  // Create content wrapper if it doesn't exist
  let wrapper = document.getElementById('accessibility-content-wrapper');
  if (!wrapper && settings.enabled) {
    wrapper = document.createElement('div');
    wrapper.id = 'accessibility-content-wrapper';
    
    // Move body content to wrapper
    while (document.body.firstChild) {
      wrapper.appendChild(document.body.firstChild);
    }
    document.body.appendChild(wrapper);
  }

  // Apply styles
  const css = `
    :root {
      --read-mode-max-width: ${settings.maxWidth}px;
    }

    #accessibility-content-wrapper {
      font-family: ${settings.font} !important;
      font-size: ${settings.fontSize}px !important;
      line-height: ${settings.lineHeight} !important;
      letter-spacing: ${settings.letterSpacing}px !important;
      text-align: ${settings.textAlign} !important;
      max-width: var(--read-mode-max-width) !important;
      margin: 0 auto !important;
      padding: 20px !important;
      background-color: ${settings.theme.bg} !important;
      color: ${settings.theme.text} !important;
    }

    ${settings.isTextOnly ? `
      #accessibility-content-wrapper img,
      #accessibility-content-wrapper video,
      #accessibility-content-wrapper iframe,
      #accessibility-content-wrapper canvas,
      #accessibility-content-wrapper svg {
        display: none !important;
      }
    ` : ''}

    ${settings.isLineFocus ? `
      #accessibility-content-wrapper p,
      #accessibility-content-wrapper li {
        padding: 8px 0;
        transition: all 0.2s ease;
      }

      #accessibility-content-wrapper p:hover,
      #accessibility-content-wrapper li:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    ` : ''}
  `;

  style.textContent = css;
  document.head.appendChild(style);
}