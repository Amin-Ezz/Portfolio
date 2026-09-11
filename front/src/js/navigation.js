/**
 * Floating Navigation Engine
 */

export function initNavigation() {
  // Nav glass slab switches to the dark-surface (light text) variant while
  // it floats over the black hero; back to light glass once the hero scrolls off.
  const navSlab = document.querySelector('.nav-3d-slab');
  if (navSlab) {
    // Slab spans ~24px-65px from the top; keep light text until it clears
    // the 100vh dark hero (with a tiny margin).
    const toggleSlabTheme = () => {
      navSlab.classList.toggle('is-dark', window.scrollY < window.innerHeight - 72);
    };

    window.addEventListener('scroll', toggleSlabTheme, { passive: true });
    toggleSlabTheme();
  }

  // Back-to-top button: visible after scrolling down one viewport
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    const toggleBackToTop = () => {
      if (window.scrollY > window.innerHeight * 0.8) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    };

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTopBtn.addEventListener('click', () => {
      if (window.lenis) {
        window.lenis.scrollTo(0, { duration: 1.4 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // Contact live video backdrop: some browsers defer autoplay while the tab
  // is hidden; guarantee playback resumes once the section approaches view.
  const contactVideo = document.querySelector('.contact-bg-video');
  if (contactVideo) {
    const ensurePlaying = () => {
      if (document.visibilityState === 'visible' && contactVideo.paused) {
        contactVideo.play().catch(() => {});
      }
    };

    ensurePlaying();
    document.addEventListener('visibilitychange', ensurePlaying);

    if (window.gsap && window.gsap.ScrollTrigger) {
      window.gsap.ScrollTrigger.create({
        trigger: '#contact',
        start: 'top bottom',
        onEnter: ensurePlaying,
        onEnterBack: ensurePlaying
      });
    } else {
      window.addEventListener('scroll', ensurePlaying, { passive: true });
    }
  }

  // Mobile Navigation Drawer Controller
  initMobileDrawer();
}

function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileNavDrawer');
  const closeBtn = document.getElementById('mobileNavClose');
  const backdrop = document.getElementById('mobileNavBackdrop');
  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('mobile-menu-active');
  };

  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('mobile-menu-active');
  };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (drawer.classList.contains('is-open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeDrawer);
  }

  // Close when tapping Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // Handle mobile links smooth scroll and auto-close
  const mobileLinks = drawer.querySelectorAll('.mobile-nav-link, .mobile-nav-cta');
  mobileLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        closeDrawer();
        const target = document.querySelector(href);
        if (target) {
          setTimeout(() => {
            if (window.lenis) {
              window.lenis.scrollTo(target, { offset: -30, duration: 1.2 });
            } else {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          }, 200);
        }
      }
    });
  });
}

