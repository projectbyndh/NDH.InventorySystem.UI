import { showToast } from './toast';

/**
 * Centralized error handler that logs and shows a toast.
 * @param {unknown} err
 * @param {{title?:string, rethrow?:boolean}} opts
 */
export function handleError(err, opts = {}) {
  try {
    const { title, rethrow } = opts;
    const message = (err && (err.message || err.toString && err.toString())) || 'Unexpected error';
    console.error(title ? `${title}:` : 'Error:', err);
    showToast(`${title ? title + ': ' : ''}${message}`, 'error', 8000);
    if (rethrow) throw err;
  } catch (e) {
    // Best effort: log fallback
    try {
      console.error('Error in handleError', e);
    } catch {}
  }
}

/**
 * Wrap an async function to ensure thrown errors are handled by `handleError`.
 * Useful for onClick/onSubmit handlers to avoid repeating try/catch.
 * @param {(function(...any): Promise<any>)} fn
 */
export function wrapAsync(fn, opts = {}) {
  return async function wrapped(...args) {
    try {
      return await fn(...args);
    } catch (err) {
      handleError(err, opts);
      // swallow by default; caller can pass opts.rethrow to propagate
      if (opts.rethrow) throw err;
      return undefined;
    }
  };
}

export default { handleError, wrapAsync };
