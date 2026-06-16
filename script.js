/**
 * FABULOUS FREIGHT — PREMIUM INTERACTIONS v3
 * Fixes all bugs. Section organic particles. Cobe globe.
 */

/* =============================================
   CUSTOM CURSOR
   ============================================= */
const cursorOuter = document.getElementById('cursor-outer');
const cursorInner = document.getElementById('cursor-inner');
let cursorX = 0, cursorY = 0, outerX = 0, outerY = 0;

if (cursorOuter && cursorInner && !window.matchMedia('(pointer: coarse)').matches) {
  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX; cursorY = e.clientY;
    cursorInner.style.left = cursorX + 'px';
    cursorInner.style.top  = cursorY + 'px';
  });
  (function animCursor() {
    outerX += (cursorX - outerX) * 0.12;
    outerY += (cursorY - outerY) * 0.12;
    cursorOuter.style.left = outerX + 'px';
    cursorOuter.style.top  = outerY + 'px';
    requestAnimationFrame(animCursor);
  })();
  document.querySelectorAll('a,button,.service-card,.gallery-item,.news-card,.value-pill').forEach(el => {
    el.addEventListener('mouseenter', () => cursorOuter.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursorOuter.classList.remove('cursor-hover'));
  });
}

/* =============================================
   NAVIGATION
   ============================================= */
const mainNav = document.getElementById('main-nav');
const burger  = document.getElementById('nav-burger');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

window.addEventListener('scroll', () => {
  mainNav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

burger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('is-open', menuOpen);
  burger.setAttribute('aria-expanded', menuOpen);
  mobileMenu.setAttribute('aria-hidden', !menuOpen);
  burger.children[0].style.transform = menuOpen ? 'translateY(6.5px) rotate(45deg)' : '';
  burger.children[1].style.opacity   = menuOpen ? '0' : '1';
  burger.children[2].style.transform = menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : '';
  document.body.style.overflow = menuOpen ? 'hidden' : '';
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menuOpen = false;
  mobileMenu.classList.remove('is-open');
  [0,1,2].forEach(i => { burger.children[i].style.cssText = ''; });
  document.body.style.overflow = '';
  burger.setAttribute('aria-expanded', false);
  mobileMenu.setAttribute('aria-hidden', true);
}));

/* Active nav link */
document.querySelectorAll('section[id]').forEach(sec => {
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.nav-link:not(.nav-cta)').forEach(l => l.classList.remove('is-active'));
      const a = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (a) a.classList.add('is-active');
    }
  }, { threshold: 0.35 }).observe(sec);
});

/* =============================================
   SCROLL REVEAL
   ============================================= */
new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-visible'); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })
.observe !== undefined &&
document.querySelectorAll('.reveal-up, .reveal-fade').forEach(el => {
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { el.classList.add('is-visible'); obs.unobserve(el); }
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  obs.observe(el);
});

/* =============================================
   HERO 2D PARTICLES
   ============================================= */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize, { passive: true });
  const particles = Array.from({ length: 55 }, () => {
    const p = {
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 5;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = -(Math.random() * 0.5 + 0.15);
        this.size = Math.random() * 2 + 0.5;
        this.alpha = 0;
        this.maxAlpha = Math.random() * 0.5 + 0.2;
        this.life = 0;
        this.maxLife = Math.random() * 0.5 + 0.5;
        this.color = Math.random() > 0.5 ? '200,121,10' : '242,177,85';
      }
    };
    p.reset();
    p.y = Math.random() * canvas.height;
    return p;
  });
  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.life += 0.003;
      if (p.life >= p.maxLife || p.y < 0) p.reset();
      const t = p.life / p.maxLife;
      const a = (t < 0.5 ? t * 2 : (1 - t) * 2) * p.maxAlpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  })();
})();

/* =============================================
   COUNTER ANIMATION
   ============================================= */
