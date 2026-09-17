(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      menuButton.innerHTML = isOpen ? '×' : '☰';
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open menu');
        menuButton.innerHTML = '☰';
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
  }, { threshold: 0.14, rootMargin: '0px 0px -40px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = Number(el.dataset.count || 0);
      const duration = 1100;
      const start = performance.now();
      const step = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(end * eased).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => counterObserver.observe(el));

  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const answer = item?.querySelector('.faq-answer');
      if (!item || !answer) return;
      const open = item.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
      answer.style.maxHeight = open ? `${answer.scrollHeight}px` : '0px';
    });
  });

  const contactForm = document.querySelector('.contact-form');
  contactForm?.addEventListener('submit', async event => {
    event.preventDefault();
    const status = contactForm.querySelector('.form-status');
    const action = contactForm.dataset.googleFormAction;
    if (!action) {
      status.textContent = 'Form setup is pending. Please call or use WhatsApp for now.';
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

  const tabs = document.querySelectorAll('.hotspot');
  const panel = document.querySelector('[data-tab-panel]');
  const tabData = {
    p1: {
      title: 'Thoughtful protein support',
      body: 'Position the product here with its verified protein facts, ingredient source, and any approved nutritional claims. Keep this copy factual and easy to scan.',
      meta: ['Verified nutrition facts', 'Everyday routine'],
    },
    p2: {
      title: 'A formulation built around quality',
      body: 'Use this space to explain sourcing, formulation standards, certifications, or quality checks that you can substantiate for the finished product.',
      meta: ['Quality-led', 'Traceable details'],
    },
    p3: {
      title: 'Simple to fit into a routine',
      body: 'Show the preparation method, serving guidance, and storage instructions exactly as stated on the approved product packaging.',
      meta: ['Easy preparation', 'Clear serving guide'],
    },
    p4: {
      title: 'Taste and everyday usability',
      body: 'Add the verified flavour profile, serving ideas, and practical usage tips here so visitors understand how the product fits into real life.',
      meta: ['Practical use', 'Flexible serving'],
    },
  };

  const renderTab = id => {
    const data = tabData[id];
    if (!panel || !data) return;
    panel.innerHTML = `
      <div class="eyebrow">Product focus</div>
      <h3>${data.title}</h3>
      <p>${data.body}</p>
      <div class="tab-meta">
        <div class="meta-pill">${data.meta[0]}</div>
        <div class="meta-pill">${data.meta[1]}</div>
      </div>
    `;
    tabs.forEach(t => t.classList.toggle('active', t.dataset.target === id));
  };
  tabs.forEach(tab => tab.addEventListener('click', () => renderTab(tab.dataset.target)));
  if (tabs.length) renderTab(tabs[0].dataset.target);

  // Simple magnetic-style button interaction on pointer-capable devices.
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('pointermove', e => {
      if (window.matchMedia('(pointer: coarse)').matches) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * .03}px, ${y * .03}px)`;
    });
    btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
  });

  // Mark the active page link.
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(link => {
    const href = link.getAttribute('href')?.split('/').pop();
    link.classList.toggle('active', href === current || (current === '' && href === 'index.html'));
  });
})();
