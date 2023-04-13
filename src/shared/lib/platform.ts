/**
 * Checks whether the current runtime is a client (browser)
 */
export const isBrowser = (): boolean => typeof window !== 'undefined';
export const isClient = isBrowser;

/**
 * Checks whether the current runtime is a server
 */
export const isServer = (): boolean => !isBrowser();

/**
 * Checks if touch supported
 */
export const isTouchDevice = () => {
  if (!isBrowser()) return false;
  return (
    'ontouchstart' in window ||
    'ontouchstart' in document.documentElement ||
    navigator.maxTouchPoints > 0 ||
    navigator.maxTouchPoints > 0
  );
};

/**
 * Returns whether running on a mobile device
 *
 * @return {boolean}
 */
export const isMobileDevice = (): boolean => {
  if (isBrowser()) {
    try {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    } catch (e: any) {
      console.error(e?.message);
    }
  }
  return false;
};

function testUserAgent(re: RegExp) {
  return isBrowser() && window.navigator != null ? re.test(window.navigator.userAgent) : false;
}

export function isFirefox() {
  return testUserAgent(/Firefox/);
}