document.querySelectorAll('.stat-number').forEach(el => {
  const target = parseInt(el.dataset.target, 10);
  if (isNaN(target)) return;
  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    const start = performance.now();
    const dur = 1800;
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
      if (p < 1) requestAnimationFrame(tick);
    })(start);
    obs.unobserve(el);
  }, { threshold: 0.5 });
  obs.observe(el);
});

/* =============================================
   SECTION ORGANIC PARTICLE EFFECT
   Medusae-inspired — smaller radius, spring physics for liquid feel
   ============================================= */
function initSectionParticles(section) {
  const canvas = section.querySelector('.section-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const COLS = 42, ROWS = 20;
  let particles = [], W = 0, H = 0;
  let mouseX = -99999, mouseY = -99999;
  let animId = null, time = 0;
  let isVisible = false;

  function buildParticles() {
    W = canvas.width  = section.offsetWidth;
    H = canvas.height = section.offsetHeight;
    particles = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        particles.push({
          bx:    (c / (COLS - 1)) * W,
          by:    (r / (ROWS - 1)) * H,
          x: (c / (COLS - 1)) * W,
          y: (r / (ROWS - 1)) * H,
          vx: 0, vy: 0,          /* spring velocity */
          phase: Math.random() * Math.PI * 2,
          size:  0.9 + Math.random() * 1.1,
        });
      }
    }
  }

  buildParticles();
  new ResizeObserver(buildParticles).observe(section);

  section.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
  section.addEventListener('mouseleave', () => { mouseX = -99999; mouseY = -99999; });

  function draw() {
    if (!isVisible) { animId = requestAnimationFrame(draw); return; }
    ctx.clearRect(0, 0, W, H);
    time += 0.009;

    /* Halo ring parameters — smaller, tighter */
    const BREATH    = Math.sin(time * 0.6) * 0.08 + 1;
    const HALO_R    = Math.min(W, H) * 0.09 * BREATH;  /* 9% of min dim */
    const HALO_W    = HALO_R * 1.1;                     /* wide falloff = smoother */

    particles.forEach(p => {
      /* Slow organic drift */
      const driftX = Math.sin(time + p.phase) * 3.5;
      const driftY = Math.cos(time * 0.62 + p.phase) * 2.5;

      /* Mouse halo */
      const dx   = p.x - mouseX;
      const dy   = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;

      let rim = 0;
      if (dist < HALO_R + HALO_W) {
        rim = Math.max(0, 1 - Math.abs(dist - HALO_R) / HALO_W);
        /* smoothstep for liquid feel */
        rim = rim * rim * (3 - 2 * rim);
      }

      /* Spring target: base + drift + rim push */
      const pushX   = rim > 0 ? (dx / dist) * rim * 14 : 0;
      const pushY   = rim > 0 ? (dy / dist) * rim * 14 : 0;
      const targetX = p.bx + driftX + pushX;
      const targetY = p.by + driftY + pushY;

      /* Spring physics — high damping = slow, liquid motion */
      p.vx = p.vx * 0.90 + (targetX - p.x) * 0.045;
      p.vy = p.vy * 0.90 + (targetY - p.y) * 0.045;
      p.x += p.vx;
      p.y += p.vy;

      /* Inner soft glow zone */
      const innerGlow = Math.max(0, 1 - dist / (HALO_R * 0.45)) * 0.25;
      const influence = Math.min(1, rim + innerGlow);

      /* Size */
      const size  = p.size + influence * 3.2;

      /* Alpha */
      const baseA = 0.10 + Math.sin(time * 1.1 + p.phase) * 0.02;
      const alpha = baseA + influence * 0.72;

      /* Outer glow halo */
      if (influence > 0.1) {
        const gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 5.5);
        gr.addColorStop(0,   `rgba(200,121,10,${influence * 0.18})`);
        gr.addColorStop(0.5, `rgba(200,121,10,${influence * 0.06})`);
        gr.addColorStop(1,   'rgba(200,121,10,0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 5.5, 0, Math.PI * 2);
        ctx.fillStyle = gr;
        ctx.fill();
      }

      /* Core dot */
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      if (influence > 0.6) {
        ctx.fillStyle = `rgba(242,177,85,${alpha})`;
      } else if (influence > 0.2) {
        ctx.fillStyle = `rgba(200,121,10,${alpha})`;
      } else {
        ctx.fillStyle = `rgba(80,62,32,${baseA * 0.65})`;
      }
      ctx.fill();
    });

    animId = requestAnimationFrame(draw);
  }

  new IntersectionObserver(entries => {
    isVisible = entries[0].isIntersecting;
    if (isVisible && !animId) draw();
  }, { threshold: 0.05 }).observe(section);
}

