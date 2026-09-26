import gsap from 'gsap';

/**
 * Cinematic Shared-Element Page Transition Engine
 * Supports forward card expansion into project case study
 * and exact reverse shrinking back to original source (Hero 3D stack or Selected Works grid).
 */

/**
 * Helper to check if current page is any project detail page (mod-style, lumina, project-management, trip-os)
 */
export function isProjectDetailPage() {
  return !!(
    document.querySelector('.project-detail-hero-media') ||
    document.querySelector('.lumina-page') ||
    document.querySelector('.lumina-hero-section') ||
    document.querySelector('[data-project-page]') ||
    window.location.pathname.includes('/projects/')
  );
}

export function initTransitions() {
  // Ensure transition overlay exists
  let overlay = document.querySelector('.transition-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'transition-overlay';
    document.body.appendChild(overlay);
  }

  // Intercept clicks on any element with data-transition-target
  document.addEventListener('click', (e) => {
    const targetEl = e.target.closest('[data-transition-target]');
    if (!targetEl) return;

    // If it's a 3D hero card and not active yet, let hero.js bring it forward first
    if (targetEl.classList.contains('hero-project-card') && !targetEl.classList.contains('is-active-card')) {
      return;
    }

    e.preventDefault();
    const href = targetEl.getAttribute('href') || targetEl.getAttribute('data-href');
    const title = targetEl.getAttribute('data-project-title') || 'پروژه';
    const imageSrc = targetEl.getAttribute('data-project-image');

    if (!href) return;

    executeCardExpansion(targetEl, href, title, imageSrc);
  });

  // Intercept clicks on return-to-home buttons on project detail pages
  document.addEventListener('click', (e) => {
    const returnBtn = e.target.closest('a[href="/"], a[href="/#projects"], a[href="/index.html"], [data-return-home]');
    if (!returnBtn) return;

    // Only intercept if we are on a project detail page
    if (isProjectDetailPage()) {
      e.preventDefault();
      executeProjectExit(returnBtn.getAttribute('href') || '/');
    }
  });

  // Set return flag if user navigates back using browser Back button
  window.addEventListener('pagehide', () => {
    sessionStorage.setItem('amin_trigger_reverse_transition', 'true');
  });

  // Check if we are on a project detail page -> trigger entrance animation
  if (isProjectDetailPage()) {
    handlePageEntrance();
  } else {
    // We are on homepage -> check if we are returning from a project
    handlePageReturn();
  }
}

/**
 * Executes the card expansion to fullscreen and navigates
 */
function executeCardExpansion(sourceElement, targetUrl, title, imageSrc) {
  const rect = sourceElement.getBoundingClientRect();
  const isHero = !!sourceElement.closest('.hero-3d-scene') || sourceElement.classList.contains('hero-project-card');
  const slug = sourceElement.getAttribute('data-slug') || 
    targetUrl.replace('/projects/', '').replace('.html', '').replace('/', '');

  // Calculate targetIndex in hero stack if applicable
  let targetIndex = 0;
  if (isHero) {
    const heroCards = Array.from(document.querySelectorAll('.hero-project-card'));
    targetIndex = heroCards.indexOf(sourceElement);
    if (targetIndex < 0) targetIndex = 0;
  }

  // Preserve existing origin section if moving from one project to another via "Next Project"
  let existingOrigin = null;
  try {
    const saved = sessionStorage.getItem('amin_project_origin');
    if (saved) existingOrigin = JSON.parse(saved);
  } catch (e) {}

  const originData = {
    source: isHero ? 'hero' : (existingOrigin ? existingOrigin.source : 'works'),
    slug: slug,
    targetIndex: isHero ? targetIndex : (existingOrigin ? existingOrigin.targetIndex : 0),
    scrollY: isHero ? 0 : (existingOrigin && existingOrigin.scrollY ? existingOrigin.scrollY : window.scrollY),
    title: title,
    imageSrc: imageSrc,
    timestamp: Date.now()
  };

  sessionStorage.setItem('amin_project_origin', JSON.stringify(originData));

  // Create temporary clone for expansion
  const clone = document.createElement('div');
  clone.className = 'transition-clone-card';
  clone.style.cssText = `
    position: fixed;
    top: ${rect.top}px;
    left: ${rect.left}px;
    width: ${rect.width}px;
    height: ${rect.height}px;
    border-radius: 28px;
    overflow: hidden;
    z-index: 99999;
    background: #FFFFFF;
    box-shadow: 0 35px 80px rgba(0,0,0,0.18);
    pointer-events: none;
    transform-origin: center center;
    transition: none;
  `;

  if (imageSrc) {
    clone.innerHTML = `
      <div style="width: 100%; height: 100%; position: relative; overflow: hidden;">
        <img src="${imageSrc}" style="width: 100%; height: 100%; object-fit: cover;" alt="${title}" />
        <div class="card-gradient-overlay" style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%); display: flex; align-items: flex-end; padding: 3rem;">
          <h2 style="color: #FFFFFF; font-size: clamp(2rem, 5vw, 4.5rem); font-weight: 900; font-family: var(--font-vazir);">${title}</h2>
        </div>
      </div>
    `;
  }

  document.body.appendChild(clone);

  // Hide source card while clone expands
  sourceElement.style.opacity = '0';

  const tl = gsap.timeline({
    onComplete: () => {
      window.location.href = targetUrl;
    }
  });

  // Clone expands to fullscreen
  tl.to(clone, {
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    borderRadius: '0px',
    duration: 0.85,
    ease: 'power4.inOut'
  });

  // Overlay fade
  const overlay = document.querySelector('.transition-overlay');
  if (overlay) {
    tl.to(overlay, {
      opacity: 1,
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      duration: 0.35,
      ease: 'power2.in'
    }, '-=0.3');
  }
}

