/* ===== LOADER ===== */
window.addEventListener('load', function() {
  setTimeout(function() { document.getElementById('loader').classList.add('done'); }, 1600);
});

/* ===== SCROLL PROGRESS ===== */
var scrollProg = document.getElementById('scrollProg');
var navbar = document.getElementById('navbar');
var backTop = document.getElementById('backTop');

function onScroll() {
  var st = document.documentElement.scrollTop || document.body.scrollTop;
  var sh = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  scrollProg.style.width = (sh > 0 ? (st / sh) * 100 : 0) + '%';
  navbar.classList.toggle('scrolled', st > 50);
  backTop.classList.toggle('vis', st > 500);
}
var scrollTick = false;
window.addEventListener('scroll', function() {
  if (!scrollTick) { requestAnimationFrame(function() { onScroll(); updateActiveNav(); scrollTick = false; }); scrollTick = true; }
});

/* ===== BACK TO TOP ===== */
backTop.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });

/* ===== MOBILE MENU ===== */
var hamburger = document.getElementById('hamburger');
var mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', function() {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
function closeMobile() {
  hamburger.classList.remove('active');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}
mobileMenu.querySelectorAll('a').forEach(function(a) { a.addEventListener('click', closeMobile); });

/* ===== SCROLL REVEAL ===== */
var rvEls = document.querySelectorAll('.rv');
var rvObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
rvEls.forEach(function(el) { rvObs.observe(el); });

/* ===== COUNTERS ===== */
var counters = document.querySelectorAll('.counter');
var countersGo = false;
var cObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting && !countersGo) {
      countersGo = true;
      counters.forEach(function(c) {
        var target = parseInt(c.getAttribute('data-target'), 10);
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / 2000, 1);
          var ease = 1 - Math.pow(1 - p, 3);
          c.textContent = Math.floor(ease * target).toLocaleString('en-IN');
          if (p < 1) requestAnimationFrame(step); else c.textContent = target.toLocaleString('en-IN');
        }
        requestAnimationFrame(step);
      });
    }
  });
}, { threshold: 0.4 });
counters.forEach(function(c) { cObs.observe(c); });

/* ===== PRICING TILT ===== */
document.querySelectorAll('.prc-card').forEach(function(card) {
  card.addEventListener('mousemove', function(e) {
    if (window.innerWidth < 1024 || card.classList.contains('pop')) return;
    var r = card.getBoundingClientRect();
    var rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -4;
    var ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 4;
    card.style.transform = 'perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
  });
  card.addEventListener('mouseleave', function() {
    if (card.classList.contains('pop')) return;
    card.style.transform = '';
  });
});

/* ===== TESTIMONIALS CAROUSEL ===== */
var tstTrack = document.getElementById('tstTrack');
var tstSlides = tstTrack.querySelectorAll('.tst-slide');
var tstDots = document.getElementById('tstDots');
var curSlide = 0, autoTst;
tstSlides.forEach(function(_, i) {
  var d = document.createElement('button');
  d.className = 'tst-dot' + (i === 0 ? ' active' : '');
  d.setAttribute('aria-label', 'Review ' + (i + 1));
  d.addEventListener('click', function() { goSlide(i); });
  tstDots.appendChild(d);
});
var dotEls = tstDots.querySelectorAll('.tst-dot');
function goSlide(i) {
  curSlide = i;
  tstTrack.style.transform = 'translateX(-' + (curSlide * 100) + '%)';
  dotEls.forEach(function(d, j) { d.classList.toggle('active', j === curSlide); });
  resetAuto();
}
document.getElementById('tstNext').addEventListener('click', function() { goSlide((curSlide + 1) % tstSlides.length); });
document.getElementById('tstPrev').addEventListener('click', function() { goSlide((curSlide - 1 + tstSlides.length) % tstSlides.length); });
function resetAuto() { clearInterval(autoTst); autoTst = setInterval(function() { goSlide((curSlide + 1) % tstSlides.length); }, 5000); }
resetAuto();
var tStartX = 0, tStartY = 0;
var tstWrap = document.querySelector('.tst-wrapper');
tstWrap.addEventListener('touchstart', function(e) { tStartX = e.changedTouches[0].screenX; tStartY = e.changedTouches[0].screenY; }, { passive: true });
tstWrap.addEventListener('touchend', function(e) {
  var dx = tStartX - e.changedTouches[0].screenX;
  var dy = tStartY - e.changedTouches[0].screenY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
    goSlide(dx > 0 ? (curSlide + 1) % tstSlides.length : (curSlide - 1 + tstSlides.length) % tstSlides.length);
  }
}, { passive: true });

