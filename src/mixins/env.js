/**
 * env
 * author: Cai Jieying
 */

export function detectOS(ua) {
  ua = ua || navigator.userAgent;
  return {
    ios: /ip(hone|od)|ipad/i.test(ua),
    android: /android/i.test(ua) && !/ip(hone|od)|ipad/i.test(ua)
  }
}