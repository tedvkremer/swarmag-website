import Swarm from './Swarm.js'

/**
 * Website Application Singleton Class
 *
 * Manages the overall website application including module loading,
 * gallery management, and visual effects. Uses the singleton pattern
 * to ensure only one instance exists throughout the application lifecycle.
 */
export default class Website {
  /** @static @private {Website} Singleton instance */
  static #the = null;

  /** @private {Map} Storage for photo galleries indexed by gallery name */
  #galleries = new Map();

  /** @private {Swarm} Swarm effect instance for visual animations */
  #swarm = new Swarm();

  /**
   * Get the galleries collection.
   * @returns {Map} Map of gallery names to gallery objects
   */
  get galleries() { return this.#galleries; }

  /**
   * Initialize the website application.
   * Called automatically via DOMContentLoaded event listener in bootstrap().
   * @private
   * @param {string[]} modules - Array of module names to load
   */
  #init(modules = []) {
    try {
      // Load & initialize modules
      modules.forEach(name => this.#load(name));

      // Initialize swarm of bees effect (easter-egg)
      this.#swarm.init();
      this.#swarm.create(30, 10, 10, 3);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Dynamically load and initialize module.
   * @private
   * @param {string} name - Name of module to load and initialize
   */
  async #load(name) {
    const module = await import(`../modules/${name}.js`);
    if (!module.init) throw new Error(`module ${name} missing exported init()`);
    module.init();
  }

  /**
   * Get the singleton instance of the Website.
   * @static
   * @returns {Website} The singleton Website instance
   * @throws {Error} If bootstrap() has not been called first
   */
  static get the() {
    if (!Website.#the) throw new Error('bootstrap() must be completed first!');
    return Website.#the;
  }

  /**
   * Bootstrap the website application and create the singleton instance.
   * @static
   * @param {string[]} [modules=[]] - Array of module names to load on initialization
   * @throws {Error} If bootstrap() has already been called
   */
  static bootstrap(modules = []) {
    if (Website.#the) {
      console.error("bootstrap() already completed!");
      return;
    }

    Website.#the = new Website();
    window.addEventListener(
      'DOMContentLoaded',
      () => Website.the.#init(modules)
    );
  }
}
