/**
 * Abrar Sami - Freelance Data Engineer & Software Developer Portfolio
 * Vanilla JavaScript Engine
 * Features: Dark/Light Mode Switcher, Scroll Reveal Animations,
 * Active Nav Spy, Mobile Drawer, Smooth Anchor Scrolling, Interactive Form
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Theme Management (Dark Mode Default + Light Mode Toggle & Storage)
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved preference or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      );
    }
  }

  /* --------------------------------------------------------------------------
     2. Sticky Header Elevation on Scroll
     -------------------------------------------------------------------------- */
  const siteHeader = document.getElementById('site-header');

  const handleHeaderScroll = () => {
    if (!siteHeader) return;
    if (window.scrollY > 30) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // initial check

  /* --------------------------------------------------------------------------
     3. Mobile Navigation Drawer
     -------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileNav) {
    const toggleMenu = (open) => {
      const shouldOpen = open !== undefined ? open : !mobileNav.classList.contains('open');
      mobileNav.classList.toggle('open', shouldOpen);
      mobileToggle.classList.toggle('open', shouldOpen);
      mobileToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
      mobileNav.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
    };

    mobileToggle.addEventListener('click', () => toggleMenu());

    // Close mobile menu when a nav link is clicked
    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close mobile menu on click outside
    document.addEventListener('click', (e) => {
      if (
        mobileNav.classList.contains('open') &&
        !mobileNav.contains(e.target) &&
        !mobileToggle.contains(e.target)
      ) {
        toggleMenu(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. IntersectionObserver for Scroll Reveal Animations
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Once revealed, stay visible
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1,
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add('active'));
  }

  /* --------------------------------------------------------------------------
     5. Active Navigation Link Highlighting (Scroll Spy)
     -------------------------------------------------------------------------- */
  const trackedSections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  const handleNavSpy = () => {
    const scrollPosition = window.scrollY + 120;

    trackedSections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        desktopNavLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', handleNavSpy, { passive: true });
  handleNavSpy();

  /* --------------------------------------------------------------------------
     6. Smooth Scroll for Anchor Links (Precision Offset)
     -------------------------------------------------------------------------- */
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 76;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });

        // Update URL hash without jump
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });

  /* --------------------------------------------------------------------------
     7. Contact Form Validation & Interactive Feedback
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('portfolio-contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const serviceInput = document.getElementById('contact-service');
      const messageInput = document.getElementById('contact-message');

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        setError(nameInput, true);
        isValid = false;
      } else {
        setError(nameInput, false);
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        setError(emailInput, true);
        isValid = false;
      } else {
        setError(emailInput, false);
      }

      // Validate Service
      if (!serviceInput.value) {
        setError(serviceInput, true);
        isValid = false;
      } else {
        setError(serviceInput, false);
      }

      // Validate Message
      if (!messageInput.value.trim() || messageInput.value.trim().length < 8) {
        setError(messageInput, true);
        isValid = false;
      } else {
        setError(messageInput, false);
      }

      if (!isValid) {
        showFeedback(
          'Please complete all required fields correctly before submitting.',
          'error'
        );
        return;
      }

      // Simulate sending inquiry
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span>Dispatching message...</span>
        <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="2" x2="12" y2="6"></line>
          <line x1="12" y1="18" x2="12" y2="22"></line>
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
          <line x1="2" y1="12" x2="6" y2="12"></line>
          <line x1="18" y1="12" x2="22" y2="12"></line>
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
        </svg>
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        contactForm.reset();

        showFeedback(
          '✔ Message received! Thank you for reaching out. Abrar will review your project details and respond within 24 hours.',
          'success'
        );
      }, 900);
    });

    // Real-time error clearing on input
    const inputs = contactForm.querySelectorAll('.form-input');
    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        setError(input, false);
      });
    });
  }

  function setError(inputElement, hasError) {
    const parent = inputElement.closest('.form-group');
    if (parent) {
      if (hasError) {
        parent.classList.add('has-error');
      } else {
        parent.classList.remove('has-error');
      }
    }
  }

  function showFeedback(message, type) {
    if (!formFeedback) return;
    formFeedback.textContent = message;
    formFeedback.className = `form-feedback ${type}`;
    formFeedback.classList.remove('hidden');

    if (type === 'success') {
      setTimeout(() => {
        formFeedback.classList.add('hidden');
      }, 7000);
    }
  }
});
