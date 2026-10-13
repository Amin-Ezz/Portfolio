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
    let lastNavDark = null;
    let lastBVisible = null;
    let lastBDark = null;

    // Detect all sections with a dark/black background
    const darkSections = Array.from(document.querySelectorAll(
      '#hero, #skills, #contact, [data-theme="dark"], .skills-section, .contact-section'
    ));

    // Cache dark section vertical bounds — eliminates repetitive getBoundingClientRect calls on scroll
    let darkBounds = [];
    let navFixedOffset = 45; // fixed top offset of navbar center from viewport top

    const updateBounds = () => {
      const scrollY = window.scrollY;
      darkBounds = darkSections.map(sec => {
        const rect = sec.getBoundingClientRect();
        return {
          top: rect.top + scrollY,
          bottom: rect.bottom + scrollY
        };
      });

      if (navSlab) {
        const nr = navSlab.getBoundingClientRect();
        navFixedOffset = nr.top + nr.height / 2;
      }
    };

    updateBounds();
    window.addEventListener('resize', updateBounds, { passive: true });
    window.addEventListener('orientationchange', updateBounds, { passive: true });
    window.addEventListener('load', updateBounds, { passive: true });

    const onScroll = () => {
      const scrollY = window.scrollY;
      const innerHeight = window.innerHeight;

      if (navSlab) {
        const checkY = scrollY + navFixedOffset;
        let isOverDark = false;
        for (let i = 0; i < darkBounds.length; i++) {
          if (checkY >= darkBounds[i].top && checkY <= darkBounds[i].bottom) {
            isOverDark = true;
            break;
          }
        }

        if (isOverDark !== lastNavDark) {
          lastNavDark = isOverDark;
          navSlab.classList.toggle('is-dark', isOverDark);
        }
      }

      if (backToTopBtn) {
        const shouldBeVisible = scrollY > innerHeight * 0.8;
        if (shouldBeVisible !== lastBVisible) {
          lastBVisible = shouldBeVisible;
          backToTopBtn.classList.toggle('is-visible', shouldBeVisible);
        }

        const bCheckY = scrollY + innerHeight - 50;
        let isBOverDark = false;
        for (let i = 0; i < darkBounds.length; i++) {
          if (bCheckY >= darkBounds[i].top && bCheckY <= darkBounds[i].bottom) {
            isBOverDark = true;
            break;
          }
        }

        if (isBOverDark !== lastBDark) {
          lastBDark = isBOverDark;
          backToTopBtn.classList.toggle('is-dark', isBOverDark);
        }
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


  // Mobile Navigation Drawer Controller
  initMobileDrawer();
}

function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileNavDrawer');
  const backdrop = document.getElementById('mobileNavBackdrop');
  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    toggleBtn.classList.add('is-active');
    toggleBtn.setAttribute('aria-label', 'بستن منوی ناوبری');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('mobile-menu-active');
  };

  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    toggleBtn.classList.remove('is-active');
    toggleBtn.setAttribute('aria-label', 'منوی ناوبری سایت');
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

