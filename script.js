const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealElements = document.querySelectorAll('.reveal');

const scrollExpandFrames = [...document.querySelectorAll('[data-scroll-expand]')];

if (scrollExpandFrames.length > 0) {
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const smoothstep = (value) => value * value * (3 - 2 * value);

  const applyExpandProgress = (frame, progress) => {
    const easedProgress = smoothstep(progress);
    const width = 42 + (100 - 42) * easedProgress;
    const height = 58 + (100 - 58) * easedProgress;
    const insetX = Math.max(0, (100 - width) / 2);
    const insetY = Math.max(0, (100 - height) / 2);
    const radius = 24 * (1 - easedProgress);
    const media = frame.querySelector('img');

    frame.style.clipPath = `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`;

    if (media) {
      media.style.transform = `scale(${1.35 + (1 - 1.35) * easedProgress})`;
    }
  };

  if (reducedMotion) {
    scrollExpandFrames.forEach((frame) => applyExpandProgress(frame, 1));
  } else {
    let frameRequest = 0;
    let currentProgress = scrollExpandFrames.map(() => 0);
    let targetProgress = [...currentProgress];

    const readProgress = () => {
      const viewportHeight = window.innerHeight;

      targetProgress = scrollExpandFrames.map((frame) => {
        const bounds = frame.getBoundingClientRect();
        const animationStart = viewportHeight * 1.15;
        const animationEnd = viewportHeight * 0.45;
        return clamp(
          (animationStart - bounds.top) / (animationStart - animationEnd),
          0,
          1
        );
      });
    };

    const animateProgress = () => {
      let isAnimating = false;

      scrollExpandFrames.forEach((frame, index) => {
        currentProgress[index] += (targetProgress[index] - currentProgress[index]) * 0.12;

        if (Math.abs(targetProgress[index] - currentProgress[index]) < 0.001) {
          currentProgress[index] = targetProgress[index];
        } else {
          isAnimating = true;
        }

        applyExpandProgress(frame, currentProgress[index]);
      });

      frameRequest = isAnimating ? requestAnimationFrame(animateProgress) : 0;
    };

    const updateExpandProgress = () => {
      readProgress();

      if (!frameRequest) {
        frameRequest = requestAnimationFrame(animateProgress);
      }
    };

    scrollExpandFrames.forEach((frame) => {
      frame.querySelector('img')?.addEventListener('load', updateExpandProgress);
    });

    window.addEventListener('scroll', updateExpandProgress, { passive: true });
    window.addEventListener('resize', updateExpandProgress);
    updateExpandProgress();
  }
}

const motionModule = reducedMotion
  ? Promise.resolve(null)
  : import('https://cdn.jsdelivr.net/npm/motion@12/+esm').catch(() => null);

const heroVideo = document.querySelector('#hero-video');
const heroVideoToggle = document.querySelector('#hero-video-toggle');
const heroVideoToggleLabel = heroVideoToggle?.querySelector('.hero-video-toggle-label');
const heroVideoToggleIcon = heroVideoToggle?.querySelector('[aria-hidden="true"]');

if (heroVideo instanceof HTMLVideoElement && heroVideoToggle instanceof HTMLButtonElement) {
  const updateHeroVideoToggle = () => {
    const isPlaying = !heroVideo.paused;
    const action = isPlaying ? 'Pausar' : 'Reproducir';
    heroVideoToggle.setAttribute('aria-label', `${action} video de fondo`);
    heroVideoToggle.title = `${action} video`;

    if (heroVideoToggleLabel) {
      heroVideoToggleLabel.textContent = `${action} video`;
    }

    if (heroVideoToggleIcon) {
      heroVideoToggleIcon.textContent = isPlaying ? 'Ⅱ' : '▶';
    }
  };

  heroVideo.addEventListener('canplay', () => {
    heroVideoToggle.hidden = false;

    heroVideo.play().catch(() => {});
  });

  heroVideo.addEventListener('play', () => {
    heroVideo.closest('.hero-video')?.classList.add('is-playing');
    updateHeroVideoToggle();
  });

  heroVideo.addEventListener('pause', () => {
    heroVideo.closest('.hero-video')?.classList.remove('is-playing');
    updateHeroVideoToggle();
  });

  heroVideo.addEventListener('error', () => {
    heroVideoToggle.hidden = true;
  });

  heroVideoToggle.addEventListener('click', () => {
    if (heroVideo.paused) {
      heroVideo.play().catch(() => {});
    } else {
      heroVideo.pause();
    }
  });

  updateHeroVideoToggle();
  heroVideo.play().catch(() => {});
}

