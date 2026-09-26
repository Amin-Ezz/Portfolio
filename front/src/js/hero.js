import gsap from 'gsap';

export function initHero3D() {
  const heroSection = document.getElementById('hero');

  if (!heroSection) return null;

  const video = document.querySelector('.hero-wave-video');
  const allowMotion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Playback is gated rather than set via the autoplay attribute so that
  // reduced-motion users keep the static poster frame.
  const setOffscreen = (off) => {
    if (!video || !allowMotion) return;
    if (off) {
      if (!video.paused) video.pause();
    } else {
      video.play().catch(() => {});
    }
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setOffscreen(!entry.isIntersecting));
    }, { threshold: 0.05 });

    observer.observe(heroSection);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        setOffscreen(true);
        return;
      }
      const rect = heroSection.getBoundingClientRect();
      setOffscreen(rect.bottom <= 0 || rect.top >= window.innerHeight);
    });
  } else if (video && allowMotion) {
    video.play().catch(() => {});
  }

  if (!allowMotion) return;

  // Subtle mouse drift on fine pointers only. The clip is over-scaled so the
  // shift can never expose an edge; touch devices skip it entirely instead of
  // paying for listeners that can never fire.
  if (!window.matchMedia('(pointer: fine)').matches || !video) return;

  gsap.set(video, { scale: 1.05 });
  video.style.willChange = 'transform';

  const setX = gsap.quickTo(video, 'x', { duration: 2.4, ease: 'power2.out' });
  const setY = gsap.quickTo(video, 'y', { duration: 2.4, ease: 'power2.out' });

  // The hero box only moves on scroll or resize, so cache it rather than forcing
  // a layout read on every mouse move. Refreshes are rAF-gated so a burst of
  // scroll events can still only cost one measurement per frame.
  let rect = heroSection.getBoundingClientRect();
  let rectStale = false;
  const refreshRect = () => {
    if (rectStale) return;
    rectStale = true;
    requestAnimationFrame(() => {
      rect = heroSection.getBoundingClientRect();
      rectStale = false;
    });
  };
  window.addEventListener('resize', refreshRect);
  window.addEventListener('scroll', refreshRect, { passive: true });

  const onMouseMove = (e) => {
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;

    setX(-normX * 34);
    setY(-normY * 22);
  };

  heroSection.addEventListener('mousemove', onMouseMove, { passive: true });
}