document.querySelectorAll('#about, #services, #network').forEach(initSectionParticles);

/* =============================================
   SERVICE CARD 3D TILT (Antigravity-style)
   ============================================= */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transition = 'transform 0.1s ease, box-shadow 0.5s ease';
    card.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px) scale(1.01)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.5s ease';
    card.style.transform = '';
  });
});

/* =============================================
   COBE GLOBE
   ============================================= */

function initGlobe(createGlobe) {
  const canvas = document.getElementById('globe-canvas');
  if (!canvas) return;

  const container = document.getElementById('globe-container');
  const size = () => Math.min(container.offsetWidth, 720) * window.devicePixelRatio;

  let phi = 0.4;
  let currentSize = size();

  canvas.width  = currentSize;
  canvas.height = currentSize;

  const globe = createGlobe(canvas, {
    devicePixelRatio: window.devicePixelRatio,
    width:  currentSize,
    height: currentSize,
    phi:    0.4,
    theta:  0.2,
    dark:   1,
    diffuse: 1.8,
    mapSamples: 20000,
    mapBrightness: 5,
    baseColor:   [0.12, 0.08, 0.03],
    markerColor: [0.78, 0.47, 0.04],
    glowColor:   [0.72, 0.44, 0.03],
    scale: 1,
    opacity: 0.95,
    offset: [0, 0],
    markers: [
      { location: [28.63,  77.22], size: 0.08 }, { location: [22.57,  88.36], size: 0.05 },
      { location: [19.08,  72.88], size: 0.06 }, { location: [13.08,  80.27], size: 0.05 },
      { location: [25.20,  55.27], size: 0.07 }, { location: [24.68,  46.72], size: 0.04 },
      { location: [51.90,   4.48], size: 0.07 }, { location: [51.50,  -0.12], size: 0.07 },
      { location: [50.11,   8.68], size: 0.04 }, { location: [43.30,   5.37], size: 0.04 },
      { location: [31.23, 121.47], size: 0.08 }, { location: [22.32, 114.17], size: 0.06 },
      { location: [35.68, 139.69], size: 0.06 }, { location: [37.57, 126.98], size: 0.04 },
      { location: [ 1.29, 103.85], size: 0.07 }, { location: [13.75, 100.52], size: 0.04 },
      { location: [40.71,  -74.01],size: 0.07 }, { location: [34.05,-118.24], size: 0.06 },
      { location: [-23.55, -46.63],size: 0.05 }, { location: [-33.93,  18.42],size: 0.05 },
      { location: [30.06,   31.25],size: 0.05 }, { location: [-33.87, 151.21],size: 0.05 },
    ],
    onRender(state) {
      phi += 0.003;
      state.phi = phi;
    },
  });

  new ResizeObserver(() => {
    const s = size();
    canvas.width  = s;
    canvas.height = s;
  }).observe(container);

  /* Mouse drag to rotate */
  let dragging = false, lastX = 0;
  canvas.addEventListener('mousedown', e => { dragging = true; lastX = e.clientX; });
  window.addEventListener('mouseup', () => { dragging = false; });
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    phi += (e.clientX - lastX) * 0.008;
    lastX = e.clientX;
  });


  return globe;
}

