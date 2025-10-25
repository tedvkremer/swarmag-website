import { $, $$ } from './core.js'

/**
 * Initialize dynamic page behaviors including header effects, smooth scrolling, and animations.
 */
export const init = () => initPageDynamics();

/**
 * Initialize all dynamic page behaviors.
 */
function initPageDynamics() {
  initHeader();
  initAnchorScrolling();
  initFadeInUpScrolling();
}

/*************************************
  Header scroll effect
 *************************************/

/**
 * Initialize sticky header behavior based on scroll position.
 */
function initHeader() {
  const hero = $('#hero');
  const header = $('#header');

  function isSticky() {
    const trigger = hero.offsetTop + Math.trunc(hero.offsetHeight / 4);
    return window.scrollY > trigger;
  }

  function onScroll() {
    const sticky = isSticky();
    const isSet = header.classList.contains('Sticky');
    if (sticky && !isSet)
      header.classList.add('Sticky');
    else if (!sticky && isSet)
      header.classList.remove('Sticky');
  }

  window.addEventListener('scroll', () => onScroll());
}

/**
 * Initialize smooth scrolling for anchor links.
 */
function initAnchorScrolling() {
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

/**
 * Initialize fade-in-up animation for elements on scroll using Intersection Observer.
 */
function initFadeInUpScrolling() {
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
  $$('.Effect').forEach(c => observer.observe(c));
}