/* ===== LIGHTBOX ===== */
var lightbox = document.getElementById('lightbox');
var lightboxImg = document.getElementById('lightboxImg');
document.querySelectorAll('.gal-item').forEach(function(item) {
  item.addEventListener('click', function() {
    lightboxImg.src = item.getAttribute('data-src');
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});
function closeLightbox() { lightbox.classList.remove('open'); document.body.style.overflow = ''; }
lightbox.addEventListener('click', closeLightbox);
document.querySelector('.lightbox-close').addEventListener('click', function(e) { e.stopPropagation(); closeLightbox(); });
document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox(); });

/* ===== CONTACT FORM ===== */
var contactForm = document.getElementById('contactForm');
var toast = document.getElementById('toast');
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(function() { toast.classList.remove('show'); }, 3500);
}
contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  var valid = true;
  var name = contactForm.querySelector('[name="name"]');
  var phone = contactForm.querySelector('[name="phone"]');
  var interest = contactForm.querySelector('[name="interest"]');
  contactForm.querySelectorAll('.error').forEach(function(el) { el.classList.remove('error'); });
  if (!name.value.trim()) { name.parentElement.classList.add('error'); valid = false; }
  if (!phone.value.trim() || !/^[+]?[\d\s-]{8,15}$/.test(phone.value.trim())) { phone.parentElement.classList.add('error'); valid = false; }
  if (!interest.value) { interest.parentElement.classList.add('error'); valid = false; }
  if (valid) { showToast('👑 Message sent successfully! We will contact you soon.'); contactForm.reset(); }
});
contactForm.querySelectorAll('input, select, textarea').forEach(function(el) {
  el.addEventListener('input', function() { var p = el.closest('div'); if (p) p.classList.remove('error'); });
  el.addEventListener('change', function() { var p = el.closest('div'); if (p) p.classList.remove('error'); });
});

/* ===== RIPPLE EFFECT ===== */
document.querySelectorAll('.btn-gold, .nav-cta-btn').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    var ripple = document.createElement('span');
    ripple.className = 'ripple';
    var rect = btn.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(ripple);
    setTimeout(function() { ripple.remove(); }, 600);
  });
});

/* ===== ACTIVE NAV ===== */
var secIds = ['home', 'about', 'why', 'services', 'trainers', 'pricing', 'gallery', 'contact'];
var navLinks = document.querySelectorAll('.nav-links a');
function updateActiveNav() {
  var st = window.scrollY + 140;
  var cur = '';
  secIds.forEach(function(id) {
    var sec = document.getElementById(id);
    if (sec && sec.offsetTop <= st) cur = id;
  });
  navLinks.forEach(function(a) { a.classList.toggle('active', a.getAttribute('href') === '#' + cur); });
}

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    var href = a.getAttribute('href');
    if (href === '#') return;
    var target = document.querySelector(href);
    if (target) { e.preventDefault(); window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' }); }
  });
});

/* ===== HERO PARALLAX ===== */
var heroGlow = document.querySelector('.hero-glow');
document.addEventListener('mousemove', function(e) {
  if (window.innerWidth < 768 || !heroGlow) return;
  var x = (e.clientX / window.innerWidth - 0.5) * 2;
  var y = (e.clientY / window.innerHeight - 0.5) * 2;
  heroGlow.style.transform = 'translate(' + (x * 20) + 'px, ' + (y * 20) + 'px)';
});

/* ===== PREVENT FOUC ===== */
document.documentElement.style.opacity = '0';
document.documentElement.style.transition = 'opacity 0.3s';
window.addEventListener('load', function() { requestAnimationFrame(function() { document.documentElement.style.opacity = '1'; }); });