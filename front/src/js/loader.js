import gsap from 'gsap';
import { toPersianNumber } from './scroll.js';

export function runInitialLoader(onComplete) {
  const isReturning = sessionStorage.getItem('amin_trigger_reverse_transition') === 'true' || 
    (document.referrer && document.referrer.includes('/projects/'));

  if (isReturning) {
    if (onComplete) onComplete();
    return;
  }

  orchestrateHeroEntrance(onComplete);
}

function orchestrateHeroEntrance(onFinished) {
  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      if (onFinished) onFinished();
    }
  });

  // 1. Logo appears
  tl.fromTo('.nav-logo', { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.6 }, 0.05);

  // 2. Navigation bar appears
  tl.fromTo('.nav-3d-slab, .liquid-glass-nav', { opacity: 0, y: -20, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.7 }, 0.15);

  // 3. Right CTA & theme buttons appear
  tl.fromTo('.nav-right-actions', { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.6 }, 0.2);

  // 5. Hero heading line reveal
  tl.fromTo('.hero-heading-inner',
    { y: '105%', opacity: 0 },
    { y: '0%', opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power4.out' },
    0.45
  );

  // 6. Description appears
  tl.fromTo('.hero-description', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 0.65);

  // 7. CTA Buttons appear
  tl.fromTo('.hero-cta-group .btn-wrap', { opacity: 0, y: 25 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.7 }, 0.8);

  // 8. Statistics appear
  tl.fromTo('.hero-stat-item', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.7 }, 0.95);
}
