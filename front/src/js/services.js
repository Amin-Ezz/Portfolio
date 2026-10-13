import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Services & Collaboration Section Engine («راه‌های همکاری با من»)
 *
 * - Sliding tab thumb between «خدمات من» and «نوع همکاری»
 * - Staggered card entrance on first scroll and on every tab switch
 * - Off-screen pause via IntersectionObserver to keep the page lag-free
 * - Full keyboard support (←/→) and prefers-reduced-motion fallback
 */
export function initServicesSection() {
  const section = document.querySelector('.services-section');
  if (!section) return;

  const tabsWrap = section.querySelector('.services-tabs');
  const tabs = Array.from(section.querySelectorAll('.services-tab'));
  const thumb = section.querySelector('.services-tabs-thumb');
  const panels = Array.from(section.querySelectorAll('.services-panel'));
  if (!tabsWrap || tabs.length === 0 || panels.length === 0) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth <= 860 || window.matchMedia('(pointer: coarse)').matches;

  // --- Tab thumb: position on the active button -------------------------------
  // Uses physical rects (not offsetLeft) so RTL layouts report the true
  // left offset of each button relative to the wrapper.
  function moveThumb(activeTab, animate = true) {
    if (!thumb) return;
    const wrapRect = tabsWrap.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    const w = tabRect.width;
    const x = tabRect.left - wrapRect.left;

    if (!animate || reducedMotion) {
      gsap.set(thumb, { x, width: w });
      return;
    }
    gsap.to(thumb, {
      x,
      width: w,
      duration: 0.5,
      ease: 'power3.out',
      overwrite: true
    });
  }

  // --- Card entrance: staggered fade + rise + micro-blur ----------------------
  function animateCards(panel, { immediate = false } = {}) {
    const cards = panel.querySelectorAll('.service-card');
    if (cards.length === 0) return;

    if (reducedMotion) {
      gsap.set(cards, { clearProps: 'all' });
      return;
    }

    gsap.killTweensOf(cards);
    gsap.fromTo(
      cards,
      {
        y: isMobile ? 20 : 26,
        opacity: 0,
        filter: 'blur(6px)',
        scale: 0.985
      },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        scale: 1,
        duration: 0.6,
        ease: 'power3.out',
        stagger: immediate ? 0.09 : 0.1,
        overwrite: true,
        onComplete: () => {
          // Drop inline styles so hover transforms keep working
          gsap.set(cards, { clearProps: 'all' });
        }
      }
    );
  }

  // --- Panel switching --------------------------------------------------------
  let currentIndex = tabs.findIndex((t) => t.classList.contains('is-active'));
  if (currentIndex < 0) currentIndex = 0;

  function activate(index, { animate = true } = {}) {
    if (index === currentIndex && animate) return;

    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.tabIndex = active ? 0 : -1;
    });

    const activeTab = tabs[index];
    moveThumb(activeTab, animate);

    const targetId = activeTab.getAttribute('aria-controls');
    panels.forEach((panel) => {
      const active = panel.id === targetId;
      panel.classList.toggle('is-active', active);
      if (active) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });

    currentIndex = index;

    const activePanel = section.querySelector(`#${targetId}`);
    if (activePanel) animateCards(activePanel, { immediate: true });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activate(i));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      // RTL: ArrowLeft → next, ArrowRight → previous
      const dir = e.key === 'ArrowLeft' ? 1 : -1;
      const next = (i + dir + tabs.length) % tabs.length;
      tabs[next].focus();
      activate(next);
    });
  });

  // --- Initial state ----------------------------------------------------------
  // Position thumb after fonts/layout settle, without animation.
  const settleThumb = () => moveThumb(tabs[currentIndex], false);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(settleThumb);
  }
  requestAnimationFrame(settleThumb);
  window.addEventListener('resize', () => moveThumb(tabs[currentIndex], false), {
    passive: true
  });

  if (reducedMotion) return;

  // First entrance when the section scrolls into view (once).
  const activePanel = panels[currentIndex];
  ScrollTrigger.create({
    trigger: section,
    start: 'top 78%',
    once: true,
    onEnter: () => animateCards(activePanel)
  });
}