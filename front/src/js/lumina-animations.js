import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Lumina Showcase Redesign Engine (Black & White Edition)
 * Sticky Sidebar support, Carousel controls, Lightbox, and Entrance Animations
 */
export function initLuminaRedesign() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --------------------------------------------------------------------------
  // 01. Entrance Animations
  // --------------------------------------------------------------------------
  if (!prefersReducedMotion) {
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

      heroTL
        .fromTo('.lumina-top-subnav', { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.1 })
        .fromTo('.lumina-stage-card', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
        .fromTo('.lumina-info-card', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5');
    }

    // ScrollTrigger reveals for sections
    const animateSection = (selector, triggerSelector, yOffset = 30) => {
      const target = document.querySelector(selector);
      if (target) {
        gsap.fromTo(
          selector,
          { opacity: 0, y: yOffset },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: triggerSelector || selector,
              start: 'top 85%',
              once: true
            }
          }
        );
      }
    };

    animateSection('.lumina-about-section', '.lumina-about-section');
    animateSection('.lumina-carousel-section', '.lumina-carousel-section');
    animateSection('.lumina-next-section', '.lumina-next-section');
    animateSection('.lumina-quick-contact-section', '.lumina-quick-contact-section');
  }

  // --------------------------------------------------------------------------
  // 02. Interactive Screenshot Carousel Controller
  // --------------------------------------------------------------------------
  initCarousel();

  // --------------------------------------------------------------------------
  // 03. Lightbox Modal Controller
  // --------------------------------------------------------------------------
  initLightbox();
}

/**
 * Handles horizontal carousel navigation, arrow buttons, pagination dots, and swipe
 */
function initCarousel() {
  const viewport = document.getElementById('luminaCarouselViewport');
  const slides = Array.from(document.querySelectorAll('.lumina-carousel-slide'));
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');

  if (!viewport || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;

  // Build dots dynamically if needed or bind existing
  let dots = Array.from(document.querySelectorAll('.lumina-carousel-dot'));
  if (dots.length === 0 && dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `lumina-carousel-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `رفتن به اسلاید ${idx + 1}`);
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
      dots.push(dot);
    });
  } else {
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => goToSlide(idx));
    });
  }

  const updateDots = (activeIdx) => {
    currentIndex = activeIdx;
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeIdx);
    });
    if (prevBtn) prevBtn.disabled = activeIdx === 0;
    if (nextBtn) nextBtn.disabled = activeIdx === totalSlides - 1;
  };

  const goToSlide = (idx) => {
    const clamped = Math.max(0, Math.min(totalSlides - 1, idx));
    currentIndex = clamped;
    const targetSlide = slides[clamped];
    if (targetSlide) {
      targetSlide.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
      updateDots(clamped);
    }
  };

  // Button navigation (In RTL: Next moves forward to next slide, Prev moves backward)
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
    });
  }

  // IntersectionObserver to sync dots when scrolling/swiping
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const index = slides.indexOf(entry.target);
            if (index !== -1) {
              updateDots(index);
            }
          }
        });
      },
      {
        root: viewport,
        threshold: 0.55
      }
    );

    slides.forEach((slide) => observer.observe(slide));
  }

  // Mouse Drag / Touch Drag Support
  let isDown = false;
  let startX;
  let scrollLeft;

  viewport.addEventListener('mousedown', (e) => {
    isDown = true;
    viewport.classList.add('is-dragging');
    startX = e.pageX - viewport.offsetLeft;
    scrollLeft = viewport.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    if (isDown) {
      isDown = false;
      viewport.classList.remove('is-dragging');
    }
  });

  viewport.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - viewport.offsetLeft;
    const walk = (x - startX) * 1.5;
    viewport.scrollLeft = scrollLeft - walk;
  });

  // Keyboard navigation when focused
  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      goToSlide(currentIndex - 1);
    } else if (e.key === 'ArrowLeft') {
      goToSlide(currentIndex + 1);
    }
  });

  updateDots(0);
}

/**
 * Handles Lightbox full-size preview
 */
function initLightbox() {
  const modal = document.getElementById('luminaLightboxModal');
  const modalImg = document.getElementById('luminaLightboxImg');
  const modalCaption = document.getElementById('luminaLightboxCaption');
  const closeBtn = document.getElementById('luminaLightboxClose');

  if (!modal || !modalImg) return;

  const openLightbox = (src, alt) => {
    modalImg.src = src;
    modalImg.alt = alt || '';
    if (modalCaption) modalCaption.textContent = alt || '';
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  // Attach to all screenshot zoom buttons and images
  document.querySelectorAll('[data-zoom-src]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const src = el.getAttribute('data-zoom-src');
      const alt = el.getAttribute('data-zoom-alt') || el.getAttribute('alt') || '';
      if (src) openLightbox(src, alt);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target === closeBtn) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeLightbox();
    }
  });
}

// Auto-run on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initLuminaRedesign();
});
