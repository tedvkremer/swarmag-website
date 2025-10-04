class Boid {
  static STYLE =
    `
    position: absolute;
    will-change: transform;
    transform: translate3d(0, 0, 0);
    border-radius: 50% 50% 50% 50% / 90% 90% 10% 10%;
    -webkit-user-select: none;
    user-select: none;
    `;

  #x = 0;
  #y = 0;
  #vx = 0;
  #vy = 0;
  #angle = 0;
  #size = 0;
  #speed = 0;
  #closestBoid = null;
  div = null;

  constructor(width, height, speed = 30, size = 8) {
    this.#size = size;
    this.#speed = speed;

    const ss = `width: ${width}px; height: ${height}px; background: #41fd80ff`;
    this.div = document.createElement('div');
    this.div.style = Boid.STYLE + ss;
  }

  update(swarm) {
    this.#closestBoid = this.getClosest(swarm.boids);
    if (!this.#closestBoid) return;

    let hx, hy;

    if (swarm.targetX && swarm.targetY) {
      hx = swarm.targetX - this.#x;
      hy = swarm.targetY - this.#y;
    } else {
      hx = this.#closestBoid.x - this.#x;
      hy = this.#closestBoid.y - this.#y;
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

    const dxClosest = this.#closestBoid.x - this.#x;
    const dyClosest = this.#closestBoid.y - this.#y;
    const normClosest = Math.sqrt(dxClosest * dxClosest + dyClosest * dyClosest);
    const distClosest = Math.sqrt(dxClosest * dxClosest + dyClosest * dyClosest) - this.#closestBoid.size;
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

  getClosest(boids) {
    let dist = Infinity;
    let closest = null;

    for (let i = boids.length; i--;) {
      const b = boids[i];
      if (this !== b) {
        const dx = b.#x - this.#x;
        const dy = b.#y - this.#y;
        const d = dx * dx + dy * dy - b.#size * b.#size;
        if (d < dist) {
          dist = d;
          closest = b;
        }
      }
    }

    return closest;
  }
}

class Swarm {
  static TURN_SPEED = 0.05;
  static MIN_DIST = 6;
  static MAX_DIST = 30;
  static MOUSE_DIST = 300;
  static STYLE =
    `
    position: absolute;
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    user-select: none;
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
    color: #fff; 
    z-index: 99;
    `;
  static HIDE = Swarm.STYLE +
    `
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.3s ease-in-out, visibility 0s linear 0.3s;
    `;
  static SHOW = Swarm.STYLE +
    `
    visibility: visible;
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
    `;

  #boids = [];
  #targetX = 0;
  #targetY = 0;
  #container = null;
  #home = null;
  #updateID = 0;
  #scatterID = 0;

  get boids() { return this.#boids; }
  get targetX() { return this.#targetX; }
  get targetY() { return this.#targetY; }
  get width() { return this.#container.offsetWidth; }
  get height() { return this.#container.offsetHeight; }
  get animating() { return this.#container.style.visibility === 'visible'; }

  init() {
    this.#home = document.querySelector('#swarm-home');
    this.#home.onclick = () => this.toggle();

    this.#container = document.createElement('div');
    this.#container.style = Swarm.HIDE;
    const container = document.querySelector('#swarm-container');
    container.appendChild(this.#container);
  }

  addBoid(b) {
    this.#container.appendChild(b.div);
    this.#boids.push(b);
  }

  createBoids(total, width, height, speed) {
    for (let i = total; i--;) {
      const b = new Boid(width, height, speed);
      b.x = Math.random() * this.width;
      b.y = Math.random() * this.height;
      b.angle = Math.random() * 360;
      this.addBoid(b);
    }
  }

  target(x, y) {
    this.#targetX = x;
    this.#targetY = y;
  }

  home() {
    this.target(
      this.#home.offsetLeft + 90,
      this.#home.offsetTop + 55
    );
    // scatter after return home
    if (this.#scatterID) clearTimeout(this.#scatterID);
    this.#scatterID = setTimeout(() => this.scatter(), 9000);
  }

  scatter() {
    this.target(
      Math.random() * this.width,
      Math.random() * this.height
    );
    // return home after scatter
    if (this.#scatterID) clearTimeout(this.#scatterID);
    this.#scatterID = setTimeout(() => this.home(), 9000);
  }

  update() {
    try {
      this.#updateID = requestAnimationFrame(() => this.update());

      for (let i = this.#boids.length; i--;) {
        this.#boids[i].update(this);
      }
    }
    catch (e) {
      this.stop();
      console.error(e);
    }
  }

  toggle() {
    this.animating ? this.stop() : this.start();
  }

  start() {
    if (this.#updateID) return;

    window.onmousedown = (e) => this.target(e.pageX, e.pageY);
    document.ontouchstart = (e) => this.target(e.targetTouches[0].pageX, e.targetTouches[0].pageY);

    this.home();
    this.update();

    this.#container.style = Swarm.SHOW;
  }

  stop() {
    if (this.#updateID) cancelAnimationFrame(this.#updateID);
    if (this.#scatterID) clearTimeout(this.#scatterID);

    this.#updateID = this.#scatterID = 0;
    window.onmousedown = null;
    document.ontouchstart = null;
    this.#targetX = this.#targetY = 0;

    this.#container.style = Swarm.HIDE;
  }

  static get the() {
    if (!window._swarm) throw new Error('bootstrap() must be completed first!');
    return window._swarm;
  }

  static bootstrap() {
    if (window._swarm) {
      console.log('bootstrap() already completed!');
      return;
    }

    const swarm = new Swarm();
    try {
      swarm.init();
      swarm.createBoids(30, 10, 10, 3);
      window._swarm = swarm;
    }
    catch (e) {
      console.error(e);
    }
  }
}

Swarm.bootstrap();