/**
 * Executes exit animation from project detail page and returns to home
 */
export function executeProjectExit(targetUrl = '/') {
  sessionStorage.setItem('amin_trigger_reverse_transition', 'true');

  // Fallback origin data if user refreshed directly on a project detail page
  if (!sessionStorage.getItem('amin_project_origin')) {
    let slug = 'lumina';
    let title = 'LUMINA';
    let imageSrc = '/images/lumina-hero.png';
    const path = window.location.pathname;
    if (path.includes('mod-style')) {
      slug = 'mod-style';
      title = 'MODSTYLE';
      imageSrc = '/images/modstyle-hero.png?v=2';
    } else if (path.includes('project-management')) {
      slug = 'project-management';
      title = 'NORTHWIND';
      imageSrc = '/images/northwind-hero.png';
    } else if (path.includes('trip-os')) {
      slug = 'trip-os';
      title = 'TRIP OS';
      imageSrc = '/images/tripos-hero.png';
    }
    sessionStorage.setItem('amin_project_origin', JSON.stringify({
      source: 'works',
      slug,
      targetIndex: 0,
      title,
      imageSrc,
      timestamp: Date.now()
    }));
  }

  // When returning to home root or /#projects, normalize targetUrl to /
  // so that handlePageReturn executes the exact reverse card shrinking animation
  let finalTargetUrl = targetUrl;
  if (targetUrl === '/#projects' || targetUrl.endsWith('/#projects')) {
    finalTargetUrl = '/';
  } else if (targetUrl.includes('#')) {
    sessionStorage.setItem('amin_return_hash', targetUrl.split('#')[1]);
  }

  const projectTitle = document.querySelector('.project-detail-title, .lumina-hero-h1');
  const projectContent = document.querySelector('.project-case-content, .editorial-container');
  const projectHeader = document.querySelector('header, .lumina-nav-header');
  const projectMonitor = document.querySelector('.lumina-white-monitor, .lumina-hero-monitor-col, .lumina-hero-img-col, .lumina-hero-img-wrap');
  const projectHeroMedia = document.querySelector('.project-detail-hero-media');

  const tl = gsap.timeline({
    onComplete: () => {
      window.location.href = finalTargetUrl;
    }
  });

  if (projectHeader) {
    tl.to(projectHeader, { opacity: 0, y: -20, duration: 0.25, ease: 'power2.in' }, 0);
  }
  if (projectMonitor) {
    tl.to(projectMonitor, { opacity: 0, scale: 0.95, y: 15, duration: 0.25, ease: 'power2.in' }, 0);
  } else if (projectHeroMedia) {
    tl.to(projectHeroMedia, { opacity: 0, scale: 0.96, duration: 0.25, ease: 'power2.in' }, 0);
  }
  if (projectContent) {
    tl.to(projectContent, { opacity: 0, y: 25, duration: 0.25, ease: 'power2.in' }, 0);
  }
  if (projectTitle) {
    tl.to(projectTitle, { opacity: 0, duration: 0.25, ease: 'power2.in' }, 0);
  }

  let overlay = document.querySelector('.transition-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'transition-overlay';
    document.body.appendChild(overlay);
  }

  // Set overlay background color to match current project page (pure white/light) so it never flashes dark
  overlay.style.backgroundColor = '#FFFFFF';

  // Smoothly fade in a clean white transition overlay
  tl.to(overlay, {
    opacity: 1,
    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
    duration: 0.3,
    ease: 'power2.inOut'
  }, 0.05);
}

