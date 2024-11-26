// Read Mode Module
export class ReadMode {
  constructor() {
    this.style = document.createElement('style');
    this.style.id = 'accessibility-read-mode';
    document.head.appendChild(this.style);
    
    this.settings = {
      enabled: false,
      fontSize: 16,
      lineHeight: 1.5,
      font: 'system-ui',
      letterSpacing: 0,
      theme: 'default',
      isTextOnly: false,
      isFocusRead: false
    };

    this.setupMutationObserver();
  }

  setupMutationObserver() {
    this.observer = new MutationObserver((mutations) => {
      if (this.settings.enabled) {
        this.applyStylesToNewElements(mutations);
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  applyStylesToNewElements(mutations) {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          this.applyStylesToElement(node);
        }
      });
    });
  }

  applyStylesToElement(element) {
    if (element.id === 'accessibility-content-wrapper') return;
    
    const style = window.getComputedStyle(element);
    if (style.display !== 'none' && style.visibility !== 'hidden') {
      element.style.cssText += `
        font-size: ${this.settings.fontSize}px !important;
        line-height: ${this.settings.lineHeight} !important;
        letter-spacing: ${this.settings.letterSpacing}px !important;
      `;
    }
  }

  apply(settings) {
    this.settings = { ...this.settings, ...settings };
    
    if (!this.settings.enabled) {
      this.cleanup();
      return;
    }

    const themes = {
      default: { bg: '#ffffff', text: '#000000' },
      sepia: { bg: '#f4ecd8', text: '#5b4636' },
      dark: { bg: '#1a1a1a', text: '#e0e0e0' },
      'high-contrast': { bg: '#000000', text: '#ffffff' }
    };

    const currentTheme = themes[this.settings.theme];

    const fonts = {
      'system-ui': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      'georgia': 'Georgia, serif',
      'times': 'Times New Roman, Times, serif',
      'arial': 'Arial, sans-serif',
      'verdana': 'Verdana, sans-serif',
      'helvetica': 'Helvetica Neue, Helvetica, Arial, sans-serif',
      'courier': 'Courier New, Courier, monospace'
    };

    // Create or get wrapper
    let wrapper = document.getElementById('accessibility-content-wrapper');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.id = 'accessibility-content-wrapper';
      
      // Move body's children to wrapper
      while (document.body.firstChild) {
        if (this.settings.isFocusRead) {
          // For Focus Read mode, only copy text content
          const node = document.body.firstChild;
          if (node.nodeType === 3 || // Text node
              (node.nodeType === 1 && /^(P|H[1-6]|UL|OL|LI)$/i.test(node.tagName))) {
            wrapper.appendChild(node.cloneNode(true));
          }
          document.body.removeChild(node);
        } else {
          wrapper.appendChild(document.body.firstChild);
        }
      }
      document.body.appendChild(wrapper);
    }

    // Apply global styles
    this.style.textContent = `
      html, body {
        background-color: ${currentTheme.bg} !important;
        color: ${currentTheme.text} !important;
      }

      body * {
        font-family: ${fonts[this.settings.font]} !important;
        font-size: ${this.settings.fontSize}px !important;
        line-height: ${this.settings.lineHeight} !important;
        letter-spacing: ${this.settings.letterSpacing}px !important;
        color: ${currentTheme.text} !important;
      }

      #accessibility-content-wrapper {
        transition: all 0.3s ease !important;
        ${this.settings.isFocusRead ? `
          max-width: 800px !important;
          margin: 2rem auto !important;
          padding: 2rem !important;
          font-size: ${this.settings.fontSize}px !important;
          line-height: ${this.settings.lineHeight} !important;
          text-align: left !important;
          background-color: ${currentTheme.bg} !important;
          color: ${currentTheme.text} !important;
        ` : ''}
      }

      ${this.settings.isTextOnly ? `
        img, video, iframe, canvas, svg, button,
        [role="img"], [role="banner"], [role="complementary"],
        [role="decoration"], [aria-hidden="true"],
        [data-ad], .ad, .ads, .advertisement {
          display: none !important;
        }
      ` : ''}

      ${this.settings.isFocusRead ? `
        #accessibility-content-wrapper > *:not(p, h1, h2, h3, h4, h5, h6, ul, ol, li) {
          display: none !important;
        }

        #accessibility-content-wrapper p,
        #accessibility-content-wrapper li {
          margin: 1em 0 !important;
          text-align: left !important;
          font-size: ${this.settings.fontSize}px !important;
          line-height: ${this.settings.lineHeight} !important;
        }

        #accessibility-content-wrapper h1,
        #accessibility-content-wrapper h2,
        #accessibility-content-wrapper h3,
        #accessibility-content-wrapper h4,
        #accessibility-content-wrapper h5,
        #accessibility-content-wrapper h6 {
          margin: 1.5em 0 0.5em !important;
          font-weight: bold !important;
        }
      ` : ''}
    `;

    // Apply styles to existing elements
    document.querySelectorAll('*').forEach(element => {
      this.applyStylesToElement(element);
    });
  }

  cleanup() {
    this.style.textContent = '';
    const wrapper = document.getElementById('accessibility-content-wrapper');
    if (wrapper) {
      while (wrapper.firstChild) {
        document.body.appendChild(wrapper.firstChild);
      }
      wrapper.remove();
    }
  }
}