const $ = (selector, node = document) => node.querySelector(selector);
const $$ = (selector, node = document) => node.querySelectorAll(selector);

export const init = () => initPageDynamics();

function initPageDynamics() {
  initHeader();
  initAnchorScrolling();
  initFadeInUpScrolling();
}

/*************************************
  Header scroll effect
 *************************************/

function initHeader() {
  const hero = $('#hero');
  const header = $('#header');
  window.addEventListener('scroll', () => {
    const trigger = hero.offsetTop + Math.trunc(hero.offsetHeight / 4);
    const sticky = window.scrollY > trigger;
    const isSet = header.classList.contains('Sticky');
    if (sticky && !isSet) 
      header.classList.add('Sticky');
    else if (!sticky && isSet) 
      header.classList.remove('Sticky');
  });
}

/*************************************
  Smooth scrolling for anchor links
 *************************************/

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

/*************************************
  Fade in up animation on scroll
 *************************************/

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
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };
  const observer = new IntersectionObserver(intersections, options);
  $$('.Effect').forEach(c => observer.observe(c));
}
