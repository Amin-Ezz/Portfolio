import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * About Me Section Controller & Animations
 * Exactly matching reference image with rich micro-animations on every section
 */
export function initAboutSection() {
  const aboutSection = document.querySelector('#about');
  if (!aboutSection) return;

  // Interactive Read More Toggle
  setupAboutReadMore();

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Reveal all elements without transitions
    gsap.set('.about-hero-heading-inner, .about-feature-item, .about-stat-item', { opacity: 1, y: 0 });
    return;
  }

  // 1. Zone 1: Hero Profile Card Entrance
  setupHeroAnimations();

  // 2. Zone 3: Dark Stats Bar & Live Numeric Counters
  setupStatsCounters();
}

/**
 * 1. Hero Profile Card Animations
 */
function setupHeroAnimations() {
  const heroCard = document.querySelector('.about-hero-card');
  if (!heroCard) return;

  // Title Cluster, Bio & Meta Pills & Actions Staggered Entrance
  const titleCluster = document.querySelector('.about-title-cluster');
  const bio = document.querySelector('.about-hero-bio');
  const metaPills = document.querySelectorAll('.about-meta-pill');
  const actionBtns = document.querySelectorAll('.about-actions-row > *');

  const heroTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: heroCard,
      start: 'top 80%',
      once: true
    }
  });

  if (titleCluster) {
    heroTimeline.from(titleCluster, {
      y: 25,
      opacity: 0,
      duration: 0.85,
      ease: 'power3.out'
    });
  }

  if (bio) {
    heroTimeline.from(bio, {
      y: 20,
      opacity: 0,
      duration: 0.85,
      ease: 'power3.out'
    }, '-=0.55');
  }

  if (metaPills.length > 0) {
    heroTimeline.from(metaPills, {
      y: 18,
      opacity: 0,
      stagger: 0.08,
      duration: 0.7,
      ease: 'back.out(1.4)'
    }, '-=0.5');
  }

  if (actionBtns.length > 0) {
    heroTimeline.from(actionBtns, {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.4');
  }

  // Organic Looped Line SVG Draw Animation
  const loopPath = document.querySelector('.about-loop-path');
  if (loopPath) {
    const pathLength = loopPath.getTotalLength ? loopPath.getTotalLength() : 400;
    gsap.set(loopPath, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength
    });

    ScrollTrigger.create({
      trigger: heroCard,
      start: 'top 78%',
      once: true,
      onEnter: () => {
        gsap.to(loopPath, {
          strokeDashoffset: 0,
          duration: 2.2,
          ease: 'power2.inOut'
        });
      }
    });
  }

  // Portrait Entrance & 3D Interactive Cursor Tilt
  const portraitHolder = document.querySelector('.about-portrait-holder');
  if (portraitHolder) {
    gsap.from(portraitHolder, {
      scale: 0.94,
      y: 35,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: portraitHolder,
        start: 'top 85%',
        once: true
      }
    });

    if (window.matchMedia('(pointer: fine)').matches) {
      let rect = portraitHolder.getBoundingClientRect();
      const refreshRect = () => {
        rect = portraitHolder.getBoundingClientRect();
      };
      window.addEventListener('resize', refreshRect, { passive: true });
      portraitHolder.addEventListener('mouseenter', refreshRect, { passive: true });

      const rotYTo = gsap.quickTo(portraitHolder, 'rotationY', { duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
      const rotXTo = gsap.quickTo(portraitHolder, 'rotationX', { duration: 0.4, ease: 'power2.out', overwrite: 'auto' });

      portraitHolder.addEventListener('mousemove', (e) => {
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.set(portraitHolder, { transformPerspective: 900 });
        rotYTo(x * 8);
        rotXTo(-y * 8);
      });

      portraitHolder.addEventListener('mouseleave', () => {
        gsap.to(portraitHolder, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.7,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      });
    }
  }

  // Rotating Stamp Entrance & Interactive Hover
  const stamp = document.querySelector('.about-rotating-stamp');
  if (stamp) {
    gsap.from(stamp, {
      scale: 0,
      rotation: -180,
      opacity: 0,
      duration: 1.1,
      ease: 'back.out(1.8)',
      scrollTrigger: {
        trigger: heroCard,
        start: 'top 75%',
        once: true
      }
    });
  }
}



/**
 * 3. Dark Stats Bar Live Counters
 */
function setupStatsCounters() {
  const statsBar = document.querySelector('.about-stats-bar');
  const statItems = document.querySelectorAll('.about-stat-item');
  if (!statsBar || statItems.length === 0) return;

  // Items entrance animation
  gsap.from(statItems, {
    y: 30,
    opacity: 0,
    stagger: 0.1,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: statsBar,
      start: 'top 85%',
      once: true
    }
  });

  // Number counters
  const counters = document.querySelectorAll('[data-about-counter]');
  counters.forEach((el) => {
    const target = parseInt(el.getAttribute('data-about-counter') || '0', 10);
    const prefix = el.getAttribute('data-counter-prefix') || '';
    const suffix = el.getAttribute('data-counter-suffix') || '';

    ScrollTrigger.create({
      trigger: statsBar,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            const current = Math.round(obj.val);
            el.textContent = prefix + toPersianNumber(current) + suffix;
          }
        });
      }
    });
  });
}

/**
 * Converts English digits to Persian numerals
 */
function toPersianNumber(num) {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (d) => persianDigits[parseInt(d, 10)]);
}

/**
 * Expandable Read More toggle for About Hero Bio
 */
function setupAboutReadMore() {
  const btn = document.getElementById('aboutReadMoreBtn');
  const textWrap = document.getElementById('aboutBioTextWrap');
  const readMoreWrap = document.querySelector('.about-read-more-wrap');
  if (!btn || !textWrap) return;

  const textSpan = btn.querySelector('.about-read-more-text');

  btn.addEventListener('click', () => {
    const isExpanded = btn.classList.contains('is-expanded');

    if (isExpanded) {
      btn.classList.remove('is-expanded');
      textWrap.classList.remove('is-expanded');
      if (readMoreWrap) readMoreWrap.classList.remove('is-expanded');
      btn.setAttribute('aria-expanded', 'false');
      if (textSpan) textSpan.textContent = 'بیشتر بخون';
    } else {
      btn.classList.add('is-expanded');
      textWrap.classList.add('is-expanded');
      if (readMoreWrap) readMoreWrap.classList.add('is-expanded');
      btn.setAttribute('aria-expanded', 'true');
      if (textSpan) textSpan.textContent = 'کمتر بخون';
    }

    // Refresh ScrollTrigger to recalculate layout dimensions smoothly
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 450);
  });
}
