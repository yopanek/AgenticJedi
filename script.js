/* Agentic Jedi — Interactive JS */

// FAQ accordion
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const answer = item.querySelector('.faq-answer');
  const isOpen = answer.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-answer.open').forEach(el => el.classList.remove('open'));
  document.querySelectorAll('.faq-question.open').forEach(el => el.classList.remove('open'));

  // Open clicked if it was closed
  if (!isOpen) {
    answer.classList.add('open');
    btn.classList.add('open');
  }
}

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
  }

  // Close mobile nav on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });

  // Smooth scroll offset for fixed nav
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // Intersection observer: fade-in sections
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.step-card, .feature-card, .pricing-card, .testimonial-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  // Contact form: show success message on Formspree redirect
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const success = document.getElementById('formSuccess');
      btn.textContent = 'Sending…';
      btn.disabled = true;
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          form.reset();
          success.classList.add('visible');
          btn.style.display = 'none';
        } else {
          btn.textContent = 'Something went wrong — try again';
          btn.disabled = false;
        }
      } catch {
        btn.textContent = 'Something went wrong — try again';
        btn.disabled = false;
      }
    });
  }
});
