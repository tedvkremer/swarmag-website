'use strict';

const $ = (selector, node = document) => node.querySelector(selector);
const $$ = (selector, node = document) => node.querySelectorAll(selector);

// ==================================================================

function initCarousel() {
  // Carousel functionality
  let curr = 0;
  let interval = null;

  const hero = $('#hero');
  const carousel = $('.Carousel', hero);
  const slides = $$('.CarouselSlide', carousel);
  const totSlides = slides.length;
  const nextBtn = $('.CarouselNextSlide', carousel);
  const prevBtn = $('.CarouselPrevSlide', carousel);
  const indicators = $$('.CarouselIndicators>button.CarouselDot', carousel);

  function updateCarousel() {
    let offset = (0 - curr) * 100;
    slides.forEach(slide => {
      slide.style.transform = `translateX(${offset}%)`;
      offset += 100;
    });

    indicators.forEach((indicator, index) => {
      if (index === curr) {
        indicator.classList.remove('CarouselDot');
        indicator.classList.add('CarouselDotActive');
        indicator.setAttribute('aria-current', 'true');
      } else {
        indicator.classList.remove('CarouselDotActive');
        indicator.classList.add('CarouselDot');
        indicator.removeAttribute('aria-current');
      }
    });
  }

  function nextSlide() {
    stopCarousel();
    curr = (curr + 1) % totSlides;
    updateCarousel();
    startCarousel();
  }

  function prevSlide() {
    stopCarousel();
    curr = (curr - 1 + totSlides) % totSlides;
    updateCarousel();
    startCarousel();
  }

  function toSlide(index) {
    if (index < 0 || index >= totSlides) return;
    stopCarousel();
    curr = index;
    updateCarousel();
    startCarousel();
  }

  function startCarousel() {
    interval = setInterval(nextSlide, 8000);
  }

  function stopCarousel() {
    if (!interval) return;
    clearInterval(interval);
    interval = null;
  }

  // Carousel navigation event listeners
  nextBtn.addEventListener('click', () => nextSlide());
  prevBtn.addEventListener('click', () => prevSlide());
  indicators.forEach((indicator, index) =>
    indicator.addEventListener('click', () => toSlide(index))
  );

  // Initialize carousel
  updateCarousel();
  startCarousel();
}

// ==================================================================

function initHeader() {
  // Header scroll effect
  const hero = $('#hero');
  const header = $('#header');
  window.addEventListener('scroll', () => {
    const trigger = hero.offsetTop + Math.trunc(hero.offsetHeight / 4);
    const sticky = window.scrollY > trigger;
    sticky ? header.classList.add('Sticky') : header.classList.remove('Sticky');
  });
}

// ==================================================================

function initContactForm() {
  // Form validation
  const contactForm = $('#contact-form');
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    if (validateForm()) {
      // Simulate form submission
      const submitBtn = $('button[type="submit"]', contactForm);
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // Simulate API call
      setTimeout(() => {
        submitBtn.textContent = 'Message Sent!';
        submitBtn.classList.add('bg-green-600');
        submitBtn.classList.remove('bg-green-700', 'hover:bg-green-800');

        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.classList.remove('bg-green-600');
          submitBtn.classList.add('bg-green-700', 'hover:bg-green-800');
          contactForm.reset();
          clearFormErrors();
        }, 2000);
      }, 1500);
    }
  });

  // Add asterisks to required field labels
  const requiredFields = $$('input[required], select[required], textarea[required]', contactForm);
  requiredFields.forEach(field => {
    const label = $(`label[for="${field.id}"]`, contactForm);
    if (label && !label.textContent.includes('*')) {
      label.innerHTML += ' <span class="text-red-500">*</span>';
    }
  });

  // Real-time validation - attach to all form fields
  const inputs = $$('input, select, textarea', contactForm);
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });

    input.addEventListener('input', () => {
      if (input.classList.contains('border-red-500')) {
        validateField(input);
      }
    });
  });

  function validateForm() {
    const required = $$('input[required], select[required], textarea[required]', contactForm);
    for (const i = 0; i < required.length; i++) {
      if (!validateField(required[i])) return false;
    }
    return true;
  }

  function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let errorElement = document.getElementById(`${field.id}-error`);

    // Create error element dynamically if it doesn't exist
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = `${field.id}-error`;
      errorElement.className = 'text-red-500 text-sm mt-1 hidden';
      errorElement.setAttribute('role', 'alert');
      field.parentNode.insertBefore(errorElement, field.nextSibling);
    }

    // Clear previous error
    errorElement.textContent = '';
    errorElement.classList.add('hidden');
    field.classList.remove('border-red-500');
    field.classList.add('border-gray-300');

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      showError(field, errorElement, `${fieldName} is required`);
      return false;
    }

    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showError(field, errorElement, 'Please enter a valid email address');
        return false;
      }
    }

    // Minimum length validation
    if (field.hasAttribute('minlength') && value.length < field.getAttribute('minlength')) {
      showError(field, errorElement, `${fieldName} must be at least ${field.getAttribute('minlength')} characters`);
      return false;
    }

    return true;
  }

  function showError(field, errorElement, message) {
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    field.classList.remove('border-gray-300');
    field.classList.add('border-red-500');
  }

  function clearFormErrors() {
    const errorElements = $$('[id$="-error"]', contactForm);
    errorElements.forEach(error => {
      error.textContent = '';
      error.classList.add('hidden');
    });

    const inputs = $$('input, select, textarea', contactForm);
    inputs.forEach(input => {
      input.classList.remove('border-red-500');
      input.classList.add('border-gray-300');
    });
  }
}

// ==================================================================

function initAnchorScrolling() {
  // Smooth scrolling for anchor links
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = $(this.getAttribute('href'));
      if (target) {
        const targetTop = target.getBoundingClientRect().top + window.scrollY - 50;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });
}

// ==================================================================

function initFadeInUpScrolling() {
  // Fade in up animation on scroll
  const intersections = (entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('fade-in-up');
        observer.unobserve(e.target);
      }
    })
  };
  const options = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  const observer = new IntersectionObserver(intersections, options);
  $$('div.Container').forEach(c => observer.observe(c));
}

// ==================================================================

function initErrorBoundaries() {
  // Add loading states and error boundaries
  window.addEventListener('error', e => {
    console.error('JavaScript error:', e.error);
    // Could send to error tracking service
  });

  window.addEventListener('unhandledrejection', e => {
    console.error('Unhandled promise rejection:', e.reason);
    // Could send to error tracking service
  });
}

// ==================================================================

document.addEventListener('DOMContentLoaded', () => {
  // initCarousel();
  initHeader();
  initContactForm();
  initAnchorScrolling();
  initFadeInUpScrolling();
  initErrorBoundaries();
});
