// Menu mobilne
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });
}

// Nieskończona karuzela "Poznaj drużynę" — zestaw kart jest zduplikowany
// i przewijany w pętli (transform), więc nigdy się nie kończy. Strzałki
// dosuwają o jedną kartę, a między kliknięciami karuzela jedzie sama.
document.querySelectorAll('.team-carousel').forEach((carousel) => {
  const track = carousel.querySelector('.team-carousel-track');
  const prev = carousel.querySelector('.carousel-arrow-left');
  const next = carousel.querySelector('.carousel-arrow-right');
  if (!track) return;

  const originalCards = Array.from(track.children);
  if (!originalCards.length) return;

  // Duplikujemy karty raz, żeby po przewinięciu jednego kompletu
  // płynnie "wjeżdżał" identyczny drugi — pętla staje się niewidoczna.
  originalCards.forEach((card) => track.appendChild(card.cloneNode(true)));

  const getSingleSetWidth = () => {
    let width = 0;
    for (let i = 0; i < originalCards.length; i++) {
      width += track.children[i].getBoundingClientRect().width;
    }
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '0');
    return width + gap * originalCards.length;
  };

  let position = 0;
  let singleSetWidth = getSingleSetWidth();
  let autoplay = true;
  let tween = null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const speed = 28; // px/s

  const apply = () => { track.style.transform = `translateX(${-position}px)`; };

  const wrap = () => {
    if (singleSetWidth <= 0) return;
    position = ((position % singleSetWidth) + singleSetWidth) % singleSetWidth;
  };

  // Podczas samego tweenu NIE zawijamy pozycji — tor ma dwa identyczne
  // komplety kart (0..W i W..2W), więc dowolna wartość w tym zakresie
  // jest poprawna wizualnie. Zawijamy dopiero po zakończeniu ruchu,
  // żeby liczba position nie rosła/malała bez końca.
  const stepTo = (target, duration = 380) => {
    autoplay = false;
    if (tween) cancelAnimationFrame(tween);
    const start = position;
    const delta = target - start;
    const startTime = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const frame = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      position = start + delta * ease(t);
      apply();
      if (t < 1) {
        tween = requestAnimationFrame(frame);
      } else {
        wrap();
        apply();
        autoplay = true;
      }
    };
    tween = requestAnimationFrame(frame);
  };

  const getCardStep = () => track.children[0].getBoundingClientRect().width
    + parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '0');

  if (next) {
    next.addEventListener('click', () => {
      singleSetWidth = getSingleSetWidth();
      stepTo(position + getCardStep());
    });
  }
  if (prev) {
    prev.addEventListener('click', () => {
      singleSetWidth = getSingleSetWidth();
      const cardStep = getCardStep();
      let target = position - cardStep;
      if (target < 0) {
        // Przeskocz niewidocznie do identycznego miejsca w drugim komplecie,
        // żeby ruch "wstecz" nigdy nie odsłonił pustego miejsca przed torem.
        position += singleSetWidth;
        target += singleSetWidth;
        apply();
      }
      stepTo(target);
    });
  }

  carousel.addEventListener('mouseenter', () => { autoplay = false; });
  carousel.addEventListener('mouseleave', () => { autoplay = true; });

  window.addEventListener('resize', () => { singleSetWidth = getSingleSetWidth(); });

  if (!prefersReducedMotion) {
    let lastTime = performance.now();
    const loop = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      if (autoplay) {
        position += speed * dt;
        wrap();
        apply();
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
});

// Automatyczny rok w stopce
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Animacja odsłaniania elementów (statystyki, linia czasu) przy przewijaniu
// Klasa js-reveal włącza CSS-owe ukrywanie/animację tylko wtedy, gdy JS faktycznie działa
const revealItems = document.querySelectorAll('.reveal-item');
if (revealItems.length && 'IntersectionObserver' in window) {
  document.body.classList.add('js-reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));
}

// Animowane liczniki (np. 1947, 79 lat) — odliczają w górę, gdy wejdą w widok
const counters = document.querySelectorAll('.counter');
if (counters.length) {
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const isYear = el.dataset.format === 'year';
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = isYear ? current : current;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach((el) => counterObserver.observe(el));
}
