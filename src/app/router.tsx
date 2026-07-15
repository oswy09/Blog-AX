// URL sync utility — updates the browser URL without routing.
// Navigation is always state-based so it works inside Figma Make iframes.

export function pushURL(path: string) {
  try {
    history.pushState(null, '', path);
  } catch (_) {}
}

export function getInitialPath(): string {
  try {
    return window.location.pathname || '/';
  } catch (_) {
    return '/';
  }
}
