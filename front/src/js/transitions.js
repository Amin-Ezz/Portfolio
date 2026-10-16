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
  if (window.location.pathname.includes('/projects/all') || document.querySelector('.projects-archive-page')) {
    return false;
  }
  return !!(
    document.querySelector('.project-detail-hero-media') ||
    document.querySelector('.lumina-page') ||
    document.querySelector('.lumina-showcase-page') ||
    document.querySelector('.lumina-hero-section') ||
    document.querySelector('[data-project-page]') ||
    window.location.pathname.includes('/projects/')
  );
}

/**
 * Helper to check if current page is the all projects archive page
 */
export function isArchivePage() {
  return window.location.pathname.includes('/projects/all') || !!document.querySelector('.projects-archive-page');
}

/**
 * Dynamically configures project detail back buttons and breadcrumbs based on entry origin
 */
export function updateProjectDetailBackButtons() {
  if (!isProjectDetailPage()) return;

  let originData = null;
  try {
    const saved = sessionStorage.getItem('amin_project_origin');
    if (saved) originData = JSON.parse(saved);
  } catch (e) {}

  const isFromArchive = originData && (originData.source === 'archive' || (originData.returnUrl && originData.returnUrl.includes('/projects/all')));

  const backBtns = document.querySelectorAll('.nav-back-glass-btn, [data-return-home]');
  backBtns.forEach(btn => {
    if (isFromArchive) {
      btn.setAttribute('href', '/projects/all.html');
      btn.setAttribute('aria-label', 'بازگشت به همه پروژه‌ها');
      const span = btn.querySelector('span');
      if (span) span.textContent = 'بازگشت به همه پروژه‌ها';
    } else {
      btn.setAttribute('href', '/#projects');
      btn.setAttribute('aria-label', 'بازگشت به پروژه‌های منتخب');
      const span = btn.querySelector('span');
      if (span) span.textContent = 'بازگشت به صفحه اصلی';
    }
  });

  const breadcrumbLinks = document.querySelectorAll('.lumina-breadcrumbs a');
  breadcrumbLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href.includes('projects') || href === '/#projects') {
      if (isFromArchive) {
        link.setAttribute('href', '/projects/all.html');
        link.textContent = 'همه پروژه‌ها';
      } else {
        link.setAttribute('href', '/#projects');
        link.textContent = 'پروژه‌ها';
      }
    }
  });

  const navProjectsLink = document.querySelector('.nav-slab-links a[href*="projects"]');
  if (navProjectsLink && isFromArchive) {
    navProjectsLink.setAttribute('href', '/projects/all.html');
  }

  const mobileProjectsLink = document.querySelector('.mobile-nav-link[href*="projects"]');
  if (mobileProjectsLink && isFromArchive) {
    mobileProjectsLink.setAttribute('href', '/projects/all.html');
  }
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

  // Intercept clicks on return-to-home, section anchor buttons, and archive links on project detail pages
  document.addEventListener('click', (e) => {
    const returnBtn = e.target.closest('a[href="/"], a[href^="/#"], a[href="/index.html"], a[href^="/index.html#"], [data-return-home], a[href="/projects/all.html"], a[href^="/projects/all"], .nav-back-glass-btn');
    if (!returnBtn) return;

    // Only intercept if we are on a project detail page
    if (isProjectDetailPage()) {
      const isLogo = returnBtn.classList.contains('nav-logo') || returnBtn.closest('.nav-logo');
      const isBackBtn = returnBtn.classList.contains('nav-back-glass-btn') || returnBtn.closest('.nav-back-glass-btn') || returnBtn.hasAttribute('data-return-home');
      const isBreadcrumbProjects = returnBtn.closest('.lumina-breadcrumbs') && ((returnBtn.getAttribute('href') || '').includes('projects') || (returnBtn.getAttribute('href') || '').includes('/projects/all'));

      let originData = null;
      try {
        const saved = sessionStorage.getItem('amin_project_origin');
        if (saved) originData = JSON.parse(saved);
      } catch (err) {}

      const isFromArchive = originData && (originData.source === 'archive' || (originData.returnUrl && originData.returnUrl.includes('/projects/all')));

      let targetUrl = returnBtn.getAttribute('href') || '/';

      if (isLogo) {
        targetUrl = '/';
      } else if (isBackBtn || isBreadcrumbProjects) {
        if (isFromArchive) {
          targetUrl = '/projects/all.html';
        } else {
          targetUrl = '/#projects';
        }
      }

      e.preventDefault();
      executeProjectExit(targetUrl);
    }
  });

  // Set return flag if user navigates back using browser Back button
  window.addEventListener('pagehide', () => {
    if (!sessionStorage.getItem('amin_return_hash') && sessionStorage.getItem('amin_project_origin')) {
      sessionStorage.setItem('amin_trigger_reverse_transition', 'true');
    }
  });

  // Check if we are on a project detail page -> trigger entrance animation and configure back buttons
  if (isProjectDetailPage()) {
    updateProjectDetailBackButtons();
    handlePageEntrance();
  } else {
    // We are on homepage or archive page -> check if we are returning from a project
    handlePageReturn();
  }
}

