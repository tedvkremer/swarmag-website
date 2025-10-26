/**
 * Swarm Animation Class
 *
 * Manages a collection of "bee" boids that exhibit flocking behavior.
 * Implements a particle system with realistic swarm intelligence including
 * collision avoidance, velocity matching, and flock centering behaviors.
 * Used as an interactive visual effect that responds to user input.
 */
export default class Swarm {
  /** @static {number} Rate at which boids can change direction (0.05 = 5% per frame) */
  static TURN_SPEED = 0.05;

  /** @static {number} Minimum distance boids should maintain from each other */
  static MIN_DIST = 6;

  /** @static {number} Maximum distance at which boids influence each other */
  static MAX_DIST = 30;

  /** @static {number} Distance at which mouse interaction affects boid behavior */
  static MOUSE_DIST = 300;

  /** @static {string} Base CSS styles for the swarm container */
  static STYLE =
    `
    position: absolute;
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    user-select: none;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
    color: #fff;
    `;

  /** @static {string} CSS styles for hiding the swarm with fade transition */
  static HIDE = Swarm.STYLE +
    `
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.3s ease-in-out, visibility 0s linear 0.3s;
    `;

  /** @static {string} CSS styles for showing the swarm with fade transition */
  static SHOW = Swarm.STYLE +
    `
    visibility: visible;
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
    `;

  /** @private {Bee[]} Array of bee boid instances */
  #boids = [];

  /** @private {number} Target X coordinate for swarm behavior */
  #targetX = 0;

  /** @private {number} Target Y coordinate for swarm behavior */
  #targetY = 0;

  /** @private {HTMLElement|null} DOM container element for the swarm */
  #container = null;

  /** @private {HTMLElement|null} Home position element that triggers swarm behavior */
  #home = null;

  /** @private {number} RequestAnimationFrame ID for the animation loop */
  #updateID = 0;

  /** @private {number} Timeout ID for scatter/home behavior cycling */
  #scatterID = 0;

