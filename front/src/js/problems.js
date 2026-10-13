import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Interactive Diagnostic Problems Section Engine
 * Supports infinite left-to-right marquee looping, mouse spotlight glow, and ScrollTrigger entrance
 */
export function initProblemsSection() {
  const problemsSection = document.querySelector('.problems-section');
  if (!problemsSection) return;

  const cards = problemsSection.querySelectorAll('.problem-card');

  // Mousemove spotlight effect on each card (Desktop pointer:fine only, zero getBoundingClientRect thrashing)
  if (window.matchMedia('(pointer: fine)').matches) {
    cards.forEach(card => {
      let rafId = 0;
      let mouseX = 0;
      let mouseY = 0;

      card.addEventListener('mousemove', (e) => {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
        if (!rafId) {
          rafId = requestAnimationFrame(() => {
            card.style.setProperty('--mouse-x', `${mouseX}px`);
            card.style.setProperty('--mouse-y', `${mouseY}px`);
            rafId = 0;
          });
        }
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      }, { passive: true });
    });
  }

  // Marquee auto-pause when out of viewport to save GPU fill rate & CPU
  const viewport = problemsSection.querySelector('.problems-marquee-viewport');
  const groups = problemsSection.querySelectorAll('.problems-marquee-group');

  if ('IntersectionObserver' in window && groups.length > 0) {
    const marqueeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const state = entry.isIntersecting ? 'running' : 'paused';
        groups.forEach(g => { g.style.animationPlayState = state; });
      });
    }, { rootMargin: '150px 0px 150px 0px' });
    marqueeObserver.observe(problemsSection);
  }

  // Touch pause support for mobile devices
  if (viewport && groups.length > 0) {
    viewport.addEventListener('touchstart', () => {
      groups.forEach(g => { g.style.animationPlayState = 'paused'; });
    }, { passive: true });

    viewport.addEventListener('touchend', () => {
      groups.forEach(g => { g.style.animationPlayState = 'running'; });
    }, { passive: true });
  }

  // Entrance animations via ScrollTrigger
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  // Ensure problems-header elements are always fully visible and never stuck at opacity 0
  const header = problemsSection.querySelector('.problems-header');
  if (header) {
    gsap.set(header.children, { clearProps: 'opacity,transform,visibility' });
  }

  if (viewport) {
    gsap.from(viewport, {
      y: 40,
      opacity: 0,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: viewport,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }

  }
