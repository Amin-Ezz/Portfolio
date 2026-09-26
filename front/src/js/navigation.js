/**
 * Floating Navigation Engine
 */

export function initNavigation() {
  // Nav glass slab switches to the dark-surface (light text) variant while
  // it floats over the black hero; back to light glass once the hero scrolls off.
  const navSlab = document.querySelector('.nav-3d-slab');
  const backToTopBtn = document.getElementById('backToTop');

  if (navSlab || backToTopBtn) {
    let ticking = false;

    // Detect all sections with a dark/black background
    const darkSections = Array.from(document.querySelectorAll(
      '#hero, .transition-section, #skills, #cta-choice, #contact, [data-theme="dark"], .skills-section, .cta-choice-section, .contact-section'
    ));

    const onScroll = () => {
      const scrollY = window.scrollY;
      const innerHeight = window.innerHeight;

      if (navSlab) {
        // Vertical check point where the fixed navbar slab sits in viewport
        const navRect = navSlab.getBoundingClientRect();
        const checkY = navRect.top + navRect.height / 2;

        let isOverDark = false;
        for (let i = 0; i < darkSections.length; i++) {
          const rect = darkSections[i].getBoundingClientRect();
          // Check if navbar's vertical center lies inside this dark section
          if (rect.top <= checkY && rect.bottom >= checkY) {
            isOverDark = true;
            break;
          }
        }

        navSlab.classList.toggle('is-dark', isOverDark);
      }

      if (backToTopBtn) {
        if (scrollY > innerHeight * 0.8) {
          backToTopBtn.classList.add('is-visible');
        } else {
          backToTopBtn.classList.remove('is-visible');
        }

        const bRect = backToTopBtn.getBoundingClientRect();
        const bY = bRect.top + bRect.height / 2;
        let isBOverDark = false;
        for (let i = 0; i < darkSections.length; i++) {
          const rect = darkSections[i].getBoundingClientRect();
          if (rect.top <= bY && rect.bottom >= bY) {
            isBOverDark = true;
            break;
          }
        }
        backToTopBtn.classList.toggle('is-dark', isBOverDark);
      }

      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });

    // Synchronize with Lenis smooth scroll updates
    if (window.lenis) {
      window.lenis.on('scroll', requestTick);
    } else {
      setTimeout(() => {
        if (window.lenis) {
          window.lenis.on('scroll', requestTick);
        }
      }, 200);
    }

    onScroll(); // Run initially

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        if (window.lenis) {
          window.lenis.scrollTo(0, { duration: 1.4 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
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

