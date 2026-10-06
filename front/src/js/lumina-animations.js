import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initLuminaAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // --------------------------------------------------------------------------
  // 00. Top Navigation Entrance
  // --------------------------------------------------------------------------
  const navHeader = document.getElementById('luminaNav');
  if (navHeader) {
    gsap.fromTo(
      navHeader,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.1 }
    );
  }

  // --------------------------------------------------------------------------
  // 01. Hero Section Entrance Timeline
  // --------------------------------------------------------------------------
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTL
      .fromTo('.lumina-hero-meta-row', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.2 })
      .fromTo('.lumina-hero-eyebrow', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
      .fromTo(
        '.lumina-hero-h1',
        { opacity: 0, y: 40, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power4.out' },
        '-=0.4'
      )
      .fromTo('.lumina-hero-lead', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
      .fromTo('.lumina-hero-desc', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
      .fromTo(
        '.lumina-hero-cta-group a',
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12 },
        '-=0.5'
      )
      .fromTo(
        '.lumina-hero-img-wrap, .lumina-hero-img, .lumina-white-monitor',
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo(
        '.hero-micro-badge',
        { opacity: 0, y: 15, scale: 0.85 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(1.7)' },
        '-=0.6'
      );
  }

  // --------------------------------------------------------------------------
  // 01.1 Hero White Monitor Interactive Hover Dynamics
  // --------------------------------------------------------------------------
  const whiteMonitor = document.getElementById('luminaWhiteMonitor');

  if (whiteMonitor && !prefersReducedMotion) {
    let bounds = null;

    const updateBounds = () => {
      bounds = whiteMonitor.getBoundingClientRect();
    };

    window.addEventListener('resize', updateBounds, { passive: true });

    whiteMonitor.addEventListener('mouseenter', () => {
      updateBounds();
    });

    whiteMonitor.addEventListener('mousemove', (e) => {
      if (!bounds) updateBounds();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;
      const xPct = (mouseX / bounds.width - 0.5) * 2;
      const yPct = (mouseY / bounds.height - 0.5) * 2;

      const frame = whiteMonitor.querySelector('.white-monitor-frame');
      if (frame) {
        gsap.to(frame, {
          rotateY: xPct * 4,
          rotateX: -yPct * 4,
          transformPerspective: 1000,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    });

    whiteMonitor.addEventListener('mouseleave', () => {
      const frame = whiteMonitor.querySelector('.white-monitor-frame');
      if (frame) {
        gsap.to(frame, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.7,
          ease: 'power3.out',
        });
      }
    });
  }

  // --------------------------------------------------------------------------
  // Generic Section Header Animation (for every section)
  // --------------------------------------------------------------------------
  const sectionHeaders = document.querySelectorAll('.section-header-block');
  sectionHeaders.forEach((header) => {
    const tag = header.querySelector('.section-num-tag');
    const title = header.querySelector('.section-main-heading');
    const subtitle = header.querySelector('.section-subtitle');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      defaults: { ease: 'power3.out' },
    });

    if (tag) tl.fromTo(tag, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 });
    if (title) tl.fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3');
    if (subtitle) tl.fromTo(subtitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5');
  });

  // --------------------------------------------------------------------------
  // 02. Overview Section Animation
  // --------------------------------------------------------------------------
  const overview = document.getElementById('overview');
  if (overview) {
    gsap.fromTo(
      '.overview-editorial-statement',
      { opacity: 0, x: 40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.overview-statement-col',
          start: 'top 82%',
        },
      }
    );

    gsap.fromTo(
      '.overview-core-point',
      { opacity: 0, x: 20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.overview-core-points',
          start: 'top 85%',
        },
      }
    );

    gsap.fromTo(
      '.overview-desc-col p',
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.overview-desc-col',
          start: 'top 80%',
        },
      }
    );

    gsap.fromTo(
      '.stat-editorial-item',
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: '.editorial-stats-row',
          start: 'top 88%',
        },
      }
    );
  }

  // --------------------------------------------------------------------------
  // 03. Features Section Animation
  // --------------------------------------------------------------------------
  const featureRows = document.querySelectorAll('.feature-editorial-row');
  featureRows.forEach((row) => {
    const media = row.querySelector('.feature-media-wrap');
    const text = row.querySelector('.feature-text-wrap');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: row,
        start: 'top 78%',
        toggleActions: 'play none none none',
      },
      defaults: { ease: 'power3.out' },
    });

    if (media) {
      tl.fromTo(media, { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 1 });
    }
    if (text) {
      tl.fromTo(text, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6');
    }
  });

  const secondaryFeatures = document.querySelectorAll('.feature-card-editorial');
  if (secondaryFeatures.length > 0) {
    gsap.fromTo(
      secondaryFeatures,
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.features-secondary-grid',
          start: 'top 85%',
        },
      }
    );
  }

  // --------------------------------------------------------------------------
  // 04. Tech Stack Section Entrance (Pure Black Minimal Editorial)
  // --------------------------------------------------------------------------
  const techSection = document.getElementById('tech');
  if (techSection) {
    // Header tag & title reveal
    gsap.fromTo(
      ['.tech-black-tag', '.tech-black-heading'],
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.tech-black-header',
          start: 'top 85%',
        },
      }
    );

    // Each category row and its technologies reveal progressively
    const techRows = document.querySelectorAll('.tech-minimal-row');
    techRows.forEach((row) => {
      const cat = row.querySelector('.tech-minimal-cat');
      const items = row.querySelectorAll('.tech-item-node');
      const bullets = row.querySelectorAll('.tech-item-bullet');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: row,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
        defaults: { ease: 'power3.out' },
      });

      if (cat) {
        tl.fromTo(cat, { opacity: 0, x: 25 }, { opacity: 1, x: 0, duration: 0.6 });
      }
      if (items.length > 0) {
        tl.fromTo(
          items,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 },
          '-=0.35'
        );
      }
      if (bullets.length > 0) {
        tl.fromTo(
          bullets,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, stagger: 0.03 },
          '-=0.4'
        );
      }
    });
  }

  // --------------------------------------------------------------------------
  // 05. Architecture Section Animation
  // --------------------------------------------------------------------------
  const archSection = document.getElementById('architecture');
  if (archSection) {
    gsap.fromTo(
      '.architecture-showcase-box',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#architecture',
          start: 'top 80%',
        },
      }
    );

    gsap.fromTo(
      '.arch-tier-block',
      { opacity: 0, y: 25, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.arch-diagram-flow',
          start: 'top 82%',
        },
      }
    );

    gsap.fromTo(
      '.arch-endpoint-pill',
      { opacity: 0, scale: 0.85 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.06,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: '.arch-endpoints-grid',
          start: 'top 88%',
        },
      }
    );

    gsap.fromTo(
      '.arch-layer-card',
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.arch-layers-columns',
          start: 'top 85%',
        },
      }
    );
  }

  // --------------------------------------------------------------------------
  // 06. Challenges Section Animation
  // --------------------------------------------------------------------------
  const compactChallengeCards = document.querySelectorAll('.challenge-compact-card');
  if (compactChallengeCards.length > 0) {
    gsap.fromTo(
      compactChallengeCards,
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.challenges-compact-grid',
          start: 'top 85%',
        },
      }
    );
  }

  const challengeCards = document.querySelectorAll('.challenge-engineering-card');
  challengeCards.forEach((card) => {
    const header = card.querySelector('.challenge-top-meta');
    const title = card.querySelector('.challenge-title-h3');
    const pdsrBlocks = card.querySelectorAll('.pdsr-block');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
      defaults: { ease: 'power3.out' },
    });

    if (header) tl.fromTo(header, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 });
    if (title) tl.fromTo(title, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');
    if (pdsrBlocks.length > 0) {
      tl.fromTo(pdsrBlocks, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, '-=0.3');
    }
  });

  // --------------------------------------------------------------------------
  // 07. Results Section Animation (Liquid Glass Grid)
  // --------------------------------------------------------------------------
  const resultsSection = document.getElementById('results');
  if (resultsSection) {
    gsap.fromTo(
      '.result-glass-card',
      { opacity: 0, y: 45, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.85,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.results-liquid-grid',
          start: 'top 85%',
        },
      }
    );

    if (!prefersReducedMotion) {
      gsap.to('.results-glow-1', {
        x: 40,
        y: -30,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.results-glow-2', {
        x: -35,
        y: 25,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1,
      });
    }
  }

  // --------------------------------------------------------------------------
  // 08. Links CTA Section Animation
  // --------------------------------------------------------------------------
  const linksSection = document.getElementById('links');
  if (linksSection) {
    gsap.fromTo(
      '.links-cta-container',
      { opacity: 0, y: 40, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#links',
          start: 'top 85%',
        },
      }
    );
  }

  // --------------------------------------------------------------------------
  // 09. Next Project Section Animation
  // --------------------------------------------------------------------------
  const nextProject = document.getElementById('next-project');
  if (nextProject) {
    gsap.fromTo(
      '.next-project-card',
      { opacity: 0, y: 50, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#next-project',
          start: 'top 82%',
        },
      }
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initLuminaAnimations();
});