/**
 * Executes the card expansion to fullscreen and navigates
 */
function executeCardExpansion(sourceElement, targetUrl, title, imageSrc) {
  const rect = sourceElement.getBoundingClientRect();
  const isHero = !!sourceElement.closest('.hero-3d-scene') || sourceElement.classList.contains('hero-project-card');
  const isArchive = !!sourceElement.closest('.projects-archive-page') || 
                    window.location.pathname.includes('/projects/all') ||
                    !!document.querySelector('.projects-archive-page');
  const slug = sourceElement.getAttribute('data-slug') || 
    targetUrl.split('?')[0].replace('/projects/', '').replace('.html', '').replace('/', '');

  // Calculate targetIndex in hero stack if applicable
  let targetIndex = 0;
  if (isHero) {
    const heroCards = Array.from(document.querySelectorAll('.hero-project-card'));
    targetIndex = heroCards.indexOf(sourceElement);
    if (targetIndex < 0) targetIndex = 0;
  }

  // Preserve existing origin section if moving from one project to another via "Next Project" / "Other Projects"
  let existingOrigin = null;
  try {
    const saved = sessionStorage.getItem('amin_project_origin');
    if (saved) existingOrigin = JSON.parse(saved);
  } catch (e) {}

  let originSource = 'works';
  let returnUrl = '/#projects';

  if (isHero) {
    originSource = 'hero';
    returnUrl = '/';
  } else if (isArchive) {
    originSource = 'archive';
    returnUrl = '/projects/all.html';
  } else if (existingOrigin && existingOrigin.source) {
    originSource = existingOrigin.source;
    returnUrl = existingOrigin.returnUrl || (existingOrigin.source === 'archive' ? '/projects/all.html' : '/#projects');
  } else {
    originSource = 'works';
    returnUrl = '/#projects';
  }

  const originData = {
    source: originSource,
    returnUrl: returnUrl,
    slug: slug,
    targetIndex: isHero ? targetIndex : (existingOrigin ? existingOrigin.targetIndex : 0),
    scrollY: (isArchive || !existingOrigin) ? window.scrollY : (existingOrigin && existingOrigin.scrollY ? existingOrigin.scrollY : window.scrollY),
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
  let originData = null;
  const originStr = sessionStorage.getItem('amin_project_origin');
  if (originStr) {
    try {
      originData = JSON.parse(originStr);
    } catch (e) {}
  }

  if (!originData) {
    let slug = 'lumina';
    let title = 'LUMINA';
    let imageSrc = '/images/lumina-hero.webp';
    const path = window.location.pathname;
    if (path.includes('mod-style')) {
      slug = 'mod-style';
      title = 'MODSTYLE';
      imageSrc = '/images/modstyle-hero.webp?v=3';
    } else if (path.includes('project-management')) {
      slug = 'project-management';
      title = 'NORTHWIND';
      imageSrc = '/images/northwind-hero.webp';
    } else if (path.includes('trip-os')) {
      slug = 'trip-os';
      title = 'TRIP OS';
      imageSrc = '/images/tripos-hero.webp';
    }
    originData = {
      source: 'works',
      slug,
      targetIndex: 0,
      title,
      imageSrc,
      returnUrl: '/#projects',
      timestamp: Date.now()
    };
    sessionStorage.setItem('amin_project_origin', JSON.stringify(originData));
  }

  const isFromArchive = originData && (originData.source === 'archive' || (originData.returnUrl && originData.returnUrl.includes('/projects/all')));

  // Normalize targetUrl
  let finalTargetUrl = targetUrl;
  if (targetUrl.includes('/projects/all')) {
    finalTargetUrl = '/projects/all.html';
    sessionStorage.removeItem('amin_return_hash');
    sessionStorage.setItem('amin_trigger_reverse_transition', 'true');
    originData.source = 'archive';
    originData.returnUrl = '/projects/all.html';
    sessionStorage.setItem('amin_project_origin', JSON.stringify(originData));
  } else if (targetUrl === '/#projects' || targetUrl.endsWith('/#projects')) {
    if (isFromArchive) {
      finalTargetUrl = '/projects/all.html';
      sessionStorage.removeItem('amin_return_hash');
      sessionStorage.setItem('amin_trigger_reverse_transition', 'true');
    } else {
      finalTargetUrl = '/';
      sessionStorage.setItem('amin_return_hash', 'projects');
      sessionStorage.setItem('amin_trigger_reverse_transition', 'true');
    }
  } else if (targetUrl === '/' || targetUrl === '/index.html') {
    if (isFromArchive) {
      finalTargetUrl = '/projects/all.html';
      sessionStorage.removeItem('amin_return_hash');
      sessionStorage.setItem('amin_trigger_reverse_transition', 'true');
    } else {
      finalTargetUrl = '/';
      sessionStorage.removeItem('amin_return_hash');
      sessionStorage.removeItem('amin_project_origin');
      sessionStorage.removeItem('amin_trigger_reverse_transition');
    }
  } else if (targetUrl.includes('#')) {
    const hash = targetUrl.split('#')[1];
    sessionStorage.setItem('amin_return_hash', hash);
    sessionStorage.removeItem('amin_project_origin');
    sessionStorage.removeItem('amin_trigger_reverse_transition');
  }

  const projectTitle = document.querySelector('.project-detail-title, .lumina-hero-h1, .lumina-info-title');
  const projectContent = document.querySelector('.project-case-content, .editorial-container, .lumina-main-stream');
  const projectHeader = document.querySelector('header, .lumina-nav-header, .site-header');
  const projectMonitor = document.querySelector('.lumina-white-monitor, .lumina-hero-monitor-col, .lumina-hero-img-col, .lumina-hero-img-wrap, .lumina-stage-card');
  const projectHeroMedia = document.querySelector('.project-detail-hero-media');

  let hasNavigated = false;
  const navigate = () => {
    if (!hasNavigated) {
      hasNavigated = true;
      window.location.href = finalTargetUrl;
    }
  };

  const tl = gsap.timeline({
    onComplete: navigate
  });

  if (projectHeader) {
    tl.to(projectHeader, { opacity: 0, y: -20, duration: 0.22, ease: 'power2.in' }, 0);
  }
  if (projectMonitor) {
    tl.to(projectMonitor, { opacity: 0, scale: 0.95, y: 15, duration: 0.22, ease: 'power2.in' }, 0);
  } else if (projectHeroMedia) {
    tl.to(projectHeroMedia, { opacity: 0, scale: 0.96, duration: 0.22, ease: 'power2.in' }, 0);
  }
  if (projectContent) {
    tl.to(projectContent, { opacity: 0, y: 25, duration: 0.22, ease: 'power2.in' }, 0);
  }
  if (projectTitle) {
    tl.to(projectTitle, { opacity: 0, duration: 0.22, ease: 'power2.in' }, 0);
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
    duration: 0.28,
    ease: 'power2.inOut'
  }, 0.04);

  // Fallback safety timeout in case GSAP timeline is suspended or interrupted
  setTimeout(navigate, 400);
}

