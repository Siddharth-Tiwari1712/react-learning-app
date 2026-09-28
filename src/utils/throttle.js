// THROTTLING: run `fn` at most once per `limit` ms (first call goes through,
// extra calls inside the window are dropped).
// Debounce = wait until the user STOPS. Throttle = at most every N ms while they continue.
export function throttle(fn, limit = 200) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= limit) {
      last = now;
      fn(...args);
    }
  };
}
