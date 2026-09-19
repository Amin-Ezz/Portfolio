import gsap from 'gsap';

export function initCursor() {
  // Remove any existing custom cursor elements from DOM
  const existingDot = document.querySelector('.custom-cursor-dot');
  const existingFollower = document.querySelector('.custom-cursor-follower');
  if (existingDot) existingDot.remove();
  if (existingFollower) existingFollower.remove();

  // Skip hover cursor physics on touch/mobile screens to prevent layout reflows
  if (window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  // Magnetic Button Physics (Subtle button movement on hover)
  const magneticElements = document.querySelectorAll('[data-magnetic]');
  magneticElements.forEach((el) => {
    const strength = parseFloat(el.getAttribute('data-magnetic-strength') || '0.35');

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);

      gsap.to(el, {
        x: relX * strength,
        y: relY * strength,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)'
      });
    });
  });
}
