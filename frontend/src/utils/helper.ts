//TODO: fix this!!! just for test!!
const BACKEND_URL = 'http://localhost:3000';

export function getImageUrl(path: string) {
  return path.startsWith('http') ? path : `${BACKEND_URL}${path}`;
}

export const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
  try {
    window.scrollTo({ top: 0, behavior })
  } catch (err) {
    window.scrollTo(0, 0)
  }
}
