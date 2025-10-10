import Carousel from './Carousel.js'

const $ = (selector, node = document) => node.querySelector(selector);
const $$ = (selector, node = document) => node.querySelectorAll(selector);

const GALLERIES = {
  "gallery-areal": [
    "../galleries/g1-photo-1.jpg",
    "../galleries/g1-photo-2.jpg",
    "../galleries/g1-photo-3.jpg",
    "../galleries/g1-photo-4.jpg",
    "../galleries/g1-photo-5.jpg",
    "../galleries/g1-photo-6.jpg",
  ],
  "gallery-ground": [
    "../galleries/g2-photo-1.jpg",
    "../galleries/g2-photo-2.jpg",
    "../galleries/g2-photo-3.jpg",
    "../galleries/g2-photo-4.jpg",
    "../galleries/g2-photo-5.jpg",
    "../galleries/g2-photo-6.jpg",
  ]
};

export const init = () => initGalleries();

/*************************************
  Galleries
 *************************************/

function initGalleries() {
  $$('.Gallery').forEach(g => initGallery(g));
}

function initGallery(gallery) {
  const id = `#{gallery.id}.Carousel`;
  const carousel = $(id, gallery);
  const container = $('.CarouselContainer', carousel);
  const indicators = $('.CarouselIndicators', carousel);

  function createSlide(photo, pos) {
    const slide = `
      <div class="CarouselSlide" style="transform: translateX(${pos}%)">
        <img class="CarouselSlideImage" src="${photo}" alt="swarmAg" />
      </div>
    `;
    container.appendHTML(slide);
  }

  function createDot(ndx) {
    const dot = `
      <button class="CarouselDot" role="tab" aria-label="Go to slide ${ndx}" tabindex="-1"></button>
    `;
    indicators.appendHTML(dot);
  }

  function createPhoto(photo, pos, ndx) {
    createSlide(photo, pos);
    createDot(ndx);
  }

  let pos = 0, ndx = 0;
  GALLERIES[gallery.id].forEach(
    photo => createPhoto(photo, pos += 100, ndx++)
  );

  new Carousel(id).init();
}