const particleCanvas = document.querySelector('#ambient-particles');

if (!reducedMotion && particleCanvas instanceof HTMLElement) {
  Promise.all([
    import('https://cdn.jsdelivr.net/npm/@tsparticles/engine@4/+esm'),
    import('https://cdn.jsdelivr.net/npm/@tsparticles/slim@4/+esm')
  ])
    .then(async ([{ tsParticles }, { loadSlim }]) => {
      await loadSlim(tsParticles);
      await tsParticles.load({
        id: 'ambient-particles',
        options: {
          fullScreen: { enable: false },
          fpsLimit: 30,
          pauseOnBlur: true,
          pauseOnOutsideViewport: true,
          detectRetina: true,
          particles: {
            number: { value: window.innerWidth < 760 ? 17 : 30 },
            color: { value: ['#4F46E5', '#3B82F6', '#F59E0B'] },
            opacity: { value: { min: 0.1, max: 0.28 } },
            size: { value: { min: 1, max: 2.5 } },
            links: {
              enable: true,
              distance: 155,
              color: '#3B82F6',
              opacity: 0.12,
              width: 1
            },
            move: {
              enable: true,
              direction: 'none',
              speed: { min: 0.15, max: 0.35 },
              random: true,
              straight: false,
              outModes: { default: 'out' }
            }
          },
          interactivity: {
            events: { onHover: { enable: true, mode: 'grab' } },
            modes: { grab: { distance: 140, links: { opacity: 0.18 } } }
          }
        }
      });
    })
    .catch(() => {});
}

const revealObserver = new IntersectionObserver(
  async (entries, observer) => {
    const motion = await motionModule;

    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      if (motion?.animate && !reducedMotion) {
        motion.animate(
          entry.target,
          { opacity: [0, 1], y: [22, 0] },
          { duration: 0.55, ease: 'easeOut' }
        );
      }

      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.16, rootMargin: '0px 0px -48px 0px' }
);

revealElements.forEach((element) => revealObserver.observe(element));

document.querySelectorAll('[data-open-feature]').forEach((button) => {
  const dialogId = button.getAttribute('data-open-feature');
  const dialog = dialogId ? document.getElementById(dialogId) : null;

  if (!(dialog instanceof HTMLDialogElement)) {
    return;
  }

  button.addEventListener('click', () => dialog.showModal());

  dialog.querySelectorAll('[data-close-feature]').forEach((closeButton) => {
    closeButton.addEventListener('click', () => dialog.close());
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
});

if (!reducedMotion) {
  import('https://cdn.jsdelivr.net/npm/lenis@1/+esm')
    .then(({ default: Lenis }) => {
      new Lenis({ autoRaf: true, duration: 1.05 });
    })
    .catch(() => {});
}

const carousel = document.querySelector('#solutions-carousel');
const carouselSlides = carousel?.querySelectorAll('.module-card') ?? [];
const carouselButtons = document.querySelectorAll('[data-carousel-direction]');
let activeCarouselIndex = 0;

function updateCarouselPosition() {
  if (!(carousel instanceof HTMLElement) || carouselSlides.length === 0) {
    return;
  }

  const carouselLeft = carousel.getBoundingClientRect().left;
  let closestDistance = Number.POSITIVE_INFINITY;

  carouselSlides.forEach((slide, index) => {
    const distance = Math.abs(slide.getBoundingClientRect().left - carouselLeft);

    if (distance < closestDistance) {
      closestDistance = distance;
      activeCarouselIndex = index;
    }
  });

  carouselButtons.forEach((button) => {
    button.disabled = carouselSlides.length < 2;
  });

  carouselSlides.forEach((slide, index) => {
    const isActive = index === activeCarouselIndex;
    slide.toggleAttribute('inert', !isActive);
    slide.setAttribute('aria-hidden', String(!isActive));
  });
}

if (carousel instanceof HTMLElement && carouselSlides.length > 0) {
  let scrollFrame = 0;
  carousel.addEventListener('scroll', () => {
    if (scrollFrame) {
      cancelAnimationFrame(scrollFrame);
    }

    scrollFrame = requestAnimationFrame(updateCarouselPosition);
  }, { passive: true });

  carouselButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const direction = Number(button.getAttribute('data-carousel-direction'));
      const nextIndex = (activeCarouselIndex + direction + carouselSlides.length) % carouselSlides.length;
      const isWrapping = direction < 0
        ? activeCarouselIndex === 0
        : activeCarouselIndex === carouselSlides.length - 1;

      const carouselLeft = carousel.getBoundingClientRect().left;
      const slideLeft = carouselSlides[nextIndex].getBoundingClientRect().left;
      carousel.scrollTo({
        left: carousel.scrollLeft + slideLeft - carouselLeft,
        behavior: reducedMotion || isWrapping ? 'auto' : 'smooth'
      });
    });
  });

  updateCarouselPosition();
}

