/**
 * Select a single DOM element using a CSS selector.
 * @param {string} selector - CSS selector string
 * @param {Element} [node=document] - Root element to search within
 * @returns {Element|null} The first matching element or null if not found
 */
export const $ = (selector, node = document) => node.querySelector(selector);

/**
 * Select multiple DOM elements using a CSS selector.
 * @param {string} selector - CSS selector string
 * @param {Element} [node=document] - Root element to search within
 * @returns {NodeList} A NodeList of matching elements
 */
export const $$ = (selector, node = document) => node.querySelectorAll(selector);

/**
 * Create an immutable (frozen) copy of an object.
 * @param {Object} o - The object to freeze
 * @returns {Object} The frozen object
 */
export const immutable = o => Object.freeze(o);
