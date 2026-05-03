  // ─── DUPLICATE SCROLL TRACKS FOR SEAMLESS LOOP ───
  ['servicesTrack', 'aiTrack', 'testimonialsTrack'].forEach(id => {
    const track = document.getElementById(id);
    if (!track) return;
    track.innerHTML += track.innerHTML;
  });

  // ─── HAMBURGER ───
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ─── MOUSE ORB ───
  const mouseOrb = document.getElementById('mouseOrb');
  let mx = window.innerWidth/2, my = window.innerHeight/2;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    mouseOrb.style.left = mx + 'px'; mouseOrb.style.top = my + 'px';
  });

  // ─── PARTICLE CANVAS ───
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });

  const PARTICLE_COUNT = window.innerWidth < 768 ? 30 : 80;
  const particles = Array.from({length: PARTICLE_COUNT}, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random()-0.5)*0.4, vy: (Math.random()-0.5)*0.4,
    r: Math.random()*1.8+0.4,
    opacity: Math.random()*0.5+0.1,
    color: Math.random() > 0.7 ? '232,25,44' : '255,255,255'
  }));

  function drawParticles() {
    ctx.clearRect(0,0,W,H);
    particles.forEach(p => {
      // mouse attraction
      const dx = mx - p.x, dy = my - p.y;
      const dist = Math.sqrt(dx*dx+dy*dy);
      if (dist < 180) { p.vx += dx/dist*0.02; p.vy += dy/dist*0.02; }
      p.vx *= 0.99; p.vy *= 0.99;
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
      ctx.fill();
    });
    // draw connections
    for (let i=0;i<particles.length;i++) {
      for (let j=i+1;j<particles.length;j++) {
        const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if (d<100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x,particles[i].y);
          ctx.lineTo(particles[j].x,particles[j].y);
          ctx.strokeStyle=`rgba(168,180,192,${0.12*(1-d/100)})`;
          ctx.lineWidth=0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }
  drawParticles();

  // ─── SCROLL PROGRESS ───
  const progressBar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    progressBar.style.width = pct + '%';
  });

  // ─── 3D CARD TILT ───
  function applyTilt(cards) {
    cards.forEach(card => {
      card.classList.add('neon-card');
      const shine = document.createElement('div');
      shine.className = 'shine';
      card.appendChild(shine);
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        const cx = r.width/2, cy = r.height/2;
        const rotX = (y-cy)/cy * -10;
        const rotY = (x-cx)/cx * 10;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
        const pctX = (x/r.width)*100, pctY = (y/r.height)*100;
        shine.style.setProperty('--mx', pctX+'%');
        shine.style.setProperty('--my', pctY+'%');
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
      });
    });
  }
  applyTilt(document.querySelectorAll('.service-card,.ai-card,.pricing-card,.testimonial-card,.how-step'));

  // ─── MAGNETIC BUTTONS ───
  document.querySelectorAll('.btn-primary,.btn-secondary,.nav-cta').forEach(btn => {
    btn.classList.add('magnetic');
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width/2);
      const dy = e.clientY - (r.top + r.height/2);
      btn.style.transform = `translate(${dx*0.25}px,${dy*0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  // ─── RIPPLE BUTTONS ───
  document.querySelectorAll('.btn-primary,.btn-pricing-solid,.form-submit,.fab-item').forEach(btn => {
    btn.classList.add('ripple-btn');
    btn.addEventListener('click', e => {
      const r = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2;
      const x = e.clientX - r.left - size/2;
      const y = e.clientY - r.top - size/2;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // glitch removed

  // ─── HERO TYPEWRITER ───
  const heroDesc = document.querySelector('.hero-desc');
  if (heroDesc) {
    const original = heroDesc.textContent.trim();
    heroDesc.textContent = '';
    let i = 0;
    const type = () => { if (i < original.length) { heroDesc.textContent += original[i++]; setTimeout(type, 18); } };
    setTimeout(type, 900);
  }

  // ─── FAB TOGGLE ───
  const fabBtn = document.getElementById('fabBtn');
  const fabMenu = document.getElementById('fabMenu');
  let fabOpen = false;
  fabBtn.addEventListener('click', () => {
    fabOpen = !fabOpen;
    fabMenu.classList.toggle('open', fabOpen);
    fabBtn.textContent = fabOpen ? '✕' : '🚀';
  });
  document.addEventListener('click', e => {
    if (!document.getElementById('fab').contains(e.target) && fabOpen) {
      fabOpen = false; fabMenu.classList.remove('open'); fabBtn.textContent = '🚀';
    }
  });

  // ─── FLOATING SHAPES GENERATOR ───
  const hero = document.querySelector('.hero');
  const shapeCount = 12;
  for (let i = 0; i < shapeCount; i++) {
    const s = document.createElement('div');
    const size = 20 + Math.random()*60;
    s.className = 'shape' + (Math.random()>0.5?' shape-hex':'');
    s.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;top:${80+Math.random()*40}%;animation-duration:${8+Math.random()*16}s;animation-delay:-${Math.random()*20}s;opacity:${0.05+Math.random()*0.15}`;
    hero.appendChild(s);
  }

  // ─── SERVICE CARDS GLOW BORDER on hover ───
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('glow-border'));
    card.addEventListener('mouseleave', () => card.classList.remove('glow-border'));
  });

  // ─── STAGGER REVEAL OBSERVER ───
  const allReveals = document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale,.stagger');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
          entry.target.querySelectorAll('.metric-bar').forEach(bar => { bar.style.width = bar.dataset.width + '%'; });
        }, 0);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  allReveals.forEach(el => revealObs.observe(el));

  // ─── MARQUEE PAUSE ON HOVER ───
  const marqueeEl = document.getElementById('marquee');
  if (marqueeEl) {
    marqueeEl.addEventListener('mouseenter', () => marqueeEl.style.animationPlayState = 'paused');
    marqueeEl.addEventListener('mouseleave', () => marqueeEl.style.animationPlayState = 'running');
  }

  // ─── MODAL ───
  const modal = document.getElementById('contactModal');
  const modalClose = document.getElementById('modalClose');
  const contactForm = document.getElementById('contactForm');
  const formBody = document.getElementById('formBody');
  const formSuccess = document.getElementById('formSuccess');

  function openModal(plan) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    formBody.style.display = 'block';
    formSuccess.classList.remove('show');
    if (plan) {
      const note = contactForm.querySelector('textarea');
      if (note && !note.value) note.placeholder = `Interested in the ${plan} plan...`;
    }
  }

  modalClose.addEventListener('click', () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        formBody.style.display = 'none';
        formSuccess.classList.add('show');
      } else {
        btn.textContent = 'Something went wrong — try again';
        btn.disabled = false;
      }
    } catch {
      btn.textContent = 'Something went wrong — try again';
      btn.disabled = false;
    }
  });

  // ─── NAV SCROLL ───
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // ─── REVEAL ON SCROLL ───
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Animate metric bars when visible
        entry.target.querySelectorAll('.metric-bar').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach(el => observer.observe(el));

  // ─── COUNTER ANIMATION ───
  function animateCounter(id, target, suffix) {
    const el = document.getElementById(id);
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.round(current);
      if (current >= target) clearInterval(timer);
    }, 20);
  }
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter('c1', 150);
        animateCounter('c2', 34);
        animateCounter('c3', 18);
        animateCounter('c4', 80);
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });
  statsObserver.observe(document.querySelector('.stats'));

  // ─── INDUSTRY TABS ───
  const tabs = document.querySelectorAll('.industry-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.industry-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('tab-' + tab.dataset.tab);
      panel.classList.add('active');
      // Animate metric bars for new panel
      panel.querySelectorAll('.metric-bar').forEach(bar => {
        bar.style.width = '0';
        setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 50);
      });
    });
  });

  // ─── INIT METRIC BARS FOR VISIBLE PANEL ───
  document.querySelectorAll('.industry-panel.active .metric-bar').forEach(bar => {
    setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 500);
  });
</script>
