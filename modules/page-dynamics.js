import { $, $$ } from './utils.js'

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

/**
 * Initialize sticky header behavior based on scroll position.
 */
function initHeader() {
  const hero = $('#hero');
  const header = $('#header');

  window.addEventListener('scroll', onScroll);

  function onScroll() {
    const sticky = isSticky();
    const isSet = header.classList.contains('Sticky');
    if (sticky && !isSet)
      header.classList.add('Sticky');
    else if (!sticky && isSet)
      header.classList.remove('Sticky');
  }

  function isSticky() {
    const trigger = hero.offsetTop + Math.trunc(hero.offsetHeight / 4);
    return window.scrollY > trigger;
  }
}

/**
 * Initialize smooth scrolling for anchor links.
 */
function initAnchorScrolling() {
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', onClick));

  function onClick(e) {
    e.preventDefault();
    const target = $(this.getAttribute('href'));
    if (target) {
      const targetTop = target.getBoundingClientRect().top + window.scrollY - 50;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  }
}

/**
 * Initialize fade-in-up animation for elements on scroll using Intersection Observer.
 */
function initFadeInUpScrolling() {
  const options = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  const observer = new IntersectionObserver(intersections, options);
  $$('.Effect').forEach(c => observer.observe(c));

  function intersections(entries) {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('fade-in-up');
        observer.unobserve(e.target);
      }
    })
  };
}
