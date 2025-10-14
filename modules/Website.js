import Swarm from './Swarm.js'

/*************************************
  Website Application Singleton
 *************************************/

export default class Website {
  #galleries = new Map();
  #swarm = new Swarm();

  get galleries() { return this.#galleries; }

  #init(modules = []) {
    try {
      this.#load(modules);

      // Initialize swarm of bees effect (easter-egg)
      this.#swarm.init();
      this.#swarm.create(30, 10, 10, 3);
    } catch (e) {
      console.error(e);
    }
  }

  #load(modules = []) {
    modules.forEach(async (m) => {
      try {
        const module = await import(`./${m}.js`);
        module.init();
      } catch (e) {
        console.error(e);
      }
    });
  }

  static get the() {
    if (!window._sa_website) throw new Error('bootstrap() must be completed first!');
    return window._sa_website;
  }

  static bootstrap(modules = []) {
    if (window._sa_website) {
      console.error("bootstrap() already completed!");
      return;
    }

    window._sa_website = new Website();
    window.addEventListener(
      'DOMContentLoaded',
      () => window._sa_website.#init(modules)
    );
  }
}
