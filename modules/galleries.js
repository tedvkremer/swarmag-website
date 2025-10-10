const $ = (selector, node = document) => node.querySelector(selector);
const $$ = (selector, node = document) => node.querySelectorAll(selector);

export const init = () => initGalleries();

function initGalleries() {
  $$('.Gallery').forEach(g => initGallery(g));
}

/*************************************
  Gallery Carousel
 *************************************/

function initGallery(gallery) {

}