const moduleSuggestions = document.querySelector('#module-suggestions');
const simulatorWhatsApp = document.querySelector('#simulator-whatsapp');
const organizationInputs = document.querySelectorAll('input[name="organization"]');
const teamSizeInput = document.querySelector('#team-size');

const organizationNames = {
  educativa: 'Fluxion EDU',
  industrial: 'Fluxion Industrial',
  logistic: 'Fluxion Logistic',
  sport: 'Fluxion Sport'
};

const suggestedModules = {
  educativa: ['Fluxion Edu Core', 'App Familias y Asistencia', 'Asistente IA Curricular'],
  industrial: ['Fluxion Industrial', 'Gestión de producción y ERP', 'Control operativo'],
  logistic: ['Fluxion Logistic', 'Seguimiento de entregas', 'Gestión de recursos y sedes'],
  sport: ['Fluxion Sport', 'App de socios y turnos', 'Credencial QR y accesos']
};

function updateSimulatorSelection() {
  const organization = document.querySelector('input[name="organization"]:checked')?.value ?? 'educativa';
  const teamSize = Number(teamSizeInput?.value);

  if (moduleSuggestions) {
    moduleSuggestions.replaceChildren(
      ...suggestedModules[organization].map((name) => {
        const item = document.createElement('span');
        item.textContent = name;
        return item;
      })
    );
  }

  if (simulatorWhatsApp instanceof HTMLAnchorElement) {
    const isValidTeamSize = Number.isSafeInteger(teamSize) && teamSize >= 1;
    simulatorWhatsApp.setAttribute('aria-disabled', String(!isValidTeamSize));

    if (isValidTeamSize) {
      const message = `Hola, quisiera recibir información sobre ${organizationNames[organization]} para una organización con ${teamSize} usuarios.`;
      simulatorWhatsApp.href = `https://wa.me/5491130464848?text=${encodeURIComponent(message)}`;
    } else {
      simulatorWhatsApp.removeAttribute('href');
    }
  }
}

organizationInputs.forEach((input) => input.addEventListener('change', updateSimulatorSelection));

if (teamSizeInput instanceof HTMLInputElement) {
  teamSizeInput.addEventListener('input', updateSimulatorSelection);
}

if (simulatorWhatsApp instanceof HTMLAnchorElement) {
  simulatorWhatsApp.addEventListener('click', (event) => {
    if (simulatorWhatsApp.getAttribute('aria-disabled') === 'true') {
      event.preventDefault();
    }
  });
}

updateSimulatorSelection();

const organizationTypeSelect = document.querySelector('#tipo-organizacion');

document.querySelectorAll('[data-select-custom-development]').forEach((link) => {
  link.addEventListener('click', () => {
    if (organizationTypeSelect instanceof HTMLSelectElement) {
      organizationTypeSelect.value = 'desarrollo-a-medida';
      organizationTypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
});

const demoForm = document.querySelector('.demo-form');

if (demoForm) {
  demoForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const button = demoForm.querySelector('button[type="submit"]');
    const status = demoForm.querySelector('.form-status');

    if (!(button instanceof HTMLButtonElement) || !(status instanceof HTMLElement)) {
      return;
    }

    const originalText = button.textContent;

    button.disabled = true;
    button.textContent = 'Enviando…';
    status.textContent = '';
    status.classList.remove('is-success', 'is-error');

    try {
      const response = await fetch(demoForm.action, {
        method: 'POST',
        body: new FormData(demoForm),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        throw new Error('No se pudo enviar la solicitud');
      }

      demoForm.reset();
      status.textContent = 'Listo, recibimos tu solicitud. El equipo se va a poner en contacto.';
      status.classList.add('is-success');
      button.textContent = 'Solicitud enviada';
    } catch {
      status.textContent = 'No pudimos enviar la solicitud. Probá de nuevo o escribinos por WhatsApp.';
      status.classList.add('is-error');
      button.disabled = false;
      button.textContent = originalText;
      return;
    }

    window.setTimeout(() => {
      button.disabled = false;
      button.textContent = originalText;
    }, 4000);
  });
}
