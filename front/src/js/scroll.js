import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function initScrollEngine() {
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 860;

  let lenis = null;

  // Initialize Lenis strictly for programmatic smooth scrolling (anchors, transitions)
  // Disable smoothWheel so mouse wheel & touch use 100% native GPU compositor scrolling (حذف کامل حالت آروم و تاخیردار، صفر درصد لگ)
  try {
    lenis = new Lenis({
      smoothWheel: false,
      syncTouch: false,
      autoRaf: false
    });

    // Connect Lenis to GSAP ticker so programmatic scrollTo animations tick on every animation frame
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
  } catch (err) {
    console.warn('Lenis initialized in fallback mode', err);
  }

  // Restore GSAP lagSmoothing so the engine smoothly recovers from any frame spikes
  gsap.ticker.lagSmoothing(500, 33);

  // Synchronize ScrollTrigger with native high-performance passive scroll events
  window.addEventListener('scroll', ScrollTrigger.update, { passive: true });

  // Universal smooth scroll handler for all anchor links (top navbar, mobile menu, buttons, CTA, etc.)
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const targetId = anchor.getAttribute('href');
    if (targetId && targetId !== '#' && targetId.startsWith('#')) {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        if (lenis && typeof lenis.scrollTo === 'function') {
          lenis.scrollTo(targetElement, { offset: -70, duration: 1.1 });
        } else {
          const navOffset = 70;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - navOffset;
          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth'
          });
        }
      }
    }
  });

  // Setup ScrollTrigger Animations
  setupScrollAnimations();

  // Recalculate ScrollTrigger on mobile orientation or resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (lenis) lenis.resize();
      ScrollTrigger.refresh();
    }, 250);
  });
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      if (lenis) lenis.resize();
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

  // Transition bridge (Hero → Projects): lightweight smooth trigger reveal
  const transitionReveals = document.querySelectorAll('.transition-reveal');
  if (transitionReveals.length > 0) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      gsap.set(transitionReveals, { clearProps: 'all' });
    } else {
      gsap.to(transitionReveals, {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        duration: 0.75,
        stagger: 0.12,
        scrollTrigger: {
          trigger: '.transition-section',
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      });
    }
  }

  // Side Journey Pathway Animation (runs ONCE upon entering section):
  // Traveling dot moves from confused top -> reaches bottom -> lights up lightbulb!
  const journeySection = document.querySelector('.transition-section');
  const pathTrack = document.getElementById('journeyTrackPath');
  const progressLine = document.getElementById('journeyProgressPath');
  const travelingDot = document.getElementById('journeyTravelingDot');
  const bulbEnd = document.getElementById('sideJourneyEnd');

  if (journeySection && pathTrack && travelingDot) {
    let journeyHasRun = false;
    const totalLength = pathTrack.getTotalLength ? pathTrack.getTotalLength() : 270;

    if (progressLine) {
      progressLine.style.strokeDasharray = `${totalLength}`;
      progressLine.style.strokeDashoffset = `${totalLength}`;
    }

    ScrollTrigger.create({
      trigger: journeySection,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        if (journeyHasRun) return;
        journeyHasRun = true;

        const animObj = { progress: 0 };
        gsap.to(animObj, {
          progress: 1,
          duration: 1.8,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (pathTrack.getPointAtLength) {
              const pt = pathTrack.getPointAtLength(animObj.progress * totalLength);
              travelingDot.setAttribute('cx', pt.x);
              travelingDot.setAttribute('cy', pt.y);
            } else {
              travelingDot.setAttribute('cy', animObj.progress * 220);
            }
            if (progressLine) {
              progressLine.style.strokeDashoffset = `${totalLength * (1 - animObj.progress)}`;
            }
          },
          onComplete: () => {
            if (bulbEnd) {
              bulbEnd.classList.add('is-illuminated');
            }
          }
        });
      }
    });
  }
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

  // Project cards in the Selected Works grid — silky smooth 60fps entrance
  const gridCards = document.querySelectorAll('.work-grid-card');
  const worksGrid = document.querySelector('.works-grid-container');
  if (gridCards.length > 0 && worksGrid) {
    const isMobile = window.innerWidth <= 860 || window.matchMedia('(pointer: coarse)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isReturningFromProject = sessionStorage.getItem('amin_trigger_reverse_transition') === 'true' ||
                                   document.documentElement.classList.contains('is-returning-from-project');

    if (reducedMotion || isReturningFromProject) {
      worksGrid.classList.add('is-animated');
      gsap.set(gridCards, { clearProps: 'all' });
      gsap.set(worksGrid.querySelectorAll('.work-card-line-inner'), { clearProps: 'all' });
    } else {
      // Lightweight initial state — subtle vertical offset for a light entrance
      gsap.set(gridCards, {
        y: isMobile ? 22 : 30,
        opacity: 0,
        scale: 0.985
      });

      const workTl = gsap.timeline({
        scrollTrigger: {
          trigger: worksGrid,
          start: 'top 82%',
          once: true
        },
        onComplete: () => {
          worksGrid.classList.add('is-animated');
          gsap.set(gridCards, { clearProps: 'transform,scale' });
          gsap.set(worksGrid.querySelectorAll('.work-card-line-inner'), { clearProps: 'all' });
        }
      });

      // One-by-one sequential entrance with a light, crisp animation
      gridCards.forEach((card, idx) => {
        workTl.to(card, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.48,
          ease: 'power2.out',
          onComplete: () => {
            gsap.set(card, { clearProps: 'transform,scale' });
          }
        }, idx * 0.18);
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