/**
 * Handles reverse animation when returning from a project back to homepage or archive page
 */
function handlePageReturn() {
  const clearReturnCover = () => {
    document.documentElement.classList.remove('is-returning-from-project');
  };

  const hashFromUrl = window.location.hash ? window.location.hash.replace('#', '') : null;
  const returnHash = sessionStorage.getItem('amin_return_hash') || hashFromUrl;

  const isArchive = window.location.pathname.includes('/projects/all') || !!document.querySelector('.projects-archive-page');

  // If returning to a specific section (e.g. contact, services, skills, about)
  if (!isArchive && returnHash && returnHash !== 'projects') {
    sessionStorage.removeItem('amin_return_hash');
    sessionStorage.removeItem('amin_project_origin');
    sessionStorage.removeItem('amin_trigger_reverse_transition');
    clearReturnCover();
    scrollToHomeSection(returnHash);
    return;
  }

  const originStr = sessionStorage.getItem('amin_project_origin');
  if (!originStr) {
    clearReturnCover();
    if (!isArchive && returnHash === 'projects') {
      scrollToHomeSection('projects');
    }
    return;
  }

  try {
    if (returnHash) {
      sessionStorage.removeItem('amin_return_hash');
    }

    const isReturning = sessionStorage.getItem('amin_trigger_reverse_transition') === 'true';
    if (!isReturning) {
      clearReturnCover();
      if (!isArchive && returnHash === 'projects') {
        scrollToHomeSection('projects');
      }
      return;
    }
    sessionStorage.removeItem('amin_trigger_reverse_transition');

    let originData;
    try {
      originData = JSON.parse(originStr);
    } catch (e) {
      clearReturnCover();
      if (!isArchive) scrollToHomeSection('projects');
      return;
    }

    // Disable browser automatic scroll restoration to avoid jumping
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Restore scroll position immediately — if returning to projects, target the selected works section («پروژه‌های منتخب»)
    let targetScrollY = originData.scrollY;
    const cardEl = document.querySelector(`.work-grid-card[data-slug="${originData.slug || 'lumina'}"]`);
    const projectsSec = document.getElementById('projects');

    if (isArchive) {
      if (typeof targetScrollY === 'number' && targetScrollY > 0) {
        // use originData.scrollY
      } else if (cardEl) {
        targetScrollY = cardEl.getBoundingClientRect().top + window.scrollY - 140;
      } else {
        targetScrollY = 0;
      }
    } else if (returnHash === 'projects' || originData.source === 'works') {
      if (cardEl) {
        targetScrollY = cardEl.getBoundingClientRect().top + window.scrollY - 120;
      } else if (projectsSec) {
        targetScrollY = projectsSec.getBoundingClientRect().top + window.scrollY - 60;
      }
    } else if (typeof targetScrollY !== 'number' || targetScrollY <= 0) {
      if (cardEl) {
        targetScrollY = cardEl.getBoundingClientRect().top + window.scrollY - 140;
      } else if (projectsSec) {
        targetScrollY = projectsSec.getBoundingClientRect().top + window.scrollY - 60;
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
  const scrollTarget = () => {
    const targetEl = document.getElementById(sectionId);
    if (!targetEl) return false;
    if (window.lenis && typeof window.lenis.scrollTo === 'function') {
      window.lenis.scrollTo(targetEl, { offset: -60, duration: 1.1 });
    } else {
      const top = targetEl.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    return true;
  };

  let attempts = 0;
  const poll = () => {
    attempts++;
    if (scrollTarget()) {
      // Re-scroll once dynamic images, fonts, and hero scene settle
      setTimeout(scrollTarget, 300);
      setTimeout(scrollTarget, 750);
    } else if (attempts < 60) {
      setTimeout(poll, 50);
    }
  };
  setTimeout(poll, 70);
}
