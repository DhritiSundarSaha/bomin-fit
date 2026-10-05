(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  const getPathKey = href => {
    const cleaned = (href || '').split('?')[0].split('#')[0].replace(/\/+$/, '').replace(/^\.\//, '');
    if (!cleaned || cleaned === '.') return 'index.html';
    return cleaned.endsWith('/index.html') ? 'index.html' : cleaned.split('/').filter(Boolean).pop() || 'index.html';
  };

  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      menuButton.textContent = isOpen ? '×' : '☰';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open menu');
        menuButton.textContent = '☰';
      });
    });
  }

  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => img.classList.add('image-error'), { once: true });
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -30px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const answer = item?.querySelector('.faq-answer');
      if (!item || !answer) return;
      const isOpen = item.classList.toggle('open');
      button.setAttribute('aria-expanded', String(isOpen));
      answer.style.maxHeight = isOpen ? `${answer.scrollHeight}px` : '0px';
    });
  });

  const contactForm = document.querySelector('.contact-form');
  contactForm?.addEventListener('submit', async event => {
    event.preventDefault();
    const status = contactForm.querySelector('.form-status');
    const action = contactForm.dataset.googleFormAction;

    if (!action) {
      status.textContent = 'Form setup is pending. Please contact Bomin Fit via WhatsApp or phone for now.';
      status.className = 'form-status is-error';
      return;
    }

    if (!contactForm.reportValidity()) return;

    const button = contactForm.querySelector('button[type="submit"]');
    button.disabled = true;
    status.textContent = 'Sending...';

    try {
      await fetch(action, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams(new FormData(contactForm)),
      });
      contactForm.reset();
      status.textContent = 'Thanks. Your message has been sent.';
      status.className = 'form-status is-success';
    } catch {
      status.textContent = 'Could not send right now. Please use WhatsApp or call us.';
      status.className = 'form-status is-error';
    } finally {
      button.disabled = false;
    }
  });

  const current = getPathKey(location.pathname);
  document.querySelectorAll('[data-nav]').forEach(link => {
    const href = getPathKey(link.getAttribute('href') || '');
    link.classList.toggle('active', href === current || (current === 'index.html' && href === 'index.html'));
  });
})();