if (window.__cobeLoaded && window.__createGlobe) {
  initGlobe(window.__createGlobe);
} else {
  document.addEventListener('cobe-ready', () => initGlobe(window.__createGlobe));
  setTimeout(() => {
    if (window.__createGlobe && !window.__globeStarted) {
      window.__globeStarted = true;
      initGlobe(window.__createGlobe);
    }
  }, 2000);
}

/* =============================================
   GALLERY STAGGERED REVEAL
   ============================================= */
document.querySelectorAll('.gallery-item').forEach((item, i) => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(30px)';
  item.style.transition = `opacity 0.7s ease ${i*0.08}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${i*0.08}s`;
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { item.style.opacity = '1'; item.style.transform = ''; }
  }, { threshold: 0.08 }).observe(item);
});

/* =============================================
   SERVICE CARD STAGGERED REVEAL
   ============================================= */
document.querySelectorAll('.service-card').forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = `opacity 0.7s ease ${i*0.1}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${i*0.1}s, box-shadow 0.5s ease`;
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { card.style.opacity = '1'; card.style.transform = ''; }
  }, { threshold: 0.05 }).observe(card);
});

/* =============================================
   SMOOTH SCROLL
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});

/* =============================================
   MARQUEE — pause on hover
   ============================================= */
const mc = document.querySelector('.marquee-content');
const ms = document.querySelector('.marquee-section');
if (mc && ms) {
  ms.addEventListener('mouseenter', () => mc.style.animationPlayState = 'paused');
  ms.addEventListener('mouseleave', () => mc.style.animationPlayState = 'running');
}

/* =============================================
   HERO PARALLAX
   ============================================= */
const heroBgImg = document.querySelector('.hero-bg-img');
const heroSection = document.getElementById('home');
if (heroBgImg && heroSection) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > heroSection.offsetHeight) return;
    heroBgImg.style.transform = `scale(1.05) translateY(${(window.scrollY / heroSection.offsetHeight) * 8}%)`;
  }, { passive: true });
}

/* =============================================
   FOOTER PARALLAX TEXT
   ============================================= */
const footerBigText = document.querySelector('.footer-big-text');
if (footerBigText) {
  window.addEventListener('scroll', () => {
    const rect = footerBigText.closest('.footer').getBoundingClientRect();
    const vis = Math.max(0, window.innerHeight - rect.top) / window.innerHeight;
    footerBigText.style.transform = `translateX(-50%) translateY(${(1 - vis) * 50}px)`;
    footerBigText.style.opacity = vis * 0.12;
  }, { passive: true });
}

/* =============================================
   QUOTE FORM
   ============================================= */
const form    = document.getElementById('quote-form');
const success = document.getElementById('form-success');
const submitBtn = document.getElementById('submit-quote');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach(f => {
      if (!f.value.trim()) { valid = false; f.style.borderColor = '#E05C5C'; f.addEventListener('input', () => f.style.borderColor = '', { once: true }); }
    });
    if (!valid) return;
    const btnText = submitBtn.querySelector('.btn-text');
    btnText.textContent = 'Sending…';
    submitBtn.disabled = true;
    setTimeout(() => {
      form.reset();
      if (success) success.classList.add('is-visible');
      btnText.textContent = 'Send Enquiry';
      submitBtn.disabled = false;
      setTimeout(() => success && success.classList.remove('is-visible'), 5000);
    }, 1400);
  });
}

/* =============================================
   FILM GRAIN
   ============================================= */
const grainStyle = document.createElement('style');
grainStyle.textContent = `
  body::after {
    content:''; position:fixed; inset:0; z-index:9998; pointer-events:none; opacity:0.02;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:128px 128px;
  }
`;
document.head.appendChild(grainStyle);

console.log('%c FABULOUS FREIGHT v3 ', 'background:#C8790A;color:#0C0A08;font-size:14px;font-weight:bold;padding:8px 16px;border-radius:4px;');