/**
 * Handles reverse animation when returning from a project back to homepage
 */
function handlePageReturn() {
  const originStr = sessionStorage.getItem('amin_project_origin');
  const clearReturnCover = () => {
    document.documentElement.classList.remove('is-returning-from-project');
  };

  if (!originStr) {
    clearReturnCover();
    return;
  }

  try {
    const returnHash = sessionStorage.getItem('amin_return_hash');
    // If returning to a different section (not projects) and no card animation is wanted
    if (returnHash && returnHash !== 'projects') {
      sessionStorage.removeItem('amin_return_hash');
      sessionStorage.removeItem('amin_project_origin');
      sessionStorage.removeItem('amin_trigger_reverse_transition');
      clearReturnCover();
      scrollToHomeSection(returnHash);
      return;
    }
    if (returnHash) {
      sessionStorage.removeItem('amin_return_hash');
    }

    const isReturning = sessionStorage.getItem('amin_trigger_reverse_transition') === 'true';
    if (!isReturning) {
      clearReturnCover();
      return;
    }
    sessionStorage.removeItem('amin_trigger_reverse_transition');

    let originData;
    try {
      originData = JSON.parse(originStr);
    } catch (e) {
      clearReturnCover();
      return;
    }

  // Disable browser automatic scroll restoration to avoid jumping
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Restore scroll position immediately
  let targetScrollY = originData.scrollY;
  if (typeof targetScrollY !== 'number' || targetScrollY <= 0) {
    const cardEl = document.querySelector(`.work-grid-card[data-slug="${originData.slug}"]`);
    if (cardEl) {
      targetScrollY = cardEl.getBoundingClientRect().top + window.scrollY - 140;
    } else {
      targetScrollY = 0;
    }
  }

  window.scrollTo({ top: targetScrollY, behavior: 'instant' });
  if (window.lenis) {
    window.lenis.scrollTo(targetScrollY, { immediate: true });
  }

  // Synchronously create and attach fullscreen clone to instantly cover the viewport before any repaint,
  // preventing the underlying page or black hero canvas from flashing for a single frame.
  const returnClone = document.createElement('div');
  returnClone.className = 'transition-clone-card';
  returnClone.style.cssText = `
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    border-radius: 0px;
    overflow: hidden;
    z-index: 99999;
    background: #FFFFFF;
    box-shadow: 0 35px 80px rgba(0,0,0,0.22);
    pointer-events: none;
  `;

  returnClone.innerHTML = `
    <div style="width: 100%; height: 100%; position: relative; overflow: hidden; background: #FFFFFF;">
      <img src="${originData.imageSrc}" style="width: 100%; height: 100%; object-fit: cover;" alt="${originData.title}" />
      <div class="card-gradient-overlay" style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%); display: flex; align-items: flex-end; padding: 3rem;">
        <h2 style="color: #FFFFFF; font-size: clamp(2rem, 5vw, 4.5rem); font-weight: 900; font-family: var(--font-vazir);">${originData.title}</h2>
      </div>
    </div>
  `;

  document.body.appendChild(returnClone);

  // Hide transition overlay now that returnClone covers the screen
  const overlay = document.querySelector('.transition-overlay');
  if (overlay) {
    gsap.set(overlay, { opacity: 0 });
  }

  // The clone now covers the viewport, so the white pre-paint sheet has done
  // its job. Drop it immediately — while it stays up it sits at z-index 99998,
  // just under the clone, so the shrinking card would play over an empty white
  // page instead of over the site it is shrinking back into.
  clearReturnCover();

  // Use double requestAnimationFrame to ensure browser has completed layout & scroll restoration
  requestAnimationFrame(() => {
    window.scrollTo({ top: targetScrollY, behavior: 'instant' });
    if (window.lenis) {
      window.lenis.scrollTo(targetScrollY, { immediate: true });
    }

    requestAnimationFrame(() => {
      // Locate the exact target card on the page
      let targetCard = null;
      if (originData.source === 'hero') {
        targetCard = document.querySelector(`.hero-project-card[data-slug="${originData.slug}"]`) ||
                     document.querySelector('.hero-project-card.is-active-card') ||
                     document.querySelector('.hero-project-card');
      } else {
        targetCard = document.querySelector(`.work-grid-card[data-slug="${originData.slug}"]`) ||
                     document.querySelector(`.work-grid-card[data-href*="${originData.slug}"]`);
      }

      if (!targetCard) {
        document.documentElement.classList.remove('is-returning-from-project');
        gsap.to(returnClone, {
          opacity: 0,
          duration: 0.35,
          onComplete: () => {
            returnClone.remove();
            sessionStorage.removeItem('amin_project_origin');
          }
        });
        return;
      }

      const targetRect = targetCard.getBoundingClientRect();

      // Hide real card while clone is shrinking into place
      targetCard.style.visibility = 'hidden';

      const reverseTl = gsap.timeline({
        onComplete: () => {
          targetCard.style.visibility = '';
          gsap.set(targetCard, { opacity: 1, y: 0, scale: 1 });
          clearReturnCover();
          gsap.fromTo(
            targetCard,
            { scale: 0.96 },
            { scale: 1, duration: 0.45, ease: 'back.out(1.6)' }
          );
          returnClone.remove();
          sessionStorage.removeItem('amin_project_origin');
          if (window.ScrollTrigger) {
            window.ScrollTrigger.refresh();
          }
        }
      });

      const gradientOverlay = returnClone.querySelector('.card-gradient-overlay');
      if (gradientOverlay) {
        reverseTl.to(gradientOverlay, { opacity: 0, duration: 0.4, ease: 'power2.out' }, 0);
      }

      // Shrink clone back to exact position and dimensions of the origin card
      reverseTl.to(returnClone, {
        top: targetRect.top,
        left: targetRect.left,
        width: targetRect.width,
        height: targetRect.height,
        borderRadius: '28px',
        duration: 0.85,
        ease: 'power4.inOut'
      }, 0);

      // Smoothly dissolve clone at the end as real card emerges
      reverseTl.to(returnClone, {
        opacity: 0,
        duration: 0.18,
        ease: 'power2.out'
      }, '-=0.15');
    });
  });
  } catch (err) {
    console.error('[AMIN.EZ Transitions] handlePageReturn error:', err);
    clearReturnCover();
  }
}

