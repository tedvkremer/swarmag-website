const immutable = o => Object.freeze(o);

/*************************************
  Photo Catalog
 *************************************/

export default class PhotoCatalog {
  static GALLERIES = immutable({
    "gallery-areal": immutable([
      "../galleries/areal/g1-photo-1.jpg",
      "../galleries/areal/g1-photo-2.jpg",
      "../galleries/areal/g1-photo-3.jpg",
      "../galleries/areal/g1-photo-4.jpg",
      "../galleries/areal/g1-photo-5.jpg",
      "../galleries/areal/g1-photo-6.jpg",
    ]),
    "gallery-ground": immutable([
      "../galleries/ground/g2-photo-1.jpg",
      "../galleries/ground/g2-photo-2.jpg",
      "../galleries/ground/g2-photo-3.jpg",
      "../galleries/ground/g2-photo-4.jpg",
      "../galleries/ground/g2-photo-5.jpg",
      "../galleries/ground/g2-photo-6.jpg",
    ])
  });

  static get byGallery() { return this.GALLERIES; }
}