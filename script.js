// Carica Google Maps solo al click (GDPR / cookie terze parti)
function loadMap(btn) {
  const placeholder = btn.closest('.map-placeholder');
  const src = placeholder.dataset.src;
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('loading', 'lazy');
  placeholder.parentNode.replaceChild(iframe, placeholder);
}

// Smooth scroll personalizzato — più fluido del browser nativo
function smoothScrollTo(targetY, duration) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  const startTime = performance.now();

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + diff * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// Intercetta tutti i link ancora (#...) nella pagina
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href === '#') return;
  const target = document.querySelector(href);
  if (!target) return;
  e.preventDefault();
  // rispetta scroll-margin-top definito nel CSS
  const scrollMargin = parseInt(getComputedStyle(target).scrollMarginTop) || 0;
  const targetY = target.getBoundingClientRect().top + window.scrollY - scrollMargin;
  smoothScrollTo(targetY, 900);
});

const reveals = document.querySelectorAll('.reveal');

window.addEventListener('scroll', revealSections);

function revealSections() {

  const triggerBottom = window.innerHeight * 0.85;

  reveals.forEach(section => {

    const sectionTop = section.getBoundingClientRect().top;

    if(sectionTop < triggerBottom) {
      section.classList.add('active');
    }

  });

}

revealSections();

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileNavClose = document.getElementById('mobileNavClose');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
  mobileNavClose.addEventListener('click', () => mobileNav.classList.remove('open'));
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileNav.classList.remove('open'));
  });
}

// Navbar scroll transition
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// Carousel — bottoni + auto-scroll
const carouselTrack = document.querySelector('.carousel-track');
if (carouselTrack) {
  const scrollAmount = 450;

  document.querySelector('.carousel-btn.right')?.addEventListener('click', () => {
    carouselTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
  document.querySelector('.carousel-btn.left')?.addEventListener('click', () => {
    carouselTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  function startAutoScroll() {
    return setInterval(() => {
      const maxScroll = carouselTrack.scrollWidth - carouselTrack.clientWidth;
      if (carouselTrack.scrollLeft >= maxScroll - 10) {
        carouselTrack.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        carouselTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }, 3800);
  }

  let autoScroll = startAutoScroll();

  carouselTrack.addEventListener('mouseenter', () => clearInterval(autoScroll));
  carouselTrack.addEventListener('mouseleave', () => { autoScroll = startAutoScroll(); });
  carouselTrack.addEventListener('touchstart', () => clearInterval(autoScroll), { passive: true });
}

// Back to top
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// "Altro" dropdown nei quick links vini
const wineLinksMoreBtn = document.getElementById('wineLinksMoreBtn');
const wineLinksDropdown = document.getElementById('wineLinksDropdown');
if (wineLinksMoreBtn && wineLinksDropdown) {
  wineLinksMoreBtn.addEventListener('click', () => {
    const isOpen = wineLinksMoreBtn.classList.contains('open');
    wineLinksMoreBtn.classList.toggle('open', !isOpen);
    wineLinksDropdown.classList.toggle('open', !isOpen);
    wineLinksMoreBtn.setAttribute('aria-expanded', String(!isOpen));
  });
  // chiude cliccando fuori
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.wine-links-more')) {
      wineLinksMoreBtn.classList.remove('open');
      wineLinksDropdown.classList.remove('open');
      wineLinksMoreBtn.setAttribute('aria-expanded', 'false');
    }
  });
  // chiude dopo aver cliccato un link interno
  wineLinksDropdown.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      wineLinksMoreBtn.classList.remove('open');
      wineLinksDropdown.classList.remove('open');
      wineLinksMoreBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// Region nav — active state highlight
const regionNav = document.getElementById('regionNav');
if (regionNav) {
  const regionLinks = regionNav.querySelectorAll('a');
  const regions = document.querySelectorAll('.wine-region[id]');

  const regionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        regionLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
        // su mobile: scrolla il link attivo nella nav
        const activeLink = regionNav.querySelector('a.active');
        if (activeLink) {
          activeLink.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
        }
      }
    });
  }, {
    rootMargin: '-130px 0px -65% 0px'
  });

  regions.forEach(r => regionObs.observe(r));
}

// Sfuso — pillole categoria
const sfusoCats = document.querySelectorAll('.sfuso-cat[data-target]');
if (sfusoCats.length) {
  sfusoCats.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const panel = document.getElementById(targetId);
      const isOpen = btn.classList.contains('active');

      // chiudi tutti
      sfusoCats.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.sfuso-cat-panel').forEach(p => {
        p.classList.remove('open');
        p.style.maxHeight = '0';
      });

      // apri quello cliccato (se non era già aperto)
      if (!isOpen && panel) {
        btn.classList.add('active');
        panel.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}