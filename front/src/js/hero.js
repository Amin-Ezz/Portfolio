import gsap from 'gsap';

export function initHero3D() {
  const video = document.querySelector('.hero-video-bg');
  const heroSection = document.getElementById('hero');

  if (!video || !heroSection) return null;

  // 1. Performance: Pause video and ambient halo animations when scrolled out of view to save CPU/GPU
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          heroSection.classList.remove('is-hero-offscreen');
          if (video.paused) video.play().catch(() => {});
        } else {
          heroSection.classList.add('is-hero-offscreen');
          if (!video.paused) video.pause();
        }
      });
    }, { threshold: 0.05 });

    videoObserver.observe(heroSection);

    // Also pause if document is hidden (background tab)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        heroSection.classList.add('is-hero-offscreen');
        if (!video.paused) video.pause();
      } else {
        const rect = heroSection.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          heroSection.classList.remove('is-hero-offscreen');
          if (video.paused) video.play().catch(() => {});
        }
      }
    });
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  // 2. Mouse Parallax (only on devices with a mouse/fine pointer, not on touch screens)
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (!isFinePointer) {
    return {
      enableInteraction: () => {},
      setActiveProject: () => {},
      updateCardPositions: () => {},
      pauseAutoplay: () => {},
      resumeAutoplay: () => {},
      getActiveIndex: () => 0
    };
  }

  const setVideoX = gsap.quickTo(video, 'x', { duration: 1.4, ease: 'power2.out' });
  const setVideoY = gsap.quickTo(video, 'y', { duration: 1.4, ease: 'power2.out' });

  // Halos drift with mouse at different depths (CSS breathing lives on ::before)
  const halos = gsap.utils.toArray('.hero-halo');
  const haloXTo = halos.map((halo, i) => gsap.quickTo(halo, 'x', {
    duration: 1.8 + i * 0.5, ease: 'power2.out'
  }));
  const haloYTo = halos.map((halo, i) => gsap.quickTo(halo, 'y', {
    duration: 1.8 + i * 0.5, ease: 'power2.out'
  }));

  const onMouseMove = (e) => {
    const rect = heroSection.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    setVideoX(normX * -24);
    setVideoY(normY * -18);
    halos.forEach((_, i) => {
      const depth = (i + 1) * 28;
      haloXTo[i](-normX * depth);
      haloYTo[i](-normY * depth);
    });
  };

  heroSection.addEventListener('mousemove', onMouseMove, { passive: true });

  return {
    enableInteraction: () => {},
    setActiveProject: () => {},
    updateCardPositions: () => {},
    pauseAutoplay: () => {},
    resumeAutoplay: () => {},
    getActiveIndex: () => 0
  };
}
