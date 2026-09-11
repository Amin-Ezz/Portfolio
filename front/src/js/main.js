import '../css/main.css';
import '../css/liquid-glass.css';
import '../css/animations.css';
import '../css/skills.css';
import '../css/about.css';
import '../css/transition.css';
import '../css/cta-choice.css';

import { initCursor } from './cursor.js';
import { initHero3D } from './hero.js';
import { initTransitions } from './transitions.js';
import { initNavigation } from './navigation.js';
import { initScrollEngine } from './scroll.js';
import { initSkillsSection } from './skills.js';
import { initAboutSection } from './about.js';
import { runInitialLoader } from './loader.js';
import { initContactForm, checkBackendHealth } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Global Systems
  initCursor();
  initTransitions();
  initNavigation();
  const lenis = initScrollEngine();
  window.lenis = lenis;

  // Initialize Interactive Skills Section («مهارت‌ها»)
  initSkillsSection();

  // Initialize Editorial About Me Section («درباره من»)
  initAboutSection();

  // Initialize Interactive Contact Form connected to Django Backend
  initContactForm();

  // Non-blocking Backend connectivity check
  checkBackendHealth().then(health => {
    if (health) {
      console.log('[AMIN.EZ] Django Backend Connected:', health.status);
    }
  });

  // Initialize Hero if on Homepage
  const homepageHero = document.querySelector('body:not(.lumina-page) > main > .hero-section, main > .hero-section');
  if (homepageHero) {
    initHero3D();

    // Run hero entrance animation
    runInitialLoader(() => {});
  }
});
