import { $, $$ } from './utils.js'

/**
 * Carousel Component Class
 *
 * A flexible carousel/slider component that supports manual navigation,
 * auto-play functionality, and accessibility features. Manages slide
 * transitions, indicator states, and user interactions.
 */
export default class Carousel {
  /** @static {number} Auto-play duration in milliseconds (3.5 seconds) */
  static #DURATION = 3500;

  /** @private {string} CSS selector ID for the carousel container */
  #id = 0;

  /** @private {boolean} Automatically progress the carousel */
  #automate = false;

  /** @private {boolean} Auto-play duration in milliseconds */
  #duration = false;

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

  /** @private {number} Initial touch X position for swipe detection */
  #startX = 0;

  /** @private {number} Initial touch Y position for swipe detection */
  #startY = 0;

  /** @private {number} Minimum swipe distance in pixels to trigger navigation */
  #swipeThreshold = 50;

  /**
   * Create a new Carousel instance.
   * @param {string} id - CSS selector ID for the carousel container
   * @param {boolean} automate - Start carousel automation
   * @param {number} duration - Auto-play duration in milliseconds (default DURATRION)
   */
  constructor(id, automate, duration) {
    this.#id = id;
    this.#automate = automate;
    this.#duration = duration || Carousel.#DURATION;
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
    carousel.addEventListener('touchstart', e => this.#handleTouchStart(e), { passive: false });
    carousel.addEventListener('touchend', e => this.#handleTouchEnd(e), { passive: false });
    carousel.addEventListener('mouseenter', () => this.pause());
    carousel.addEventListener('mouseleave', () => this.unpause());

    this.#update();

    if (this.#automate) this.startCarousel();

    return this;
  }

  /**
   * Update the visual state of slides and indicators.
   * Applies CSS transforms to position slides and updates indicator states.
   * @private
   */
  #update() {
    const gap = 24, percent = 100;
    let offset = (0 - this.#curr) * percent;
    let pad = (0 - this.#curr) * gap;
    this.#slides.forEach(slide => {
      slide.style.transform = `translateX(calc(${offset}% + ${pad}px))`;
      offset += percent;
      pad += gap;
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
   * Handle touch start event to record initial touch position.
   * @private
   * @param {TouchEvent} e - Touch start event
   */
  #handleTouchStart(e) {
    this.#startX = e.touches[0].clientX;
    this.#startY = e.touches[0].clientY;
  }

  /**
   * Handle touch end event to detect swipe gestures and navigate slides.
   * @private
   * @param {TouchEvent} e - Touch end event
   */
  #handleTouchEnd(e) {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - this.#startX;
    const deltaY = endY - this.#startY;

    // Check if horizontal swipe is dominant and exceeds threshold
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.#swipeThreshold) {
      if (deltaX > 0) {
        this.prevSlide(); // Swipe right -> previous slide
      } else {
        this.nextSlide(); // Swipe left -> next slide
      }
    }
  }

  /**
   * Change to a specific slide with bounds checking and auto-play management.
   * @private
   * @param {number} index - Target slide index
   */
  #mutate(index) {
    if (index < 0 || index >= this.#total) {
      console.error(`slide index out of range: ${index} [0..${this.#total - 1}]`);
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

  /**
   * Pause the carousel auto-play.
   */
  pause() {
    this.stopCarousel();
  }

  /**
   * Unpause the carousel auto-play if it was set to auto-play.
   */
  unpause() {
    if (this.#automate) this.startCarousel();
  }
}
