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
      "../galleries/aerial/aerial-01.webp",
      "../galleries/aerial/aerial-02.webp",
      "../galleries/aerial/aerial-03.webp",
      "../galleries/aerial/aerial-04.webp",
      "../galleries/aerial/aerial-05.webp",
      "../galleries/aerial/aerial-06.webp",
    ])),
    "gallery-ground": immutable(shuffle([
      "../galleries/ground/ground-01.webp",
      "../galleries/ground/ground-02.webp",
      "../galleries/ground/ground-03.webp",
      "../galleries/ground/ground-04.webp",
      "../galleries/ground/ground-05.webp",
      "../galleries/ground/ground-06.webp",
      "../galleries/ground/ground-07.webp",
      "../galleries/ground/ground-08.webp",
      "../galleries/ground/ground-09.webp",
      "../galleries/ground/ground-10.webp",
    ], 6))
  });

  /**
   * Get the immutable galleries object.
   * @static
   * @returns {Object} Immutable object containing gallery arrays
   */
  static get byGallery() { return PhotoCatalog.#GALLERIES; }
}
