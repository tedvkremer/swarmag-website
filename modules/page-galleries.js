import { $, $$ } from './core.js'
import Carousel from './Carousel.js'
import Website from './Website.js'
import PhotoCatalog from './PhotoCatalog.js'

export const init = () => initGalleries();

/*************************************
  Galleries
 *************************************/

function initGalleries() {
   $$('.Gallery').forEach(g => initGallery(g, PhotoCatalog.byGallery[g.id]));
}

function initGallery(gallery, photos) {
  const gid = gallery.id;
  const cid = `#${gid}>.Carousel`;
  const carousel = $(cid, gallery);
  const container = $('.CarouselContainer', carousel);
  const indicators = $('.CarouselIndicators', carousel);

  function createSlide(photo) {
    const attrs = `loading="lazy" src="${photo}" alt="swarmAg"`;
    const img = `<img class="Photo" ${attrs} />`;
    const slide = `<div class="CarouselSlide">${img}</div>`;
    container.insertAdjacentHTML('beforeend', slide);
  }

  function createDot(ndx) {
    const attrs = `aria-label="Go to slide ${ndx + 1}" tabindex="${ndx}"`;
    const dot = `<button class="CarouselDot" role="tab" ${attrs}></button>`;
    indicators.insertAdjacentHTML('beforeend', dot);
  }

  function createPhoto(photo, ndx) {
    createSlide(photo);
    createDot(ndx);
  }

  let ndx = 0;
  photos.forEach(photo => createPhoto(photo, ndx++));

  Website.the.galleries[gid] = {
    'gallery': gallery,
    'carousel': new Carousel(cid).init()
  };
}
