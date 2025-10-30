import { $, $$ } from './utils.js'

/**
 * Carousel Component Class
 *
 * A flexible carousel/slider component that supports manual navigation,
 * auto-play functionality, and accessibility features. Manages slide
 * transitions, indicator states, and user interactions.
 */
export default class Carousel {
  /** @static {number} Auto-play duration in milliseconds (8 seconds) */
  static #DURATION = 8000;

  /** @private {string} CSS selector ID for the carousel container */
  #id = 0;

  /** @private {HTMLElement[]} Array of slide elements */
  #slides = [];

  /** @private {HTMLElement[]} Array of indicator button elements */
  #indicators = [];

  /** @private {number} Current active slide index */
  #curr = 0;

  /** @private {number} Total number of slides */
  #total = 0;

  /** @private {number|null} Auto-play interval ID, null when stopped */
  #interval = null;

  /**
   * Create a new Carousel instance.
   * @param {string} id - CSS selector ID for the carousel container
   */
  constructor(id) {
    this.#id = id;
  }

  /**
   * Initialize the carousel by setting up DOM elements and event listeners.
   * Must be called after construction and after DOM is ready.
   * @returns {Carousel} This carousel instance for method chaining
   */
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

  /**
   * Update the visual state of slides and indicators.
   * Applies CSS transforms to position slides and updates indicator states.
   * @private
   */
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

  /**
   * Change to a specific slide with bounds checking and auto-play management.
   * @private
   * @param {number} index - Target slide index
   */
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

  /**
   * Advance to the next slide (circular navigation).
   */
  nextSlide() {
    this.#mutate((this.#curr + 1) % this.#total);
  }

  /**
   * Go back to the previous slide (circular navigation).
   */
  prevSlide() {
    this.#mutate((this.#curr - 1 + this.#total) % this.#total);
  }

  /**
   * Jump to a specific slide by index.
   * @param {number} index - Target slide index (0-based)
   */
  toSlide(index) {
    this.#mutate(index);
  }

  /**
   * Start the auto-play carousel timer.
   * Does nothing if auto-play is already running.
   */
  startCarousel() {
    if (this.#interval) return;
    this.#interval = setInterval(() => this.nextSlide(), Carousel.#DURATION);
  }

  /**
   * Stop the auto-play carousel timer.
   * Does nothing if auto-play is not running.
   */
  stopCarousel() {
    if (!this.#interval) return;
    clearInterval(this.#interval);
    this.#interval = null;
  }
}
