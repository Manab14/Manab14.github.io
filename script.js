/* ============================================
   MANAB KHANRA — PORTFOLIO JS
   ============================================ */

'use strict';

/* ---- PARTICLE CANVAS BACKGROUND ---- */
(function () {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: null, y: null };
  const N = 80;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  function rand(a, b) { return Math.random() * (b - a) + a; }

  function createParticle() {
    return {
      x: rand(0, W), y: rand(0, H),
      r: rand(1, 3), vx: rand(-0.4, 0.4), vy: rand(-0.4, 0.4),
      alpha: rand(0.3, 0.8), color: Math.random() > 0.5 ? '108,99,255' : '167,139,250'
    };
  }

  function initParticles() { particles = []; for (let i = 0; i < N; i++) particles.push(createParticle()); }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      if (mouse.x !== null) {
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) { p.x -= dx * 0.02; p.y -= dy * 0.02; }
      }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`; ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j], dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(108,99,255,${0.12 * (1 - dist / 100)})`; ctx.lineWidth = 0.6; ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); initParticles(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
  resize(); initParticles(); draw();
})();

/* ---- TYPING ANIMATION ---- */
(function () {
  const roles = [
    'Data Analyst',
    'Data Scientist',
    'Machine Learning Enthusiast',
    'Python Developer',
    'Power BI Developer'
  ];
  const el = document.getElementById('typingText');
  let roleIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = roles[roleIdx];
    if (deleting) { el.textContent = current.substring(0, charIdx - 1); charIdx--; }
    else { el.textContent = current.substring(0, charIdx + 1); charIdx++; }
    let delay = deleting ? 60 : 110;
    if (!deleting && charIdx === current.length) { delay = 1800; deleting = true; }
    else if (deleting && charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; delay = 400; }
    setTimeout(type, delay);
  }
  setTimeout(type, 600);
})();

/* ---- NAVBAR SCROLL & ACTIVE SECTION ---- */
(function () {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    let current = '';
    sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 120) current = sec.id; });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
    document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  document.getElementById('backToTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
})();

/* ---- HAMBURGER MENU ---- */
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => { hamburger.classList.remove('open'); mobileMenu.classList.remove('open'); });
  });
})();

/* ---- DARK / LIGHT THEME ---- */
(function () {
  const toggle = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const html = document.documentElement;
  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);
  icon.className = saved === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  toggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    icon.className = next === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    localStorage.setItem('theme', next);
  });
})();

/* ---- SCROLL REVEAL ---- */
(function () {
  const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => observer.observe(el));
})();

/* ---- STAT COUNTERS ---- */
(function () {
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.dataset.target;
        let current = 0;
        const step = target / 50;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { el.textContent = target; clearInterval(timer); }
          else { el.textContent = Math.floor(current); }
        }, 30);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => observer.observe(el));
})();



/* ---- SKILL CATEGORY FILTER ---- */
(function () {
  const catBtns = document.querySelectorAll('.skill-cat');
  const badges = document.querySelectorAll('.skill-badge');
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      badges.forEach(badge => {
        if (cat === 'all' || badge.dataset.cat === cat) { badge.classList.remove('hide'); }
        else { badge.classList.add('hide'); }
      });
    });
  });
})();

/* ---- CONTACT FORM ---- */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    btn.disabled = false;
    success.style.display = 'block';
    e.target.reset();
    setTimeout(() => { success.style.display = 'none'; }, 5000);
  }, 1400);
}

/* ---- CURSOR GLOW TRAIL (desktop only) ---- */
(function () {
  if (window.innerWidth < 768) return;
  const trail = [];
  const TRAIL_LEN = 8;
  for (let i = 0; i < TRAIL_LEN; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `position:fixed;width:${6+i*1.5}px;height:${6+i*1.5}px;border-radius:50%;background:rgba(108,99,255,${0.5-i*0.05});pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:left ${0.05+i*0.03}s ease,top ${0.05+i*0.03}s ease;mix-blend-mode:screen;`;
    document.body.appendChild(dot);
    trail.push(dot);
  }
  window.addEventListener('mousemove', e => { trail.forEach(dot => { dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px'; }); });
})();

/* ---- CARD 3D TILT ---- */
(function () {
  const cards = document.querySelectorAll('.project-card, .cert-card, .edu-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `perspective(800px) rotateX(${-(y/rect.height)*8}deg) rotateY(${(x/rect.width)*8}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; card.style.transition = 'transform 0.5s ease'; });
    card.addEventListener('mouseenter', () => { card.style.transition = 'transform 0.1s ease'; });
  });
})();

/* ---- PAGE LOAD HERO ANIMATION ---- */
(function () {
  document.querySelectorAll('.hero-content > *').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.7s ease ${0.1 + i * 0.12}s, transform 0.7s ease ${0.1 + i * 0.12}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'none'; }));
  });
})();