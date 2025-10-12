import { $, $$ } from './core.js'

/*************************************
  Carousel
 *************************************/

export default class Carousel {
  static DURATION = 8000;

  #id = 0;
  #slides = [];
  #indicators = [];
  #curr = 0;
  #total = 0;
  #interval = null;

  constructor(id) {
    this.#id = id;
  }

  init() {
    const carousel = $(this.#id);
    this.#slides = $$('.CarouselSlide', carousel);
    this.#total = this.#slides.length;
    this.#indicators = $$('.CarouselIndicators>button.CarouselDot', carousel);
    this.#indicators.forEach((indicator, i) =>
      indicator.addEventListener('click', () => this.toSlide(i))
    );

    const nextBtn = $('.CarouselNextSlide', carousel);
    const prevBtn = $('.CarouselPrevSlide', carousel);
    nextBtn.addEventListener('click', () => this.nextSlide());
    prevBtn.addEventListener('click', () => this.prevSlide());

    this.#update();

    return this;
  }

  #update() {
    let offset = (0 - this.#curr) * 100;
    this.#slides.forEach(slide => {
      slide.style.transform = `translateX(${offset}%)`;
      offset += 100;
    });

    this.#indicators.forEach((indicator, i) => {
      if (this.#curr === i) {
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

  #mutate(index) {
    if (index < 0 || index >= this.#total) {
      console.error(`slide index out of range: ${index} [0..${this.#total-1}]`);
      return;
    };
    const animating = this.#interval !== null;
    if (animating) this.stopCarousel();
    this.#curr = index;
    this.#update();
    if (animating) this.startCarousel();
  }

  nextSlide() {
    this.#mutate((this.#curr + 1) % this.#total);
  }

  prevSlide() {
    this.#mutate((this.#curr - 1 + this.#total) % this.#total);
  }

  toSlide(index) {
    this.#mutate(index);
  }

  startCarousel() {
    if (this.#interval) return;
    this.#interval = setInterval(() => this.nextSlide(), Carousel.DURATION);
  }

  stopCarousel() {
    if (!this.#interval) return;
    clearInterval(this.#interval);
    this.#interval = null;
  }
}
