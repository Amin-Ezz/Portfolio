import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Interactive Skills Section («مهارت‌ها»)
 * Cinematic black stage with a living particle canvas shared by the title
 * screen and the panels, vertical scroll transition, and video-style
 * one-by-one chip reveal.
 */
export function initSkillsSection() {
  const skillsSection = document.querySelector('#skills');
  if (!skillsSection) return;

  const panels = gsap.utils.toArray('.skills-panel');
  if (panels.length === 0) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ------------------------------------------------------------------------
  // Cinematic Entrance, Title Screen Transition, Sequential Pinned Showcase & Exit:
  // - Entrance: Scrolled from Featured Projects into «مهارت‌ها» title stage
  // - Title Screen transition: Title dissolves upward as universe arrives
  // - Sequential Showcase: Exactly ONE category is displayed at a time!
  // - Exit: Scrolled out of skills universe into «درباره من»
  // ------------------------------------------------------------------------
  if (!prefersReducedMotion) {
    initSkillsEntrance(skillsSection);
    initTitleScreenTransition(skillsSection);
    initSequentialSkillsShowcase(skillsSection);
    initSkillsExit(skillsSection);
  }

  // ------------------------------------------------------------------------
  // Helper: Micro-interactions on Skill Nodes (lift above the idle float)
  // ------------------------------------------------------------------------
  if (!prefersReducedMotion) {
    const allNodes = document.querySelectorAll('.skill-node');
    allNodes.forEach(node => {
      node.addEventListener('mouseenter', () => {
        gsap.to(node, {
          scale: 1.07,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });

      node.addEventListener('mouseleave', () => {
        gsap.to(node, {
          scale: 1,
          duration: 0.5,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      });
    });
  }

  // Free canvas resources when leaving the page (SPA-safety)
  window.addEventListener('pagehide', () => {
    if (cleanupCanvas) cleanupCanvas();
  });
}

/**
 * Cinematic entrance transition:
 * As the user scrolls down from Featured Projects towards «مهارت‌ها»,
 * the stage awakens: ambient glow expands, living canvas particles ignite,
 * and the editorial title "مهارت‌ها" rises from a soft blur with illuminated letter-spacing.
 */
function initSkillsEntrance(skillsSection) {
  const introStage = skillsSection.querySelector('.skills-intro-stage');
  if (!introStage) return;

  const title = introStage.querySelector('.skills-intro-title');
  const hint = introStage.querySelector('.skills-intro-hint');
  const tag = introStage.querySelector('.skills-intro-tag');
  const glow = introStage.querySelector('.skills-intro-glow');
  const entryPortal = skillsSection.querySelector('.skills-entry-portal');
  const bgCanvas = skillsSection.querySelector('.skills-bg-canvas');
  const orbs = skillsSection.querySelectorAll('.skills-bg-orb');

  // Initial atmospheric states
  if (title) {
    gsap.set(title, {
      y: 80,
      opacity: 0,
      scale: 0.86,
      filter: 'blur(16px)',
      letterSpacing: '0.06em'
    });
  }

  if (hint) {
    gsap.set(hint, {
      y: 35,
      opacity: 0,
      filter: 'blur(6px)'
    });
  }

  if (tag) {
    gsap.set(tag, {
      y: 24,
      opacity: 0,
      letterSpacing: '0.36em'
    });
  }

  if (glow) {
    gsap.set(glow, {
      scale: 0.55,
      opacity: 0
    });
  }

  // Scrubbed entrance as section scrolls from bottom of window into view
  const entranceTl = gsap.timeline({
    scrollTrigger: {
      trigger: skillsSection,
      start: 'top 95%',
      end: 'top 6%',
      scrub: 0.7
    }
  });

  if (title) {
    entranceTl.to(title, {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      letterSpacing: '-0.035em',
      ease: 'power2.out',
      duration: 1
    }, 0);
  }

  if (hint) {
    entranceTl.to(hint, {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      ease: 'power2.out',
      duration: 0.85
    }, 0.15);
  }

  if (tag) {
    entranceTl.to(tag, {
      y: 0,
      opacity: 0.45,
      letterSpacing: '0.22em',
      ease: 'power2.out',
      duration: 0.75
    }, 0.08);
  }

  if (glow) {
    entranceTl.to(glow, {
      scale: 1,
      opacity: 0.95,
      ease: 'power2.out',
      duration: 1
    }, 0.05);
  }

  if (bgCanvas) {
    entranceTl.fromTo(bgCanvas,
      { opacity: 0.2 },
      { opacity: 0.85, ease: 'none', duration: 1 },
      0
    );
  }

  if (orbs.length > 0) {
    entranceTl.fromTo(orbs,
      { scale: 0.75, opacity: 0.04 },
      { scale: 1, opacity: 0.16, ease: 'power1.out', duration: 1 },
      0
    );
  }

  if (entryPortal) {
    entranceTl.to(entryPortal, {
      opacity: 0,
      ease: 'power1.in',
      duration: 0.6
    }, 0.35);
  }
}

/**
 * Vertical scroll-scrubbed transition between the fullscreen title screen
 * and the skills panels: the title screen slides up and fades out while the
 * universe rises from below — a natural downward continuation of scrolling.
 * The shared living background stays put underneath the whole time.
 */
function initTitleScreenTransition(skillsSection) {
  const introStage = skillsSection.querySelector('.skills-intro-stage');
  const universe = skillsSection.querySelector('.skills-universe');
  if (!introStage || !universe) return;

  const title = introStage.querySelector('.skills-intro-title');
  const hint = introStage.querySelector('.skills-intro-hint');
  const tag = introStage.querySelector('.skills-intro-tag');
  const glow = introStage.querySelector('.skills-intro-glow');

  // The universe content starts slightly sunken and blurred; it rises into
  // place as the title screen exits.
  gsap.set(universe.querySelector('.skills-content'), { y: 90, opacity: 0 });

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: skillsSection,
      start: 'top top',          // title screen is fully in view
      end: 'top -100%',          // runs until the title screen has fully scrolled off
      scrub: 0.8
    }
  });

  const dissolveTargets = [title, hint, tag, glow].filter(Boolean);

  timeline
    // Title screen travels upward and fades as the user keeps scrolling
    .to(introStage, {
      yPercent: -42,
      opacity: 0,
      ease: 'power1.in',
      duration: 1
    }, 0)
    .to(dissolveTargets, {
      y: -120,
      filter: 'blur(8px)',
      ease: 'power1.in',
      duration: 0.85
    }, 0)
    // Skills content rises from below into view — vertical handoff
    .to(universe.querySelector('.skills-content'), {
      y: 0,
      opacity: 1,
      ease: 'power2.out',
      duration: 1
    }, 0.15);
}

/**
 * Sequential Pinned Category Showcase:
 * Pins the skills universe in the viewport while the user scrolls.
 * Only ONE category is displayed at a time:
 * - Starts with FRONTEND
 * - Scrolling sequentially transitions to BACKEND & APIS -> MOTION & 3D -> TOOLS & AI
 * - Simultaneously scrubs the futuristic multi-node progress rail (pure visual, zero text)
 */
function initSequentialSkillsShowcase(skillsSection) {
  const universe = skillsSection.querySelector('.skills-universe');
  const stage = skillsSection.querySelector('.skills-stage');
  const panels = gsap.utils.toArray('.skills-panel');
  const railFill = skillsSection.querySelector('.skills-progress-fill');
  const railNodes = skillsSection.querySelectorAll('.skills-rail-node');

  if (!universe || !stage || panels.length === 0) return;

  // Initialize panels: Panel 0 is visible, panels 1..3 are hidden
  panels.forEach((panel, idx) => {
    if (idx === 0) {
      gsap.set(panel, { opacity: 1, visibility: 'visible', y: 0, scale: 1, filter: 'blur(0px)' });
      panel.classList.add('active');
    } else {
      gsap.set(panel, { opacity: 0, visibility: 'hidden', y: 50, scale: 0.94, filter: 'blur(10px)' });
      panel.classList.remove('active');
    }

    // Set up continuous gentle floating loop on each panel's chips
    const nodes = panel.querySelectorAll('.skill-node');
    nodes.forEach((node, i) => {
      gsap.to(node, {
        y: i % 2 === 0 ? -6 : 6,
        x: i % 3 === 0 ? 4 : -4,
        duration: 2.8 + (i % 4) * 0.5,
        delay: i * 0.1,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });
    });

    // Watermark slow drift
    const watermark = panel.querySelector('.skills-panel-watermark');
    if (watermark) {
      gsap.to(watermark, {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: universe,
          start: 'top top',
          end: '+=320%',
          scrub: 1
        }
      });
    }
  });

  // Reveal chips on initial panel (Frontend)
  const initialNodes = panels[0].querySelectorAll('.skill-node');
  if (initialNodes.length > 0) {
    gsap.from(initialNodes, {
      y: 28,
      opacity: 0,
      scale: 0.7,
      stagger: 0.07,
      duration: 0.7,
      ease: 'back.out(2)',
      delay: 0.2
    });
  }

  // Mobile-aware scroll distance & horizontal progress rail handling
  const isMobileScreen = window.innerWidth <= 991;
  const pinDistance = isMobileScreen ? '+=200%' : '+=320%';

  // Master Pinning & Scrubbed Sequential Transitions
  const masterTl = gsap.timeline({
    scrollTrigger: {
      trigger: universe,
      pin: true,
      start: 'top top',
      end: pinDistance,
      scrub: 0.8,
      anticipatePin: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        let activeIdx = 0;
        if (progress >= 0.75) activeIdx = 3;
        else if (progress >= 0.46) activeIdx = 2;
        else if (progress >= 0.18) activeIdx = 1;
        else activeIdx = 0;

        railNodes.forEach((node, idx) => {
          if (idx === activeIdx) {
            node.classList.add('active');
          } else {
            node.classList.remove('active');
          }
        });
      }
    }
  });

  // Smoothly scrub the rail fill across the 4 categories
  if (railFill) {
    if (isMobileScreen) {
      masterTl.fromTo(railFill,
        { scaleX: 0.08, transformOrigin: '0% 50%' },
        { scaleX: 1, ease: 'none', duration: 3 },
        0
      );
    } else {
      masterTl.fromTo(railFill,
        { scaleY: 0.08, transformOrigin: '50% 0%' },
        { scaleY: 1, ease: 'none', duration: 3 },
        0
      );
    }
  }


  // --- Step 1 Transition: Panel 0 (FRONTEND) -> Panel 1 (BACKEND & APIS) ---
  masterTl
    .to(panels[0], {
      y: -60,
      opacity: 0,
      scale: 0.94,
      filter: 'blur(10px)',
      duration: 0.35,
      ease: 'power2.inOut',
      onComplete: () => {
        panels[0].classList.remove('active');
        gsap.set(panels[0], { visibility: 'hidden' });
      },
      onReverseComplete: () => {
        panels[0].classList.add('active');
        gsap.set(panels[0], { visibility: 'visible' });
      }
    }, 0.65)
    .set(panels[1], { visibility: 'visible' }, 0.82)
    .to(panels[1], {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.35,
      ease: 'power2.out',
      onStart: () => {
        panels[1].classList.add('active');
        const nodes1 = panels[1].querySelectorAll('.skill-node');
        gsap.fromTo(nodes1,
          { y: 22, opacity: 0, scale: 0.75 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.05, duration: 0.5, ease: 'back.out(2)', overwrite: 'auto' }
        );
      }
    }, 0.82);

  // --- Step 2 Transition: Panel 1 (BACKEND & APIS) -> Panel 2 (MOTION & 3D) ---
  masterTl
    .to(panels[1], {
      y: -60,
      opacity: 0,
      scale: 0.94,
      filter: 'blur(10px)',
      duration: 0.35,
      ease: 'power2.inOut',
      onComplete: () => {
        panels[1].classList.remove('active');
        gsap.set(panels[1], { visibility: 'hidden' });
      },
      onReverseComplete: () => {
        panels[1].classList.add('active');
        gsap.set(panels[1], { visibility: 'visible' });
      }
    }, 1.65)
    .set(panels[2], { visibility: 'visible' }, 1.82)
    .to(panels[2], {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.35,
      ease: 'power2.out',
      onStart: () => {
        panels[2].classList.add('active');
        const nodes2 = panels[2].querySelectorAll('.skill-node');
        gsap.fromTo(nodes2,
          { y: 22, opacity: 0, scale: 0.75 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.05, duration: 0.5, ease: 'back.out(2)', overwrite: 'auto' }
        );
      }
    }, 1.82);

  // --- Step 3 Transition: Panel 2 (MOTION & 3D) -> Panel 3 (TOOLS & AI) ---
  masterTl
    .to(panels[2], {
      y: -60,
      opacity: 0,
      scale: 0.94,
      filter: 'blur(10px)',
      duration: 0.35,
      ease: 'power2.inOut',
      onComplete: () => {
        panels[2].classList.remove('active');
        gsap.set(panels[2], { visibility: 'hidden' });
      },
      onReverseComplete: () => {
        panels[2].classList.add('active');
        gsap.set(panels[2], { visibility: 'visible' });
      }
    }, 2.65)
    .set(panels[3], { visibility: 'visible' }, 2.82)
    .to(panels[3], {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.35,
      ease: 'power2.out',
      onStart: () => {
        panels[3].classList.add('active');
        const nodes3 = panels[3].querySelectorAll('.skill-node');
        gsap.fromTo(nodes3,
          { y: 22, opacity: 0, scale: 0.75 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.05, duration: 0.5, ease: 'back.out(2)', overwrite: 'auto' }
        );
      }
    }, 2.82);
}