  /**
   * Get the array of bee boids.
   * @returns {Bee[]} Array of Bee instances
   */
  get boids() { return this.#boids; }

  /**
   * Get the target X coordinate.
   * @returns {number} Target X position in pixels
   */
  get targetX() { return this.#targetX; }

  /**
   * Get the target Y coordinate.
   * @returns {number} Target Y position in pixels
   */
  get targetY() { return this.#targetY; }

  /**
   * Get the swarm container width.
   * @returns {number} Width in pixels
   */
  get width() { return this.#container.offsetWidth; }

  /**
   * Get the swarm container height.
   * @returns {number} Height in pixels
   */
  get height() { return this.#container.offsetHeight; }

  /**
   * Check if the swarm animation is currently running.
   * @returns {boolean} True if animation is visible and running
   */
  get animating() { return this.#container.style.visibility === 'visible'; }

  /**
   * Initialize the swarm by setting up DOM elements and event listeners.
   * Must be called before using the swarm. Sets up home element click handler
   * and creates the main container element.
   * @returns {Swarm} This swarm instance for method chaining
   */
  init() {
    this.#home = document.querySelector('#swarm-home');
    this.#home.onclick = () => this.toggle();

    this.#container = document.createElement('div');
    this.#container.style = Swarm.HIDE;
    const container = document.querySelector('#swarm-container');
    container.appendChild(this.#container);

    return this;
  }

  /**
   * Add a bee boid to the swarm.
   * @param {Bee} b - The bee instance to add
   */
  addBee(b) {
    this.#container.appendChild(b.div);
    this.#boids.push(b);
  }

  /**
   * Create multiple bee boids with random positions and angles.
   * @param {number} total - Number of bees to create
   * @param {number} width - Width of each bee in pixels
   * @param {number} height - Height of each bee in pixels
   * @param {number} speed - Movement speed of each bee
   */
  create(total, width, height, speed) {
    for (let i = total; i--;) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const angle = Math.random() * 360;
      const b = new Bee(width, height, speed, x, y, angle);
      this.addBee(b);
    }
  }

  /**
   * Set the target coordinates for swarm behavior.
   * @param {number} x - Target X coordinate in pixels
   * @param {number} y - Target Y coordinate in pixels
   */
  target(x, y) {
    this.#targetX = x;
    this.#targetY = y;
  }

  /**
   * Move swarm to home position (center of home element).
   * Automatically schedules scatter behavior after a delay.
   */
  home() {
    this.target(
      this.#home.offsetLeft + this.#home.offsetWidth / 2,
      this.#home.offsetTop + this.#home.offsetHeight / 2
    );

    // scatter after return home
    if (this.#scatterID) clearTimeout(this.#scatterID);
    this.#scatterID = setTimeout(
      () => this.scatter(),
      this.getDurationForScreenSize()
    );
  }

  /**
   * Scatter swarm to origin point (0, 0).
   * Automatically schedules return home after a delay.
   */
  scatter() {
    this.target(0, 0);

    // return home after scatter
    if (this.#scatterID) clearTimeout(this.#scatterID);
    this.#scatterID = setTimeout(
      () => this.home(),
      this.getDurationForScreenSize()
    );
  }

  /**
   * Main animation loop that updates all bee positions.
   * Uses requestAnimationFrame for smooth animation.
   * @private
   */
  update() {
    try {
      this.#updateID = requestAnimationFrame(() => this.update());

      for (let i = this.#boids.length; i--;) {
        this.#boids[i].update(this);
      }
    } catch (e) {
      this.stop();
      console.error(e);
    }
  }

  /**
   * Toggle the swarm animation on/off.
   * Convenience method that calls start() or stop() based on current state.
   */
  toggle() {
    this.animating ? this.stop() : this.start();
  }

  /**
   * Start the swarm animation and interactive behavior.
   * Sets up mouse/touch event listeners and begins the animation loop.
   * Does nothing if animation is already running.
   */
  start() {
    if (this.#updateID) return;

    window.onmousedown = (e) => this.target(e.pageX, e.pageY);
    document.ontouchstart = (e) => this.target(e.targetTouches[0].pageX, e.targetTouches[0].pageY);

    this.update();
    this.scatter();
    this.#container.style = Swarm.SHOW;
  }

  /**
   * Stop the swarm animation and clean up resources.
   * Cancels animation frames, clears timers, and removes event listeners.
   */
  stop() {
    if (this.#updateID) cancelAnimationFrame(this.#updateID);
    if (this.#scatterID) clearTimeout(this.#scatterID);

    this.#updateID = this.#scatterID = 0;
    window.onmousedown = null;
    document.ontouchstart = null;
    this.#targetX = this.#targetY = 0;

    this.#container.style = Swarm.HIDE;
  }

  /** @static {number} Minimum scatter/home duration in seconds */
  static MIN_SECONDS = 5;

  /** @static {number} Maximum scatter/home duration in seconds */
  static MAX_SECONDS = 15;

  /** @static {number} Minimum screen width for duration calculation */
  static LOW_END_WIDTH = 320;

  /** @static {number} Minimum screen height for duration calculation */
  static LOW_END_HEIGHT = 695;

  /** @static {number} Maximum screen width for duration calculation */
  static HIGH_END_WIDTH = 2560;

  /** @static {number} Maximum screen height for duration calculation */
  static HIGH_END_HEIGHT = 1245;

  /**
   * Calculate scatter/home duration based on screen size.
   * Uses linear interpolation to map screen area to duration range.
   * @returns {number} Duration in milliseconds
   */
  getDurationForScreenSize() {
    const minArea = Swarm.LOW_END_WIDTH * Swarm.LOW_END_HEIGHT;
    const maxArea = Swarm.HIGH_END_WIDTH * Swarm.HIGH_END_HEIGHT;
    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;
    const currentArea = currentWidth * currentHeight;

    // Clamp the current area to the defined range to avoid unexpected results
    const clampedArea = Math.max(minArea, Math.min(maxArea, currentArea));

    // Perform linear interpolation (mapping one range to another)
    // (value - oldMin) / (oldMax - oldMin) * (newMax - newMin) + newMin
    const seconds =
      ((clampedArea - minArea) / (maxArea - minArea)) *
      (Swarm.MAX_SECONDS - Swarm.MIN_SECONDS) +
      Swarm.MIN_SECONDS;

    return Math.round(seconds * 1000);
  }
}

/**
 * Individual Bee Boid Class
 *
 * Represents a single boid (bird-like object) in the swarm with autonomous
 * flocking behavior. Each bee implements Craig Reynolds' boid algorithm
 * with separation, alignment, and cohesion rules for realistic swarm motion.
 */
export class Bee {
  /** @static {string} Base CSS styles for individual bee elements */
  static STYLE =
    `
    position: absolute;
    will-change: transform;
    transform: translate3d(0, 0, 0);
    border-radius: 50% 50% 50% 50% / 90% 90% 10% 10%;
    -webkit-user-select: none;
    user-select: none;
    background: #fdf041ff;
    `;

  /** @private {number} Current X position in pixels */
  #x = 0;

  /** @private {number} Current Y position in pixels */
  #y = 0;

  /** @private {number} Current movement angle in radians */
  #angle = 0;

  /** @private {number} Velocity X component */
  #vx = 0;

  /** @private {number} Velocity Y component */
  #vy = 0;

  /** @private {number} Size of the bee (maximum of width/height) */
  #size = 0;

  /** @private {number} Movement speed multiplier */
  #speed = 0;

  /** @private {Bee|null} Reference to nearest neighboring bee */
  #closest = null;

  /** @private {HTMLElement} DOM element representing the bee visually */
  div = null;

  /**
   * Get the current X position.
   * @returns {number} X coordinate in pixels
   */
  get x() { return this.#x; }

  /**
   * Get the current Y position.
   * @returns {number} Y coordinate in pixels
   */
  get y() { return this.#y; }

  /**
   * Create a new bee boid with specified parameters.
   * @param {number} width - Visual width of the bee in pixels
   * @param {number} height - Visual height of the bee in pixels
   * @param {number} speed - Movement speed multiplier
   * @param {number} [x=0] - Initial X position in pixels
   * @param {number} [y=0] - Initial Y position in pixels
   * @param {number} [angle=0] - Initial movement angle in radians
   */
  constructor(width, height, speed, x = 0, y = 0, angle = 0) {
    this.#speed = speed;
    this.#angle = angle;
    this.#x = x;
    this.#y = y;
    this.#size = Math.max(width, height);

    const ss = `width: ${width}px; height: ${height}px`;
    this.div = document.createElement('div');
    this.div.style = Bee.STYLE + ss;
  }

  /**
   * Update bee behavior based on flocking algorithm.
   * Implements Craig Reynolds' boid rules: separation, alignment, cohesion.
   * Responds to mouse input and nearest neighbor interactions.
   * @param {Swarm} swarm - Reference to parent swarm for target and bounds data
   */
  update(swarm) {
    this.#closest = this.getClosest(swarm.boids);
    if (!this.#closest) return;

    let hx, hy;

    if (swarm.targetX && swarm.targetY) {
      hx = swarm.targetX - this.#x;
      hy = swarm.targetY - this.#y;
    } else {
      hx = this.#closest.x - this.#x;
      hy = this.#closest.y - this.#y;
    }

    const distHeading = Math.sqrt(hx * hx + hy * hy);
    let vxHeading, vyHeading;

    if (distHeading > Swarm.MOUSE_DIST) {
      vxHeading = Math.random() - 0.5;
      vyHeading = Math.random() - 0.5;
    } else {
      vxHeading = hx / distHeading;
      vyHeading = hy / distHeading;
    }

    const dxClosest = this.#closest.x - this.#x;
    const dyClosest = this.#closest.y - this.#y;
    const normClosest = Math.sqrt(dxClosest * dxClosest + dyClosest * dyClosest);
    const distClosest = Math.sqrt(dxClosest * dxClosest + dyClosest * dyClosest) - this.#closest.size;
    const vxClosest = dxClosest / normClosest;
    const vyClosest = dyClosest / normClosest;
    let vxAverage, vyAverage;

    if (distClosest > Swarm.MAX_DIST) {
      vxAverage = vxHeading + vxClosest;
      vyAverage = vyHeading + vyClosest;
    } else if (distClosest < Swarm.MIN_DIST) {
      vxAverage = -vxClosest;
      vyAverage = -vyClosest;
    } else {
      vxAverage = vxHeading;
      vyAverage = vyHeading;
    }

    let normAverage = Math.sqrt(vxAverage * vxAverage + vyAverage * vyAverage);

    vxAverage = vxAverage / normAverage;
    vyAverage = vyAverage / normAverage;

    const crossProduct = this.#vx * vyAverage - this.#vy * vxAverage;
    const angleDifference = Math.abs((this.#vx * vxAverage + this.#vy * vyAverage > 0) ? Math.asin(crossProduct) : Math.PI - Math.asin(crossProduct));

    if (crossProduct > 0) {
      this.#angle += angleDifference * Swarm.TURN_SPEED; // Turn right
    } else {
      this.#angle -= angleDifference * Swarm.TURN_SPEED; // Turn left
    }

    this.#vx = Math.cos(this.#angle);
    this.#vy = Math.sin(this.#angle);

    this.move(swarm);
  }

  /**
   * Update bee position and handle screen boundary wrapping.
   * Applies velocity to position and wraps around screen edges.
   * Updates DOM element transform for visual positioning.
   * @param {Swarm} swarm - Reference to parent swarm for bounds data
   * @private
   */
  move(swarm) {
    const w = swarm.width;
    const h = swarm.height;

    this.#x += this.#vx * this.#speed;
    this.#y += this.#vy * this.#speed;

    if (this.#x < -this.#size * 2) {
      this.#x = w;
    } else if (this.#x > w + this.#size) {
      this.#x = -this.#size;
    }
    if (this.#y < -this.#size * 3) {
      this.#y = h;
    } else if (this.#y > h + this.#size) {
      this.#y = -this.#size;
    }

    const deg = (this.#angle * 180 / Math.PI) - 90;
    this.div.style.transform = `translate3d(${this.#x}px,${this.#y}px,0) rotateZ(${deg}deg)`;
  }

  /**
   * Find the closest neighboring bee for flocking calculations.
   * @param {Bee[]} boids - Array of all bees in the swarm
   * @returns {Bee|null} Closest bee or null if none found
   * @private
   */
  getClosest(boids) {
    let dist = Infinity;
    let find = null;

    for (let i = boids.length; i--;) {
      const b = boids[i];
      if (this !== b) {
        const dx = b.#x - this.#x;
        const dy = b.#y - this.#y;
        const dl = dx * dx + dy * dy - b.#size * b.#size;
        if (dl < dist) {
          dist = dl;
          find = b;
        }
      }
    }

    return find;
  }
}