/**
 * Project detail page entrance reveal animation
 */
function handlePageEntrance() {
  const projectHeroImage = document.querySelector('.project-detail-hero-media img');
  const projectHeroTitle = document.querySelector('.project-detail-title');
  const projectMetaItems = document.querySelectorAll('.project-meta-item');
  const projectContent = document.querySelector('.project-case-content');

  if (projectHeroImage) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Initial state
    gsap.set(projectHeroImage, {
      scale: 1.08,
      filter: 'blur(12px)',
      opacity: 0.7
    });

    if (projectHeroTitle) {
      gsap.set(projectHeroTitle, {
        y: 35,
        opacity: 0
      });
    }

    if (projectMetaItems.length > 0) {
      gsap.set(projectMetaItems, {
        y: 20,
        opacity: 0
      });
    }

    if (projectContent) {
      gsap.set(projectContent, {
        opacity: 0,
        y: 25
      });
    }

    // Animate in
    tl.to(projectHeroImage, {
      scale: 1,
      filter: 'blur(0px)',
      opacity: 1,
      duration: 1.1,
      ease: 'power2.out'
    }, 0.1);

    if (projectHeroTitle) {
      tl.to(projectHeroTitle, {
        y: 0,
        opacity: 1,
        duration: 0.85
      }, 0.25);
    }

    if (projectMetaItems.length > 0) {
      tl.to(projectMetaItems, {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.75
      }, 0.45);
    }

    if (projectContent) {
      tl.to(projectContent, {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, 0.6);
    }
  }

  // Clear entrance session flag
  sessionStorage.removeItem('amin_page_transition');
}

/**
 * Smooth transition for returning to home or navigating between pages
 */
export function navigateWithTransition(url) {
  executeProjectExit(url);
}

/**
 * Scrolls the homepage to a specific section after returning from a project.
 * initTransitions() runs before initScrollEngine() creates window.lenis, so
 * wait for Lenis to exist before scrolling — scrollIntoView alone gets
 * swallowed by Lenis' manual scroll handling.
 */
function scrollToHomeSection(sectionId) {
  const attemptScroll = (attempt = 0) => {
    const targetEl = document.getElementById(sectionId);
    if (!targetEl) {
      if (attempt < 120) requestAnimationFrame(() => attemptScroll(attempt + 1));
      return;
    }
    if (window.lenis) {
      window.lenis.scrollTo(targetEl, { offset: -40, duration: 1.2 });
    } else if (attempt < 120) {
      requestAnimationFrame(() => attemptScroll(attempt + 1));
    }
  };
  requestAnimationFrame(() => attemptScroll());
}
