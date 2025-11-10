import { immutable, shuffle } from './utils.js'

/**
 * Photo Catalog Class
 *
 * Manages a collection of photo galleries with immutable data structures.
 * Provides access to predefined galleries like aerial and ground photos.
 */
export default class PhotoCatalog {
  static #GALLERIES = immutable({
    "gallery-aerial": immutable(shuffle([
      "../galleries/aerial/g1-photo-00.webp",
      "../galleries/aerial/g1-photo-01.webp",
      "../galleries/aerial/g1-photo-02.webp",
      "../galleries/aerial/g1-photo-03.webp",
      "../galleries/aerial/g1-photo-04.webp",
      "../galleries/aerial/g1-photo-05.webp",
      "../galleries/aerial/g1-photo-06.webp",

    ], 5)),
    "gallery-ground": immutable(shuffle([
      "../galleries/ground/g2-photo-00.webp",
      "../galleries/ground/g2-photo-01.webp",
      "../galleries/ground/g2-photo-02.webp",
      "../galleries/ground/g2-photo-03.webp",
      "../galleries/ground/g2-photo-04.webp",
      "../galleries/ground/g2-photo-05.webp",
      "../galleries/ground/g2-photo-06.webp",
      "../galleries/ground/g2-photo-07.webp",
      "../galleries/ground/g2-photo-08.webp",
      "../galleries/ground/g2-photo-09.webp",
    ], 6))
  });

  /**
   * Get the immutable galleries object.
   * @static
   * @returns {Object} Immutable object containing gallery arrays
   */
  static get byGallery() { return PhotoCatalog.#GALLERIES; }
}