/**
 * Cinematic exit transition:
 * As the user finishes the skills panels and scrolls towards «درباره من»,
 * the skills stage lifts gently, scales down, blurs and dissolves away.
 * The progress rail collapses, the ambient cosmos softly recedes, and
 * the next section gracefully welcomes the viewer.
 */
function initSkillsExit(skillsSection) {
  const universe = skillsSection.querySelector('.skills-universe');
  const stage = skillsSection.querySelector('.skills-stage');
  const rail = skillsSection.querySelector('.skills-progress-rail');
  const bgCanvas = skillsSection.querySelector('.skills-bg-canvas');
  const orbs = skillsSection.querySelectorAll('.skills-bg-orb');
  const exitPortal = skillsSection.querySelector('.skills-exit-portal');
  const aboutSection = document.querySelector('#about');

  if (!universe || !stage) return;

  const exitTl = gsap.timeline({
    scrollTrigger: {
      trigger: universe,
      start: 'bottom 90%',
      endTrigger: skillsSection,
      end: 'bottom 5%',
      scrub: 0.8
    }
  });

  // Gracefully dissolve, scale down, blur, and lift the skills stage
  exitTl.to(stage, {
    y: -70,
    scale: 0.94,
    opacity: 0,
    filter: 'blur(14px)',
    ease: 'power2.in',
    duration: 1
  }, 0);

  // Collapse and fade the progress rail
  if (rail) {
    exitTl.to(rail, {
      scaleY: 0.15,
      opacity: 0,
      y: -45,
      ease: 'power2.in',
      duration: 0.75
    }, 0);
  }

  // Living canvas and ambient orbs dissolve smoothly
  if (bgCanvas) {
    exitTl.to(bgCanvas, {
      opacity: 0,
      scale: 1.1,
      ease: 'power1.in',
      duration: 0.9
    }, 0.1);
  }

  if (orbs.length > 0) {
    exitTl.to(orbs, {
      opacity: 0,
      scale: 1.18,
      ease: 'power1.in',
      duration: 0.9
    }, 0.1);
  }

  if (exitPortal) {
    exitTl.fromTo(exitPortal,
      { opacity: 0 },
      { opacity: 1, ease: 'power2.out', duration: 0.85 },
      0.1
    );
  }

  // Seamless handover into #about section
  if (aboutSection) {
    const aboutContainer = aboutSection.querySelector('.container-custom');
    if (aboutContainer) {
      gsap.from(aboutContainer, {
        y: 55,
        opacity: 0.25,
        filter: 'blur(8px)',
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: aboutSection,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    }
  }
}

/**
 * Particle constellation: floating dots linked by faint lines, gently
 * attracted toward the cursor — the living heartbeat of the black stage.
 * Returns a cleanup function.
 */
function initParticleCanvas(section) {
  const canvas = section.querySelector('.skills-bg-canvas');
  if (!canvas) return null;

  const ctx = canvas.getContext('2d');
  const state = { raf: 0, running: true };

  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];
  const mouse = { x: -9999, y: -9999, active: false };
  const LINK_DIST = 130;
  const MOUSE_RADIUS = 180;

  const resize = () => {
    const rect = section.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  };

  const seed = () => {
    const maxTarget = window.innerWidth <= 860 ? 30 : 90;
    const minTarget = window.innerWidth <= 860 ? 18 : 34;
    const target = Math.min(maxTarget, Math.max(minTarget, Math.floor((width * height) / 22000)));
    particles = Array.from({ length: target }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.6 + 0.7,
      tw: Math.random() * Math.PI * 2,
      twSpeed: Math.random() * 0.02 + 0.008
    }));
  };


  const onMove = (e) => {
    const rect = section.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  };

  const onLeave = () => {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  };

  const step = () => {
    if (!state.running) return;

    ctx.clearRect(0, 0, width, height);

    // Update + draw particles
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.tw += p.twSpeed;

      // Gentle cursor attraction — the interaction hook
      if (mouse.active) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_RADIUS && dist > 0.001) {
          const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * 0.018;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      // Damping keeps motion silky, never jittery
      p.vx *= 0.985;
      p.vy *= 0.985;

      // Wrap around edges
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      const alpha = 0.28 + Math.sin(p.tw) * 0.16;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(235, 235, 245, ${Math.max(0.06, alpha)})`;
      ctx.fill();
    }

    // Constellation links
    ctx.lineWidth = 0.6;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK_DIST * LINK_DIST) {
          const t = 1 - Math.sqrt(d2) / LINK_DIST;
          ctx.strokeStyle = `rgba(255, 255, 255, ${t * 0.1})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    state.raf = requestAnimationFrame(step);
  };

  resize();
  step();

  window.addEventListener('resize', resize);
  section.addEventListener('mousemove', onMove);
  section.addEventListener('mouseleave', onLeave);

  // Pause the loop when the section is far off-screen — saves battery/CPU
  const visibilityTrigger = ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => {
      if (self.isActive && !state.running) {
        state.running = true;
        step();
      } else if (!self.isActive && state.running) {
        state.running = false;
        cancelAnimationFrame(state.raf);
      }
    }
  });

  return () => {
    state.running = false;
    cancelAnimationFrame(state.raf);
    visibilityTrigger.kill();
    window.removeEventListener('resize', resize);
    section.removeEventListener('mousemove', onMove);
    section.removeEventListener('mouseleave', onLeave);
  };
}
