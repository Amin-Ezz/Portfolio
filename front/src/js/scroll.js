import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function initScrollEngine() {
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 860;

  let lenis = null;

  if (!isTouchDevice) {
    // Initialize Lenis smooth scroll for Desktop (mouse wheel)
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
  } else {
    // Mobile / Touch devices: native 120Hz/60Hz compositor scrolling
    // ScrollTrigger will update passively with zero main thread blocking
    window.addEventListener('scroll', () => {
      ScrollTrigger.update();
    }, { passive: true });
  }

  // Enable lag smoothing to prevent jarring frame skips during mobile GC/rendering spikes
  gsap.ticker.lagSmoothing(500, 33);

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(targetElement, { offset: -40, duration: 1.1 });
          } else {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
  });

  // Setup ScrollTrigger Animations
  setupScrollAnimations();

  // Recalculate ScrollTrigger on mobile orientation or resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);
  });

  return lenis;
}

function setupScrollAnimations() {
  const isMobile = window.innerWidth <= 860 || window.matchMedia('(pointer: coarse)').matches;

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

  // Transition bridge (Hero → Projects): scrubbed reveal
  const transitionReveals = document.querySelectorAll('.transition-reveal');
  if (transitionReveals.length > 0) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      gsap.set(transitionReveals, { clearProps: 'all' });
    } else {
      gsap.to(transitionReveals, {
        opacity: 1,
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
  // (translate) is fully overridden and never leaves a residue.
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
          y: 0,
          duration: 0.8,
          ease: 'power3.out'
        }, 0.05);
      }

      ctaTl
        .to(ctaChoiceSection.querySelector('.cta-choice-headline'), {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out'
        }, 0.2)
        .to(ctaChoiceSection.querySelectorAll('.cta-choice-panel-idea'), {
          opacity: 1,
          x: 0,
          duration: 1.1,
          ease: 'power3.out'
        }, 0.55)
        .to(ctaChoiceSection.querySelectorAll('.cta-choice-panel-product'), {
          opacity: 1,
          x: 0,
          duration: 1.1,
          ease: 'power3.out'
        }, 0.75)
        .to(ctaChoiceSection.querySelector('.cta-choice-action'), {
          opacity: 1,
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

  // Project cards in the Selected Works grid — cinematic entrance
  const gridCards = document.querySelectorAll('.work-grid-card');
  const worksGrid = document.querySelector('.works-grid-container');
  if (gridCards.length > 0 && worksGrid) {
    const isMobile = window.innerWidth <= 860 || window.matchMedia('(pointer: coarse)').matches;

    if (isMobile) {
      // Fluid mobile/touch card animation (smooth 60fps without heavy 3D perspective or deep blurs)
      gsap.set(gridCards, {
        y: 45,
        opacity: 0,
        scale: 0.97,
        willChange: 'transform, opacity'
      });

      const workTl = gsap.timeline({
        scrollTrigger: {
          trigger: worksGrid,
          start: 'top 85%',
          once: true
        },
        onComplete: () => {
          worksGrid.classList.add('is-animated');
          gsap.set(gridCards, { clearProps: 'all' });
          gsap.set(worksGrid.querySelectorAll('.work-card-line-inner'), { clearProps: 'transform' });
        }
      });

      gridCards.forEach((card, idx) => {
        workTl.to(card, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.75,
          ease: 'power3.out'
        }, idx * 0.18);

        const lines = card.querySelectorAll('.work-card-line-inner');
        if (lines.length > 0) {
          workTl.to(lines, {
            y: '0%',
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.08
          }, idx * 0.18 + 0.15);
        }
      });
    } else {
      // Full cinematic desktop 3D entrance (pure GPU transform & opacity without heavy raster blur)
      gsap.set(gridCards, {
        y: 80,
        opacity: 0,
        scale: 0.94,
        rotateX: 10,
        transformPerspective: 1200,
        transformOrigin: '50% 100%',
        willChange: 'transform, opacity'
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
        const rowStart = pairIndex * 0.4;

        workTl.to(pair, {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateX: 0,
          duration: 1.0,
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
