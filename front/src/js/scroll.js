import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function initScrollEngine() {
  // Initialize Lenis smooth scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2
  });

  // Synchronize Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement, { offset: -40, duration: 1.2 });
        }
      }
    });
  });

  // Setup ScrollTrigger Animations
  setupScrollAnimations();

  return lenis;
}

function setupScrollAnimations() {
  // Line reveals
  const revealWrappers = document.querySelectorAll('.reveal-wrapper');
  revealWrappers.forEach(wrapper => {
    const inner = wrapper.querySelector('.reveal-inner');
    if (inner) {
      gsap.to(inner, {
        y: '0%',
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    }
  });

  // Transition bridge (Hero → Projects): scrubbed blur-to-sharp reveal
  const transitionReveals = document.querySelectorAll('.transition-reveal');
  if (transitionReveals.length > 0) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      gsap.set(transitionReveals, { clearProps: 'all' });
    } else {
      gsap.to(transitionReveals, {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        ease: 'none',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.transition-section',
          start: 'top 80%',
          end: 'top 30%',
          scrub: 0.6
        }
      });
    }
  }

  // Choice CTA (before Contact): headline → panels from opposite sides → button.
  // Each tween flips a .is-shown class on completion so the CSS reveal state
  // (blur/translate) is fully overridden and never leaves a blurred residue.
  const ctaChoiceSection = document.querySelector('.cta-choice-section');
  if (ctaChoiceSection) {
    const revealTargets = ctaChoiceSection.querySelectorAll('.cta-choice-reveal, .cta-choice-panel-reveal');

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      revealTargets.forEach(el => el.classList.add('is-shown'));
    } else {
      const ctaTl = gsap.timeline({
        scrollTrigger: {
          trigger: ctaChoiceSection,
          start: 'top 70%',
          toggleActions: 'play none none none'
        },
        // Lock the final state via .is-shown, then drop GSAP's inline styles
        // so panel hover transforms work again
        onComplete: () => {
          revealTargets.forEach(el => {
            el.classList.add('is-shown');
            gsap.set(el, { clearProps: 'all' });
          });
        }
      });

      const badgeEl = ctaChoiceSection.querySelector('.cta-choice-badge');
      if (badgeEl) {
        ctaTl.to(badgeEl, {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 0.8,
          ease: 'power3.out'
        }, 0.05);
      }

      ctaTl
        .to(ctaChoiceSection.querySelector('.cta-choice-headline'), {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 1,
          ease: 'power3.out'
        }, 0.2)
        .to(ctaChoiceSection.querySelectorAll('.cta-choice-panel-idea'), {
          opacity: 1,
          filter: 'blur(0px)',
          x: 0,
          duration: 1.1,
          ease: 'power3.out'
        }, 0.55)
        .to(ctaChoiceSection.querySelectorAll('.cta-choice-panel-product'), {
          opacity: 1,
          filter: 'blur(0px)',
          x: 0,
          duration: 1.1,
          ease: 'power3.out'
        }, 0.75)
        .to(ctaChoiceSection.querySelector('.cta-choice-action'), {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 0.9,
          ease: 'power3.out'
        }, 1.25);
    }
  }

  // Section Headers & Titles
  const sectionHeaders = document.querySelectorAll('.anim-section-header');
  sectionHeaders.forEach(header => {
    gsap.from(header.children, {
      y: 40,
      opacity: 0,
      stagger: 0.12,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Project cards in the Selected Works grid — cinematic two-by-two entrance
  const gridCards = document.querySelectorAll('.work-grid-card');
  const worksGrid = document.querySelector('.works-grid-container');
  if (gridCards.length > 0 && worksGrid) {
    gsap.set(gridCards, {
      y: 130,
      opacity: 0,
      scale: 0.92,
      rotateX: 14,
      transformPerspective: 1200,
      transformOrigin: '50% 100%',
      filter: 'blur(18px)',
      willChange: 'transform, opacity, filter'
    });

    // Group cards into visual row pairs (two per row)
    const pairs = [];
    for (let i = 0; i < gridCards.length; i += 2) {
      pairs.push([gridCards[i], gridCards[i + 1]].filter(Boolean));
    }

    const workTl = gsap.timeline({
      scrollTrigger: {
        trigger: worksGrid,
        start: 'top 80%',
        once: true
      },
      onComplete: () => {
        worksGrid.classList.add('is-animated');
        gsap.set(gridCards, { clearProps: 'all' });
        gsap.set(worksGrid.querySelectorAll('.work-card-line-inner'), { clearProps: 'transform' });
      }
    });

    pairs.forEach((pair, pairIndex) => {
      const rowStart = pairIndex * 0.5;

      workTl.to(pair, {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateX: 0,
        filter: 'blur(0px)',
        duration: 1.15,
        ease: 'power3.out'
      }, rowStart);

      pair.forEach((card) => {
        const lines = card.querySelectorAll('.work-card-line-inner');
        if (lines.length > 0) {
          workTl.to(lines, {
            y: '0%',
            duration: 0.95,
            ease: 'power4.out',
            stagger: 0.14
          }, rowStart + 0.55);
        }
      });
    });
  }



  // Statistics Live Counter Animation
  const statsElements = document.querySelectorAll('.stat-counter-number');
  statsElements.forEach(el => {
    const targetValue = parseInt(el.getAttribute('data-target') || '0', 10);
    const suffix = el.getAttribute('data-suffix') || '';

    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        const obj = { count: 0 };
        gsap.to(obj, {
          count: targetValue,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            const current = Math.round(obj.count);
            // Convert to Persian numeral string
            el.textContent = toPersianNumber(current) + suffix;
          }
        });
      }
    });
  });

  // Image Parallax Effect in Detail Pages
  const parallaxImages = document.querySelectorAll('[data-parallax-img]');
  parallaxImages.forEach(img => {
    gsap.to(img, {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: {
        trigger: img.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
}

/**
 * Converts English digits to Persian digits
 */
export function toPersianNumber(num) {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (d) => persianDigits[parseInt(d, 10)]);
}
