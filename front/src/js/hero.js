import gsap from 'gsap';

export function initHero3D() {
  // 3D project stack was removed — hero is now a centered copy block
  // over a black & white video background with gray/white ambient halos.

  const video = document.querySelector('.hero-video-bg');
  const heroSection = document.getElementById('hero');

  if (!video || !heroSection) return null;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

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
