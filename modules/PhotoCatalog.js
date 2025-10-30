import { immutable } from './core.js'

const order = (a, max) => immutable(a.sort(() => Math.random() - 0.5).slice(0, max || a.length));

/**
 * Photo Catalog Class
 *
 * Manages a collection of photo galleries with immutable data structures.
 * Provides access to predefined galleries like areal and ground photos.
 */
export default class PhotoCatalog {
  static #GALLERIES = immutable({
    "gallery-areal": order([
      "../galleries/areal/g1-photo-00.jpg",
      "../galleries/areal/g1-photo-01.jpg",
      "../galleries/areal/g1-photo-02.jpg",
      "../galleries/areal/g1-photo-03.jpg",
      "../galleries/areal/g1-photo-04.jpg",
      "../galleries/areal/g1-photo-05.jpg",
      "../galleries/areal/g1-photo-06.jpg",
    ], 5),
    "gallery-ground": order([
      "../galleries/ground/g2-photo-00.jpg",
      "../galleries/ground/g2-photo-01.jpg",
      "../galleries/ground/g2-photo-02.jpg",
      "../galleries/ground/g2-photo-03.jpg",
      "../galleries/ground/g2-photo-04.jpg",
      "../galleries/ground/g2-photo-05.jpg",
      "../galleries/ground/g2-photo-06.jpg",
      "../galleries/ground/g2-photo-07.jpg",
      "../galleries/ground/g2-photo-08.jpg",
      "../galleries/ground/g2-photo-09.jpg",
    ], 5)
  });

  /**
   * Get the immutable galleries object.
   * @static
   * @returns {Object} Immutable object containing gallery arrays
   */
  static get byGallery() { return PhotoCatalog.#GALLERIES; }
}
