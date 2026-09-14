/* ==========================================================================
   SmartCampus AI — Landing Page Interactions
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     Sticky navbar shrink/blur on scroll
  --------------------------------------------------------------------- */
  const navbar = document.querySelector('.navbar');
  const scrollProgress = document.querySelector('.scroll-progress');
  const backToTop = document.querySelector('.back-to-top');

  function onScroll(){
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 10);
    backToTop.classList.toggle('show', y > 600);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (y / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  }
  document.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top:0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------------------------------------------------------------------
     Mobile hamburger menu
  --------------------------------------------------------------------- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ---------------------------------------------------------------------
     Active section highlighting on scroll
  --------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ---------------------------------------------------------------------
     Fade-in reveal on scroll
  --------------------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------------------
     Typing text animation (hero headline)
  --------------------------------------------------------------------- */
  const typedEl = document.querySelector('.typed');
  if (typedEl){
    const words = JSON.parse(typedEl.getAttribute('data-words') || '["AI"]');
    let wordIndex = 0, charIndex = 0, deleting = false;

    function typeLoop(){
      const current = words[wordIndex];
      if (!deleting){
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length){
          deleting = true;
          setTimeout(typeLoop, 1400);
          return;
        }
      } else {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0){
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }
      setTimeout(typeLoop, deleting ? 45 : 90);
    }

    if (reduceMotion){
      typedEl.textContent = words[0];
    } else {
      typeLoop();
    }
  }

  /* ---------------------------------------------------------------------
     Animated stat counters
  --------------------------------------------------------------------- */
  const counters = document.querySelectorAll('.stat-num[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el){
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = reduceMotion ? 0 : 1400;
    const start = performance.now();
    const numSpan = el.querySelector('.num');

    function step(now){
      const progress = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);
      numSpan.textContent = value;
      if (progress < 1) requestAnimationFrame(step);
      else numSpan.textContent = target;
    }
    if (suffix){
      const suffixSpan = el.querySelector('.suffix');
      if (suffixSpan) suffixSpan.textContent = suffix;
    }
    requestAnimationFrame(step);
  }

  /* ---------------------------------------------------------------------
     Mouse glow effect
  --------------------------------------------------------------------- */
  const glow = document.querySelector('.mouse-glow');
  if (glow && !reduceMotion){
    window.addEventListener('mousemove', (e) => {
      glow.style.setProperty('--mx', e.clientX + 'px');
      glow.style.setProperty('--my', e.clientY + 'px');
    });
  }

  /* ---------------------------------------------------------------------
     Smooth scroll for in-page links (fallback for older browsers)
  --------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
      const targetId = this.getAttribute('href');
      if (targetId.length > 1){
        const target = document.querySelector(targetId);
        if (target){
          e.preventDefault();
          const y = target.getBoundingClientRect().top + window.scrollY - (document.querySelector('.navbar').offsetHeight - 1);
          window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      }
    });
  });

  /* ---------------------------------------------------------------------
   Portal / login redirects
--------------------------------------------------------------------- */

document.querySelectorAll('[data-redirect]').forEach(btn => {

    btn.addEventListener('click', () => {

        const target = btn.getAttribute('data-redirect');

        switch (target) {

            case "student":
              window.location.href = "FRONTEND/HTML/student_loginnew.html";
                break;

            case "staff":
              window.location.href = "FRONTEND/HTML/staff_loginnew.html";
                break;

            case "institution":
              window.location.href = "FRONTEND/HTML/institution_loginnew.html";
                break;

            default:
                if (target) {
                    window.location.href = target;
                }

        }

    });

});

});