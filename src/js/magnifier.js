// Magnifier Module
export class Magnifier {
  constructor() {
    this.element = null;
    this.content = null;
    this.settings = {
      enabled: false,
      zoom: 2,
      circular: true
    };

    this.boundHandleMove = this.handleMove.bind(this);
    this.boundHandleLeave = this.handleLeave.bind(this);
    this.lastRenderTime = 0;
  }

  init() {
    this.element = document.createElement('div');
    this.element.id = 'accessibility-magnifier';
    this.element.style.display = 'none';
    
    this.content = document.createElement('div');
    this.content.id = 'accessibility-magnifier-content';
    this.element.appendChild(this.content);
    
    document.body.appendChild(this.element);
    
    document.addEventListener('mousemove', this.boundHandleMove, { passive: true });
    document.addEventListener('mouseleave', this.boundHandleLeave);
  }

  handleMove(e) {
    if (!this.settings.enabled) {
      this.element.style.display = 'none';
      return;
    }

    // Throttle updates to improve performance
    const now = performance.now();
    if (now - this.lastRenderTime < 16) { // ~60fps
      return;
    }
    this.lastRenderTime = now;

    const size = 150;
    const { clientX: x, clientY: y } = e;
    const rect = this.element.getBoundingClientRect();

    // Update position using transform for better performance
    this.element.style.transform = `translate(${x - size/2}px, ${y - size/2}px)`;

    // Only update other styles if they haven't been set
    if (this.element.style.display === 'none') {
      this.element.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        border: 2px solid #007AFF;
        pointer-events: none;
        z-index: 999999;
        overflow: hidden;
        ${this.settings.circular ? 'border-radius: 50%;' : 'border-radius: 8px;'}
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: block;
        left: 0;
        top: 0;
        transform: translate(${x - size/2}px, ${y - size/2}px);
        will-change: transform;
        background: white;
      `;
    }

    const elementAtPoint = document.elementFromPoint(x, y);
    if (elementAtPoint && elementAtPoint !== this.element) {
      const clone = elementAtPoint.cloneNode(true);
      this.content.innerHTML = '';
      this.content.appendChild(clone);
      
      requestAnimationFrame(() => {
        clone.style.cssText = `
          transform: scale(${this.settings.zoom});
          transform-origin: center center;
          position: absolute;
          left: 50%;
          top: 50%;
          translate: -50% -50%;
          pointer-events: none;
        `;
      });
    }
  }

  handleLeave() {
    this.element.style.display = 'none';
  }

  update(settings) {
    this.settings = { ...this.settings, ...settings };
    if (!this.settings.enabled) {
      this.element.style.display = 'none';
    }
  }

  cleanup() {
    document.removeEventListener('mousemove', this.boundHandleMove);
    document.removeEventListener('mouseleave', this.boundHandleLeave);
    this.element?.remove();
  }
}