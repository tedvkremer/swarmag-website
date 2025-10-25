
/**
 * Initialize error handling for the page.
 * Sets up global error and unhandled rejection listeners.
 */
export const init = () => initErrorHandlers();

/**
 * Set up global error and unhandled rejection handlers.
 */
function initErrorHandlers() {
  window.addEventListener('error', e => {
    console.error('JavaScript error:', e.error);
    // Could send to error tracking service
  });

  window.addEventListener('unhandledrejection', e => {
    console.error('Unhandled promise rejection:', e.reason);
    // Could send to error tracking service
  });
}
