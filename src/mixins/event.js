/**
 * 是否支持passive
 */
export let passiveSupported = false;
try {
  window.addEventListener(
    "test",
    () => {},
    Object.defineProperty({}, "passive", {
      get: function() {
        passiveSupported = true;
      }
    })
  );
} catch (err) {}