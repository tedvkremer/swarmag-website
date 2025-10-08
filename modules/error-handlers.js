
export const init = () => initErrorHandlers();

/*************************************
  Add loading states and error boundaries
 *************************************/

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

